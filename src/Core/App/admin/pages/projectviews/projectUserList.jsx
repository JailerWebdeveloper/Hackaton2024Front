import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../../../utils/hooks/useAuth";
import { FaEdit, FaEye } from "react-icons/fa";
import { getProjectsbyEmail, GetallProjects } from "../../../../utils/services/get";

const UserProjects = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let response;
        if (user?.rol === "administrador") {
          response = await GetallProjects();
        } else if (user?.correo) {
          response = await getProjectsbyEmail(user.correo);
        }

        if (response) {
          setProjects(response);
        }
      } catch (err) {
        const errorMessage = err.response?.message || "Error al cargar los proyectos";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleEdit = (projectId) => {
    navigate(`/dashboard/projects/edit/${projectId}`);
  };

  const handleView = (projectId) => {
    navigate(`/dashboard/project/${projectId}`);
  };

  if (userLoading || loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-gray-500 mt-4">Cargando proyectos...</p>
      </div>
    );
  }

  if (userError) {
    toast.error("Error al cargar la información del usuario");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12 px-4 sm:px-6 overflow-auto h-screen lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-8 text-gray-800"
        >
          {user?.rol === "administrador" ? "Todos los Proyectos" : "Mis Proyectos"}
        </motion.h1>

        <div className="bg-white rounded-xl w-full h-full overflow-auto p-8 shadow-lg">
          <AnimatePresence mode="wait">
            {projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">
                  {user?.rol === "administrador"
                    ? "No hay proyectos registrados."
                    : "No tienes proyectos asociados aún."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Estado</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Programa</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="font-medium">{project.titulo}</td>
                          <td>
                            <span
                              className={`badge ${
                                project.estado === "Activo"
                                  ? "badge-success"
                                  : project.estado === "Completado"
                                  ? "badge-info"
                                  : project.estado === "Desarrollo"
                                  ? "badge-warning"
                                  : "badge-neutral"
                              }`}
                            >
                              {project.estado}
                            </span>
                          </td>
                          <td>
                            {new Date(project.fechaInicio).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(project.fechaFin).toLocaleDateString()}
                          </td>
                          <td>{project.programa?.nombre || "No especificado"}</td>
                          <td className="flex gap-2">
                            {/* Botón para ir a la vista del proyecto */}
                            <button
                              onClick={() => handleView(project.id)}
                              className="btn btn-ghost btn-sm"
                              title="Ver proyecto"
                            >
                              <FaEye className="text-success" />
                            </button>
                            {/* Botón para editar el proyecto */}
                            <button
                              onClick={() => handleEdit(project.id)}
                              className="btn btn-ghost btn-sm"
                              title="Editar proyecto"
                            >
                              <FaEdit className="text-primary" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProjects;
