import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaUserTie,
  FaUsers,
  FaChalkboardTeacher,
  FaBookReader,
  FaUniversity,
  FaClipboardList,
  FaRegCalendarAlt,
  FaTasks,
} from "react-icons/fa";
import { toast } from "sonner";

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]); // Archivos del proyecto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        // Obtener datos del proyecto
        const projectResponse = await axios.get(
          `https://hackathon-back-production.up.railway.app/proyectos/${id}`
        );
        setProject(projectResponse.data);

        // Obtener archivos relacionados
        const filesResponse = await axios.get(
          `https://hackathon-back-production.up.railway.app/archivos/todosarchivosporidproyecto/${id}`
        );
        setFiles(filesResponse.data);
          console.log(files)
        toast.success("Datos del proyecto cargados correctamente");
      } catch (error) {
        if(filesResponse.status != 200 || filesResponse.status != 201){
        toast("No hay documentos para cargar.");
        }
        setError("Error al cargar el proyecto o los archivos.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  if (loading)
    return (
      <div className="container mx-auto p-8">
        <div className="flex flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );

  if (!project)
    return (
      <div className="alert alert-info shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>No se encontró el proyecto.</span>
        </div>
      </div>
    );

  const {
    titulo,
    descripcion,
    objetivos,
    fechaInicio,
    fechaFin,
    estado,
    programa,
    liderProyecto,
    colaboradores,
    profesorGuia,
  } = project;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Planificación: "badge-primary",
      Desarrollo: "badge-warning",
      Evaluación: "badge-success",
      Completado: "badge-secondary",
      Activo: "badge-info",
    };
    return statusColors[status] || "badge-ghost";
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="container mx-auto p-4 md:p-8"
    >
      <motion.div {...fadeIn} className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{titulo}</h1>
            <div className="flex gap-2 items-center text-gray-600">
              <FaUniversity className="text-primary" />
              <span>{programa?.facultad?.nombre || "No especificado"}</span>
              <span className="text-gray-400">|</span>
              <FaBookReader className="text-primary" />
              <span>{programa?.nombre || "No especificado"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className={`badge ${getStatusColor(estado)} badge-lg`}>
              {estado}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Información General
        </a>
        <a
          className={`tab ${activeTab === "team" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          Equipo
        </a>
        {files.length > 0 && (
          <a
            className={`tab ${activeTab === "docs" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            Documentos
          </a>
        )}
      </div>

      <motion.div {...fadeIn} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === "info" && (
          <>
            <div className="lg:col-span-2 card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex gap-2">
                  <FaClipboardList />
                  Descripción del Proyecto
                </h2>
                <p className="text-gray-600">{descripcion}</p>

                <div className="divider"></div>

                <h3 className="font-bold flex gap-2 items-center">
                  <FaTasks />
                  Objetivos
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {objetivos?.map((objective, index) => (
                    <li key={index} className="text-gray-600">
                      {objective.nombre}
                    </li>
                  )) || <p>No hay objetivos definidos.</p>}
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex gap-2">
                  <FaRegCalendarAlt />
                  Cronograma
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Inicio</p>
                    <p className="font-semibold">{fechaInicio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Finalización</p>
                    <p className="font-semibold">{fechaFin}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "team" && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex gap-2">
                  <FaUserTie />
                  Líder del Proyecto
                </h2>
                <div>
                  <p className="font-semibold">{liderProyecto?.nombre}</p>
                  <p className="text-sm text-gray-500">{liderProyecto?.email}</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex gap-2">
                  <FaChalkboardTeacher />
                  Docente Guía
                </h2>
                <div>
                  <p className="font-semibold">{profesorGuia?.nombre}</p>
                  <p className="text-sm text-gray-500">{profesorGuia?.email}</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex gap-2">
                  <FaUsers />
                  Colaboradores
                </h2>
                <ul>
                  {colaboradores?.map((collaborator, index) => (
                    <li key={index}>
                      <p className="font-semibold">{collaborator.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {collaborator.email}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "docs" && files.length > 0 && (
          <div className="lg:col-span-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Documentos del Proyecto</h2>
                {files[0]?.archivo ? (
                  <iframe
                    src={`https://hackathon-back-production.up.railway.app/archivos/archivo-por-nombre/${files[0].nombreArchivo}`}
                    className="w-full h-[22rem]"
                    title="Vista Previa del Documento"
                  ></iframe>
                ) : (
                  <p>No hay documentos disponibles.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProjectView;
