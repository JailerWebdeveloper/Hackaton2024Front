import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProjectsbyEmail } from "../../../../utils/services/get";
import { useUser } from "../../../../utils/hooks/useAuth";

const Profile = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user?.correo) {
        setLoadingProjects(true);
        try {
          const data = await getProjectsbyEmail(user.correo);
          setProjects(data);
        } catch (error) {
          console.error("Error al cargar los proyectos:", error);
          setProjectsError("Error al cargar los proyectos");
        } finally {
          setLoadingProjects(false);
        }
      }
    };
    fetchProjects();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      {/* Información del Usuario */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Información Personal</h2>
        <p>
          <strong>Nombre:</strong> {user?.nombre} {user?.apellido}
        </p>
        <p>
          <strong>Correo:</strong> {user?.correo}
        </p>
        <p>
          <strong>Usuario:</strong> {user?.usuario}
        </p>
        <p>
          <strong>Rol:</strong> {user?.rol}
        </p>
        <p>
          <strong>Cédula:</strong> {user?.cedula}
        </p>
      </div>

      {/* Proyectos Asociados */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Mis Proyectos</h2>
        {loadingProjects ? (
          <p>Cargando proyectos...</p>
        ) : projectsError ? (
          <p className="text-red-500">{projectsError}</p>
        ) : projects && projects.length > 0 ? (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.id || project._id} className="border p-4 rounded-lg">
                <h3 className="text-xl font-bold">{project.titulo}</h3>
                <p>{project.descripcion}</p>
                <Link
                  to={`/dashboard/project/${project.id || project._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Ver Detalles
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron proyectos asociados.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
