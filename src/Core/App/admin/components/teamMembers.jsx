import React from 'react';
import { FaPlus, FaTrash, FaUsers } from 'react-icons/fa';

const TeamMembers = ({ collaborators, onAdd, onRemove, onChange }) => {
  return (
    <div className="card bg-base-100 ">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-lg md:text-xl flex gap-2">
            <FaUsers />
            Colaboradores
          </h2>
          <button
            type="button"
            onClick={onAdd}
            className="btn btn-primary btn-sm"
          >
            <FaPlus className="mr-2" /> Agregar
          </button>
        </div>
        <div className="space-y-6">
          {collaborators.map((collaborator, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
              {/* Campo Nombre */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre</span>
                </label>
                <input
                  type="text"
                  value={collaborator.nombre}
                  onChange={(e) => onChange(index, 'nombre', e.target.value)}
                  className="input input-bordered"
                  placeholder="Nombre del colaborador"
                  required
                />
              </div>

              {/* Campo Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={collaborator.email}
                  onChange={(e) => onChange(index, 'email', e.target.value)}
                  className="input input-bordered"
                  placeholder="Email del colaborador"
                  required
                />
              </div>

              {/* Campo Rol */}
              <div className="flex gap-2">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Rol</span>
                  </label>
                  <input
                    type="text"
                    value={collaborator.rol}
                    onChange={(e) => onChange(index, 'rol', e.target.value)}
                    className="input input-bordered"
                    placeholder="Rol del colaborador"
                    required
                  />
                </div>

                {/* Botón Eliminar */}
                {collaborators.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="btn btn-error btn-square self-end"
                    aria-label="Eliminar colaborador"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
