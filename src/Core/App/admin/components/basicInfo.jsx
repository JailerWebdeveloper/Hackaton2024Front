import React from 'react';
import { FaClipboardList } from 'react-icons/fa';

const BasicInfo = ({ formData, onChange }) => {
  return (
    <div className="card bg-base-100 ">
      <div className="card-body">
        <h2 className="card-title flex gap-2">
          <FaClipboardList />
          Información Básica
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Título */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Título del Proyecto</span>
            </label>
            <input
              type="text"
              name="titulo" // Alineado con `formData`
              value={formData.titulo}
              onChange={onChange}
              className="input input-bordered"
              required
            />
          </div>

          {/* Campo Descripción */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text">Descripción</span>
            </label>
            <textarea
              name="descripcion" // Alineado con `formData`
              value={formData.descripcion}
              onChange={onChange}
              className="textarea textarea-bordered h-24"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
