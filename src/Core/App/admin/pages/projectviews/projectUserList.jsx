import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../../../utils/hooks/useAuth";
import { FaEdit, FaEye, FaSync } from "react-icons/fa";
import { getProjectsbyEmail, GetallProjects, getallReporteProyectos, getReporteProyectosexcel } from "../../../../utils/services/get";

const UserProjects = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estado para los filtros
  const [filters, setFilters] = useState({
    titulo: "",
    estado: "",
    estudiante: "",
    director: "",
    fechaInicio: ""
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let response;
        if (user?.rol === "admin") {
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

  const handleDownloadProjectReport = async () => {
    try {
      const response = await getallReporteProyectos();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_proyectos.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Reporte de proyectos descargado con éxito");
    } catch (error) {
      toast.error("Error al descargar el reporte de proyectos");
    }
  };

  const handleDownloadProjectReportexcel = async () => {
    try {
      const response = await getReporteProyectosexcel();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_proyectos.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Reporte de proyectos descargado con éxito");
    } catch (error) {
      toast.error("Error al descargar el reporte de proyectos");
    }
  };

  const resetFilters = () => {
    setFilters({
      titulo: "",
      estado: "",
      estudiante: "",
      director: "",
      fechaInicio: ""
    });
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

  // Filtrado de proyectos según los filtros aplicados
  const filteredProjects = projects.filter((project) => {
    // Filtro por título
    if (filters.titulo && !project.titulo.toLowerCase().includes(filters.titulo.toLowerCase())) {
      return false;
    }
    // Filtro por estado
    if (filters.estado && project.estado !== filters.estado) {
      return false;
    }
    // Filtro por nombre del estudiante
    if (filters.estudiante) {
      const estudianteFilter = filters.estudiante.toLowerCase();
      let estudianteEncontrado = false;
      // Verifica si el líder del proyecto tiene rol "estudiante"
      if (
        project.liderProyecto &&
        project.liderProyecto.rol.toLowerCase().includes("estudiante") &&
        project.liderProyecto.nombre.toLowerCase().includes(estudianteFilter)
      ) {
        estudianteEncontrado = true;
      }
      // O si alguno de los colaboradores tiene rol "estudiante"
      if (!estudianteEncontrado && project.colaboradores && Array.isArray(project.colaboradores)) {
        estudianteEncontrado = project.colaboradores.some(
          (colaborador) =>
            colaborador.rol.toLowerCase().includes("estudiante") &&
            colaborador.nombre.toLowerCase().includes(estudianteFilter)
        );
      }
      if (!estudianteEncontrado) {
        return false;
      }
    }
    // Filtro por nombre del director o evaluador (se asume que está en profesorGuia)
    if (filters.director) {
      if (!project.profesorGuia || !project.profesorGuia.nombre.toLowerCase().includes(filters.director.toLowerCase())) {
        return false;
      }
    }
    // Filtro por fecha de inicio
    if (filters.fechaInicio) {
      const filterDate = new Date(filters.fechaInicio).toLocaleDateString();
      const projectDate = new Date(project.fechaInicio).toLocaleDateString();
      if (filterDate !== projectDate) {
        return false;
      }
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-8 text-gray-800 text-center"
        >
          {user?.rol === "admin" ? "Todos los Proyectos" : "Mis Proyectos"}
        </motion.h1>

        {/* Botones para descargar reportes y reiniciar filtros */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          <div className="flex gap-2">
            <button onClick={handleDownloadProjectReport} className="btn btn-primary">
              Descargar Reporte PDF
            </button>
            <button onClick={handleDownloadProjectReportexcel} className="btn btn-success">
              Descargar Reporte Excel
            </button>
          </div>
          <button onClick={resetFilters} className="btn btn-outline flex items-center gap-2">
            <FaSync />
            Reiniciar Filtros
          </button>
        </div>

        {/* Sección de Filtros */}
        <div className="card bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtrar Proyectos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del proyecto
              </label>
              <input
                type="text"
                placeholder="Ingrese el título"
                value={filters.titulo}
                onChange={(e) => setFilters({ ...filters, titulo: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                className="select select-bordered w-full"
              >
                <option value="">Todos los estados</option>
                <option value="En proceso">En proceso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del estudiante
              </label>
              <input
                type="text"
                placeholder="Ingrese el nombre"
                value={filters.estudiante}
                onChange={(e) => setFilters({ ...filters, estudiante: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del director o evaluador
              </label>
              <input
                type="text"
                placeholder="Ingrese el nombre"
                value={filters.director}
                onChange={(e) => setFilters({ ...filters, director: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio
              </label>
              <input
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>

        {/* Tabla de Proyectos */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto p-6">
          <AnimatePresence>
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <p className="text-gray-500 text-lg">
                  {projects.length === 0
                    ? "No hay proyectos registrados."
                    : "No se encontraron proyectos con los filtros aplicados."}
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Estado</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Programa</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-100 transition-colors">
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
                        <td>{new Date(project.fechaInicio).toLocaleDateString()}</td>
                        <td>{new Date(project.fechaFin).toLocaleDateString()}</td>
                        <td>{project.programa?.nombre || project.programa || "No especificado"}</td>
                        <td className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(project.id)}
                            className="btn btn-ghost btn-sm"
                            title="Ver proyecto"
                          >
                            <FaEye className="text-success" />
                          </button>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProjects;
