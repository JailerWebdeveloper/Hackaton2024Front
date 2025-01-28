import React from 'react';
import { FaPlus, FaTrash, FaTasks } from 'react-icons/fa';

const Objectives = ({ objectives, onAdd, onRemove, onChange }) => {
  return (
    <div className="card bg-base-100 ">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title flex gap-2">
            <FaTasks />
            Objetivos
          </h2>
          <button
            type="button"
            onClick={onAdd}
            className="btn btn-primary btn-sm"
          >
            <FaPlus className="mr-2" /> Agregar Objetivo
          </button>
        </div>
        <div className="space-y-4">
          {objectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => onChange(index, e.target.value)}
                className="input input-bordered flex-1"
                placeholder="Escriba el objetivo..."
              />
              {objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="btn btn-error btn-square"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Objectives;