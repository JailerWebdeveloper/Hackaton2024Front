import React from "react";
import { FaUniversity, FaBookReader } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const {
    id,
    titulo,
    descripcion,
    estado,
    fechaInicio,
    programa,
    liderProyecto,
  } = project;

  const getStatusColor = (status) => {
    const statusColors = {
      'Planificación': 'badge-primary',
      'Desarrollo': 'badge-warning',
      'Evaluación': 'badge-success',
      'Completado': 'badge-secondary',
      'Activo': 'badge-info',
    };
    return statusColors[status] || 'badge-ghost';
  };

  return (
    <Link to={`/dashboard/project/${id}`} className="block">
      <div className="card w-full bg-base-100 shadow-md hover:shadow-lg h-full  transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        <div className="card-body">
          {/* Header with Status */}
          <div className="flex justify-between items-start mb-3">
            <h2 className="card-title text-lg font-bold line-clamp-1">{titulo}</h2>
            <div className="flex flex-col gap-2 items-end">
              <span className={`badge ${getStatusColor(estado)} badge-sm`}>
                {estado}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-[42px] overflow-auto">{descripcion}</p>

          {/* Faculty & Program */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <FaUniversity className="text-primary" />
              <span className="line-clamp-1">
                {programa?.facultad?.nombre || "No especificado"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaBookReader className="text-primary" />
              <span className="line-clamp-1">{programa?.nombre || "No especificado"}</span>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
            <div>
              <span className="font-semibold">Líder:</span>{" "}
              {liderProyecto?.nombre || "No especificado"}
            </div>
            <div>
              <span className="font-semibold">Inicio:</span>{" "}
              {fechaInicio ? new Date(fechaInicio).toLocaleDateString() : "No especificado"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
