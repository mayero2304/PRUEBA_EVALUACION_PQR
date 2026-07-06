import { Injectable, MessageEvent } from '@nestjs/common';
import { Notificacion, TipoNotificacion } from '@prisma/client';
import { interval, map, merge, Observable, Subject } from 'rxjs';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

type PqrCreatedNotification = {
  pqrId: string;
  radicado: string;
  titulo: string;
  categoria: string;
  solicitanteNombre: string;
  solicitanteEmail: string;
};

type NotificationEvent = {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: TipoNotificacion;
  leida: boolean;
  pqrId: string | null;
  createdAt: Date;
};

@Injectable()
export class NotificacionesService {
  private readonly events$ = new Subject<NotificationEvent>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async notifyPqrCreated(payload: PqrCreatedNotification) {
    const notification = await this.prisma.notificacion.create({
      data: {
        titulo: 'Nueva PQR registrada',
        mensaje: `Se registro la PQR ${payload.radicado}.`,
        tipo: TipoNotificacion.nueva_pqr,
        pqrId: payload.pqrId,
      },
    });

    this.events$.next(this.toEvent(notification));

    await this.mailService.sendPqrCreatedConfirmation({
      to: payload.solicitanteEmail,
      nombre: payload.solicitanteNombre,
      radicado: payload.radicado,
      titulo: payload.titulo,
      categoria: payload.categoria,
    });
  }

  async findRecent() {
    const [items, unreadCount] = await this.prisma.$transaction([
      this.prisma.notificacion.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          pqr: {
            select: {
              id: true,
              radicado: true,
              titulo: true,
            },
          },
        },
      }),
      this.prisma.notificacion.count({
        where: {
          leida: false,
        },
      }),
    ]);

    return {
      data: items,
      unreadCount,
    };
  }

  async markAsRead(id: string) {
    return this.prisma.notificacion.update({
      where: {
        id,
      },
      data: {
        leida: true,
      },
    });
  }

  stream(): Observable<MessageEvent> {
    const notifications$ = this.events$.asObservable().pipe(
      map((notification) => ({
        type: 'notificacion',
        data: notification,
      })),
    );
    const heartbeat$ = interval(25000).pipe(
      map(() => ({
        type: 'heartbeat',
        data: {
          ok: true,
        },
      })),
    );

    return merge(notifications$, heartbeat$);
  }

  private toEvent(notification: Notificacion): NotificationEvent {
    return {
      id: notification.id,
      titulo: notification.titulo,
      mensaje: notification.mensaje,
      tipo: notification.tipo,
      leida: notification.leida,
      pqrId: notification.pqrId,
      createdAt: notification.createdAt,
    };
  }
}
