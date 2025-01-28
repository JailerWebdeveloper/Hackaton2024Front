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
  FaComments,
  FaPaperPlane,
} from "react-icons/fa";
import { IoCheckmarkCircle, IoWarning, IoInformation } from "react-icons/io5";
import { toast } from "sonner";
import { getMessagesbyProject, getProjectsByID, getReporteProyectos } from "../../../../utils/services/get";
import { create } from "motion/react-client";
import { createMensaje } from "../../../../utils/services/post";
import { parse } from "postcss";
import { useUser } from "../../../../utils/hooks/useAuth";

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [activeFile, setActiveFile] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const [isTeacher, setIsTeacher] = useState(false); 


  const {user}=useUser();
  const projectStates = [
    "Activo",
    "En revisión",
    "Aceptado",
    "Negado",
    "Inactivo",
  ];

  useEffect(() => {
    if (files.length > 0) {
      setActiveFile(files[0]);
    }
  }, [files]);

  const fetchMessages = async () => {
    try {
      const messagesData = await getMessagesbyProject(id);
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error al cargar los mensajes del proyecto");
    }
  };

  const fetchProjectData = async () => {
    try {
      setLoading(true);

      const projectResponse = await getProjectsByID(id);
      setProject(projectResponse);

      const filesResponse = await axios.get(
        `https://hackathon-back-production.up.railway.app/archivos/todosarchivosporidproyecto/${id}`
      );
      setFiles(filesResponse.data);
      await fetchMessages();

      if (projectResponse?.profesorGuia?.email === user?.email) {
        setIsTeacher(true); 
      }
      toast.success("Datos del proyecto cargados correctamente");
    } catch (error) {
      if (filesResponse?.status !== 200 && filesResponse?.status !== 201) {
        toast("No hay documentos para cargar.");
      }
      setError("Error al cargar el proyecto o los archivos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const data = {
        projectId: parseInt(id),  
        message: newMessage,
        Asunto: 'Nuevo mensaje',
        Remitente: 'Docente',
      }
      
     await createMensaje(data);


      setNewMessage("");
      toast.success("Mensaje enviado correctamente");
      fetchMessages();
    } catch (error) {
      toast.error("Error al enviar el mensaje");
    }
  };

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
      Activo: "badge-primary",
      "En revisión": "badge-warning",
      Aceptado: "badge-success",
      Negado: "badge-error",
      Inactivo: "badge-neutral",
    };
    return statusColors[status] || "badge-ghost";
  };

  const handleGenerateReport = async () => {
    try {
      const response = await getReporteProyectos(id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_proyecto_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Reporte generado y descargado con éxito.");
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      toast.error("Error al generar el reporte.");
    }
  };

  const getMessageIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'success':
        return <IoCheckmarkCircle className="size-6 text-green-500" />;
      case 'warning':
        return <IoWarning className="size-6 text-yellow-500" />;
      default:
        return <IoInformation className="size-6 text-blue-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="container mx-auto p-4 md:p-8 overflow-auto bg-gray-50 h-screen"
    >
      <motion.div {...fadeIn} className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{titulo}</h1>
            <div className="flex gap-2 items-center text-gray-600">
              <FaUniversity className="text-primary" />
              <span>{programa?.facultad?.nombre || "No especificado"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={handleGenerateReport}
              className="btn btn-primary gap-2"
            >
              <FaClipboardList />
              Generar Reporte
            </button>
          </div>
        </div>

        {/* Project Status Stepper */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Estado del Proyecto</h2>
          <div className="flex justify-between items-center">
            {projectStates.map((state, index) => {
              const isActive = projectStates.indexOf(estado) >= index;
              return (
                <div key={state} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-primary text-white' : 'bg-gray-200'
                      }`}>
                      {index + 1}
                    </div>
                    <span className={`mt-2 text-sm ${isActive ? 'text-primary font-medium' : 'text-gray-500'
                      }`}>
                      {state}
                    </span>
                  </div>
                  {index < projectStates.length - 1 && (
                    <div className={`h-1 flex-1 ${isActive ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="tabs tabs-boxed mb-6 bg-white p-2 rounded-lg">
        <a
          className={`tab tab-lg ${activeTab === "info" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Información General
        </a>
        <a
          className={`tab tab-lg ${activeTab === "team" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          Equipo
        </a>
        {files.length > 0 && (
          <a
            className={`tab tab-lg ${activeTab === "docs" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            Documentos
          </a>
        )}
        <a
          className={`tab tab-lg ${activeTab === "messages" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          <div className="flex items-center gap-2">
            <FaComments />
            Mensajes
            {messages.length > 0 && (
              <span className="badge badge-primary badge-sm">{messages.length}</span>
            )}
          </div>
        </a>
      </div>

      <motion.div {...fadeIn} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === "info" && (
          <>
            <div className="lg:col-span-2 card bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body">
                <h2 className="card-title flex gap-2 text-2xl">
                  <FaClipboardList className="text-primary" />
                  Descripción del Proyecto
                </h2>
                <p className="text-gray-600 leading-relaxed">{descripcion}</p>

                <div className="divider"></div>

                <h3 className="font-bold flex gap-2 items-center text-xl">
                  <FaTasks className="text-primary" />
                  Objetivos
                </h3>
                <ul className="list-disc list-inside space-y-3">
                  {objetivos?.map((objective, index) => (
                    <li key={index} className="text-gray-600">
                      {objective.nombre}
                    </li>
                  )) || <p>No hay objetivos definidos.</p>}
                </ul>
              </div>
            </div>

            <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body">
                <h2 className="card-title flex gap-2 text-2xl">
                  <FaRegCalendarAlt className="text-primary" />
                  Cronograma
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Fecha de Inicio</p>
                    <p className="font-semibold text-lg">{fechaInicio}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Fecha de Finalización</p>
                    <p className="font-semibold text-lg">{fechaFin}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "team" && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body">
                <h2 className="card-title flex gap-2">
                  <FaUserTie className="text-primary" />
                  Líder del Proyecto
                </h2>
                <div>
                  <p className="font-semibold">{liderProyecto?.nombre}</p>
                  <p className="text-sm text-gray-500">{liderProyecto?.email}</p>
                </div>
              </div>
            </div>

            <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body">
                <h2 className="card-title flex gap-2">
                  <FaChalkboardTeacher className="text-primary" />
                  Docente Guía
                </h2>
                <div>
                  <p className="font-semibold">{profesorGuia?.nombre}</p>
                  <p className="text-sm text-gray-500">{profesorGuia?.email}</p>
                </div>
              </div>
            </div>

            <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body">
                <h2 className="card-title flex gap-2">
                  <FaUsers className="text-primary" />
                  Colaboradores
                </h2>
                <ul className="space-y-4">
                  {colaboradores?.map((collaborator, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                          {collaborator.nombre[0]}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">{collaborator.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {collaborator.email}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "docs" && (
          <div className="lg:col-span-3">
            <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body">
                <h2 className="card-title">Documentos del Proyecto</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Lista de archivos */}
                  <div className="w-full md:w-1/4">
                    <ul className="menu bg-base-100 p-2 rounded-box border">
                      {files.map((file, index) => (
                        <li key={index}>
                          <button
                            className={`text-left hover:bg-primary hover:text-white transition-all ${activeFile === file ? 'bg-primary text-white' : ''
                              }`}
                            onClick={() => setActiveFile(file)}
                          >
                            {file.nombreArchivo}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visualización del archivo */}
                  <div className="w-full md:w-3/4">
                    {activeFile ? (
                      <iframe
                        src={`https://hackathon-back-production.up.railway.app/archivos/archivo-por-nombre/${activeFile.nombreArchivo}`}
                        className="w-full h-[22rem] border rounded-md"
                        title={`Vista Previa - ${activeFile.nombreArchivo}`}
                      ></iframe>
                    ) : (
                      <p className="text-gray-500">
                        Selecciona un archivo para previsualizarlo.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="lg:col-span-3">
            <div className="card bg-white shadow-sm">
              <div className="card-body">
                <h2 className="card-title flex gap-2 text-2xl mb-6">
                  <FaComments className="text-primary" />
                  Mensajes del Proyecto
                </h2>

                {isTeacher && (
                  <form onSubmit={handleSubmitMessage} className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="input input-bordered flex-1"
                      />
                      <button type="submit" className="btn btn-primary">
                        <FaPaperPlane />
                        Enviar
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <FaComments className="mx-auto text-4xl mb-2 opacity-50" />
                      <p>No hay mensajes en este proyecto</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* <div className="flex-shrink-0">
                          {getMessageIcon(message.tipo)}
                        </div> */}
                        <div className="flex-grow">
                          <p className="text-gray-800">
                            {message.message}
                          </p>
                          {/* {message.fecha && (
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDate(message.fecha)}
                            </p>
                          )} */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProjectView;