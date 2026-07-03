export function CreatePqrPage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Registro</p>
          <h2 className="page-title">Nueva PQR</h2>
          <p className="page-description">
            Estructura inicial del formulario para capturar la solicitud.
          </p>
        </div>
      </div>

      <form className="panel form-shell">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" type="text" />
          </div>
          <div className="field">
            <label htmlFor="identificacion">Identificacion</label>
            <input id="identificacion" name="identificacion" type="text" />
          </div>
          <div className="field">
            <label htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" />
          </div>
          <div className="field">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo">
              <option value="peticion">Peticion</option>
              <option value="queja">Queja</option>
              <option value="reclamo">Reclamo</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="prioridad">Prioridad</label>
            <select id="prioridad" name="prioridad">
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="categoria">Categoria</label>
            <input id="categoria" name="categoria" type="text" />
          </div>
          <div className="field full">
            <label htmlFor="descripcion">Descripcion</label>
            <textarea id="descripcion" name="descripcion" />
          </div>
        </div>
        <button className="primary-button" type="button">
          Registrar PQR
        </button>
      </form>
    </section>
  );
}
