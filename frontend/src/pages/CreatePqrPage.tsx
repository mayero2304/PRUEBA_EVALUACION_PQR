import { PqrRequestForm } from '../components/PqrRequestForm';

export function CreatePqrPage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Registro</p>
          <h2 className="page-title">Nueva PQR</h2>
          <p className="page-description">
            Captura de datos del solicitante y detalle de la solicitud para
            generar un radicado.
          </p>
        </div>
      </div>

      <PqrRequestForm />
    </section>
  );
}
