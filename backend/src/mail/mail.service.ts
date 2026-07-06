import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

type PqrCreatedMail = {
  to: string;
  nombre: string;
  radicado: string;
  titulo: string;
  categoria: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.from =
      this.configService.get<string>('MAIL_FROM') ?? 'PQR <no-reply@pqr.local>';
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST') ?? 'localhost',
      port: Number(this.configService.get<string>('MAIL_PORT') ?? 1025),
      secure: false,
    });
  }

  async sendPqrCreatedConfirmation(payload: PqrCreatedMail) {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: payload.to,
        subject: `PQR registrada ${payload.radicado}`,
        text: this.buildText(payload),
        html: this.buildHtml(payload),
      });
    } catch (error) {
      this.logger.warn(
        `No fue posible enviar correo para ${payload.radicado}: ${
          error instanceof Error ? error.message : 'error desconocido'
        }`,
      );
    }
  }

  private buildText(payload: PqrCreatedMail) {
    return [
      `Hola ${payload.nombre},`,
      '',
      'Tu PQR fue registrada correctamente.',
      '',
      `Radicado: ${payload.radicado}`,
      `Titulo: ${payload.titulo}`,
      `Categoria: ${payload.categoria}`,
      '',
      'Conserva este radicado para consultar el seguimiento de la solicitud.',
    ].join('\n');
  }

  private buildHtml(payload: PqrCreatedMail) {
    const nombre = this.escapeHtml(payload.nombre);
    const radicado = this.escapeHtml(payload.radicado);
    const titulo = this.escapeHtml(payload.titulo);
    const categoria = this.escapeHtml(payload.categoria);

    return `
      <p>Hola ${nombre},</p>
      <p>Tu PQR fue registrada correctamente.</p>
      <ul>
        <li><strong>Radicado:</strong> ${radicado}</li>
        <li><strong>Titulo:</strong> ${titulo}</li>
        <li><strong>Categoria:</strong> ${categoria}</li>
      </ul>
      <p>Conserva este radicado para consultar el seguimiento de la solicitud.</p>
    `;
  }

  private escapeHtml(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
