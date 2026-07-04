import { ClipboardList, LogIn, SearchCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PqrRequestForm } from '../components/PqrRequestForm';

export function PublicPqrPage() {
  return (
    <main className="public-page">
      <header className="public-topbar">
        <Link className="public-brand" to="/">
          <span className="brand-mark">PQ</span>
          <span>PRUEBA_EVALUACION_PQR</span>
        </Link>
        <Link className="secondary-button" to="/login">
          <LogIn size={16} aria-hidden="true" />
          Login
        </Link>
      </header>

      <section className="public-layout">
        <aside className="public-intro">
          <p className="eyebrow">Atencion al ciudadano</p>
          <h1>Radica tu PQR en linea</h1>
          <p>
            Registra una peticion, queja o reclamo y conserva el radicado para
            consultar el seguimiento de tu solicitud.
          </p>

          <div className="public-steps">
            <div>
              <ClipboardList size={20} aria-hidden="true" />
              <span>Completa los datos del solicitante.</span>
            </div>
            <div>
              <SearchCheck size={20} aria-hidden="true" />
              <span>Describe la solicitud y recibe un radicado.</span>
            </div>
          </div>
        </aside>

        <section className="public-form-area" aria-label="Formulario PQR">
          <div className="page-header">
            <div>
              <p className="eyebrow">Registro</p>
              <h2 className="page-title">Nueva PQR</h2>
              <p className="page-description">
                La informacion registrada sera recibida por el equipo encargado
                para su gestion.
              </p>
            </div>
          </div>

          <PqrRequestForm mode="public" />
        </section>
      </section>
    </main>
  );
}
