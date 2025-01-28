import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useUser } from "../../../../utils/hooks/useAuth";
import { FaEdit } from "react-icons/fa";

const UserProjects = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user?.correo) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `https://hackathon-back-production.up.railway.app/proyectos/search/email`,
          {
            params: {
              email: user.correo
            }
          }
        );
        setProjects(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Error al cargar los proyectos";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user?.correo) {
      fetchUserProjects();
    }
  }, [user]);

  const handleEdit = (projectId) => {
    navigate(`/dashboard/projects/edit/${projectId}`);
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
      className="py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-8 text-gray-800"
        >
          Mis Proyectos
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
                  No tienes proyectos asociados aún.
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
        <span className={`badge ${
          project.estado === 'Activo' ? 'badge-success' :
          project.estado === 'Completado' ? 'badge-info' :
          project.estado === 'Desarrollo' ? 'badge-warning' :
          'badge-neutral'
        }`}>
          {project.estado}
        </span>
      </td>
      <td>{new Date(project.fechaInicio).toLocaleDateString()}</td>
      <td>{new Date(project.fechaFin).toLocaleDateString()}</td>
      <td>{project.programa?.nombre || "No especificado"}</td>
      <td>
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