import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { createPqr } from '../services/pqrService';
import type {
  CanalPqr,
  CreatePqrPayload,
  CreatePqrResponse,
  PrioridadPqr,
  TipoPqr,
} from '../types/pqr';

type FormState = {
  nombre: string;
  apellido: string;
  identificacion: string;
  email: string;
  telefono: string;
  tipo: TipoPqr;
  titulo: string;
  categoria: string;
  prioridad: PrioridadPqr;
  canal: CanalPqr;
  descripcion: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type PqrRequestFormProps = {
  mode?: 'internal' | 'public';
};

const initialFormState: FormState = {
  nombre: '',
  apellido: '',
  identificacion: '',
  email: '',
  telefono: '',
  tipo: 'peticion',
  titulo: '',
  categoria: '',
  prioridad: 'media',
  canal: 'web',
  descripcion: '',
};

const requiredFields: Array<keyof FormState> = [
  'nombre',
  'apellido',
  'identificacion',
  'email',
  'titulo',
  'categoria',
  'descripcion',
];

function validateForm(form: FormState) {
  const errors: FormErrors = {};

  requiredFields.forEach((field) => {
    if (!form[field].trim()) {
      errors[field] = 'Campo obligatorio.';
    }
  });

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Correo invalido.';
  }

  if (form.descripcion.trim().length > 0 && form.descripcion.trim().length < 10) {
    errors.descripcion = 'La descripcion debe tener al menos 10 caracteres.';
  }

  return errors;
}

function buildPayload(form: FormState): CreatePqrPayload {
  return {
    solicitante: {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      identificacion: form.identificacion.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim() || undefined,
    },
    tipo: form.tipo,
    titulo: form.titulo.trim(),
    descripcion: form.descripcion.trim(),
    categoria: form.categoria.trim(),
    prioridad: form.prioridad,
    canal: form.canal,
  };
}

export function PqrRequestForm({ mode = 'internal' }: PqrRequestFormProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [createdPqr, setCreatedPqr] = useState<CreatePqrResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
    setSubmitError(null);
    setCreatedPqr(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setCreatedPqr(null);

    try {
      const result = await createPqr(buildPayload(form));

      setCreatedPqr(result);
      setForm(initialFormState);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No fue posible registrar la PQR.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel form-shell" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="panel-title">Solicitante</h3>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={(event) => updateField('nombre', event.target.value)}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>
          <div className="field">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              value={form.apellido}
              onChange={(event) => updateField('apellido', event.target.value)}
            />
            {errors.apellido && (
              <span className="field-error">{errors.apellido}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="identificacion">Identificacion</label>
            <input
              id="identificacion"
              name="identificacion"
              type="text"
              value={form.identificacion}
              onChange={(event) =>
                updateField('identificacion', event.target.value)
              }
            />
            {errors.identificacion && (
              <span className="field-error">{errors.identificacion}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="telefono">Telefono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={(event) => updateField('telefono', event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="panel-title">Solicitud</h3>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              value={form.tipo}
              onChange={(event) => updateField('tipo', event.target.value)}
            >
              <option value="peticion">Peticion</option>
              <option value="queja">Queja</option>
              <option value="reclamo">Reclamo</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="prioridad">Prioridad</label>
            <select
              id="prioridad"
              name="prioridad"
              value={form.prioridad}
              onChange={(event) => updateField('prioridad', event.target.value)}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          {mode === 'internal' && (
            <div className="field">
              <label htmlFor="canal">Canal</label>
              <select
                id="canal"
                name="canal"
                value={form.canal}
                onChange={(event) => updateField('canal', event.target.value)}
              >
                <option value="web">Web</option>
                <option value="presencial">Presencial</option>
                <option value="email">Email</option>
              </select>
            </div>
          )}
          <div className="field">
            <label htmlFor="categoria">Categoria</label>
            <input
              id="categoria"
              name="categoria"
              type="text"
              value={form.categoria}
              onChange={(event) => updateField('categoria', event.target.value)}
            />
            {errors.categoria && (
              <span className="field-error">{errors.categoria}</span>
            )}
          </div>
          <div className="field full">
            <label htmlFor="titulo">Titulo</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={form.titulo}
              onChange={(event) => updateField('titulo', event.target.value)}
            />
            {errors.titulo && <span className="field-error">{errors.titulo}</span>}
          </div>
          <div className="field full">
            <label htmlFor="descripcion">Descripcion</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={(event) => updateField('descripcion', event.target.value)}
            />
            {errors.descripcion && (
              <span className="field-error">{errors.descripcion}</span>
            )}
          </div>
        </div>
      </div>

      {submitError && (
        <div className="state-box error-state" role="alert">
          {submitError}
        </div>
      )}

      {createdPqr && (
        <div className="success-box" role="status">
          <div>
            <p className="success-label">PQR registrada</p>
            <p className="success-value">{createdPqr.radicado}</p>
          </div>
          {mode === 'internal' ? (
            <Link className="secondary-button" to={`/pqr/${createdPqr.id}`}>
              Ver detalle
            </Link>
          ) : (
            <span className="success-note">Conserva este radicado.</span>
          )}
        </div>
      )}

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrar PQR'}
        </button>
        {mode === 'internal' && (
          <Link className="secondary-button" to="/pqr">
            Volver al listado
          </Link>
        )}
      </div>
    </form>
  );
}
