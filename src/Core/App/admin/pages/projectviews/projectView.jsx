import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  BookOpen,
  Upload,
  MessageSquare,
  FileText,
  User,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Send,
  Download,
  ExternalLink,
  Edit
} from "lucide-react";
import { toast } from "sonner";
import {
  getFilesbyProject,
  getMessagesbyProject,
  getProjectsByID,
  getReporteProyectos
} from "../../../../utils/services/get";
import { createMensaje } from "../../../../utils/services/post";
import { updateProyecto } from "../../../../utils/services/put"; 
import { useUser } from "../../../../utils/hooks/useAuth";

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [activeDocumentUrl, setActiveDocumentUrl] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [updateReason, setUpdateReason] = useState("");

  const projectStates = [
    "Activo",
    "En revisión",
    "Aceptado",
    "Negado",
    "Inactivo",
  ];

  const { user } = useUser();

  useEffect(() => {
    if (project?.vistaPreviaDocumento?.length > 0) {
      setActiveDocumentUrl(project.vistaPreviaDocumento[0]);
    }
  }, [project?.vistaPreviaDocumento]);

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
      await fetchMessages();

      if (projectResponse?.profesorGuia?.email === user?.email) {
        setIsTeacher(true);
      }
      toast.success("Datos del proyecto cargados correctamente");
    } catch (error) {
      setError("Error al cargar el proyecto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id, user?.email]);

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const data = {
        projectId: parseInt(id),
        message: newMessage,
        Asunto: 'Nuevo mensaje',
        Remitente: 'Docente',
      };

      await createMensaje(data);
      setNewMessage("");
      toast.success("Mensaje enviado correctamente");
      fetchMessages();
    } catch (error) {
      toast.error("Error al enviar el mensaje");
    }
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
      toast.success("Reporte generado y descargado con éxito");
    } catch (error) {
      toast.error("Error al generar el reporte");
    }
  };

  // Abre el modal y asigna el estado actual del proyecto al stepper
  const handleOpenUpdateModal = () => {
    setSelectedState(project.estado);
    setUpdateReason("");
    setIsUpdateModalOpen(true);
  };

  // Función para actualizar el estado
  const handleUpdateStatus = async () => {
    if (!selectedState || !updateReason.trim()) {
      toast.error("Por favor, selecciona un estado y proporciona una razón.");
      return;
    }

    try {
      // Crea el objeto actualizado
      const updatedProjectData = { ...project, estado: selectedState };

      // Envía la actualización vía PUT
      await updateProyecto(project.id, updatedProjectData);

      // Envía un mensaje con la razón y el nuevo estado
      const messageData = {
        projectId: parseInt(id),
        message: `El estado del proyecto ha sido actualizado a "${selectedState}". Razón: ${updateReason}`,
        Asunto: 'Actualización de Estado del Proyecto',
        Remitente: user?.nombre || "Sistema",
      };
      await createMensaje(messageData);

      toast.success("Estado actualizado correctamente.");
      setProject(updatedProjectData);
      fetchMessages();
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Error al actualizar el estado del proyecto.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">
            {error || "No se encontró el proyecto solicitado."}
          </p>
        </div>
      </div>
    );
  }

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
    vistaPreviaDocumento
  } = project;

  const hasDocuments = vistaPreviaDocumento?.length > 0;

  return (
    <div className="h-screen overflow-auto bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{titulo}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="w-5 h-5" />
              <span>{programa?.nombre || "No especificado"}</span>
              <span className={`badge ${estado === 'Activo' ? 'badge-primary' : 
                                     estado === 'En revisión' ? 'badge-warning' : 
                                     estado === 'Aceptado' ? 'badge-success' : 
                                     estado === 'Negado' ? 'badge-error' : 
                                     'badge-ghost'}`}>
                {estado}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateReport}
              className="btn btn-primary gap-2"
            >
              <Download className="w-5 h-5" />
              Generar Reporte
            </button>
            <button
              onClick={handleOpenUpdateModal}
              className="btn btn-secondary gap-2"
            >
              <Edit className="w-5 h-5" />
              Actualizar Estado
            </button>
          </div>
        </div>

        {/* Modal para actualizar estado */}
        {isUpdateModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box relative">
              <button 
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                ✕
              </button>
              <h3 className="text-lg font-bold mb-4">
                Actualizar Estado del Proyecto
              </h3>
              
              {/* Stepper para mostrar la secuencia de estados */}
              <div className="steps mb-4">
                {projectStates.map((stateOption, index) => (
                  <div
                    key={index}
                    className={`step cursor-pointer ${selectedState === stateOption ? "step-primary" : ""}`}
                    onClick={() => setSelectedState(stateOption)}
                  >
                    {stateOption}
                  </div>
                ))}
              </div>

              {/* Campo para ingresar la razón */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Razón de la actualización</span>
                </label>
                <textarea
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  className="textarea textarea-bordered"
                  placeholder="Ingresa la razón de la actualización..."
                ></textarea>
              </div>

              <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => setIsUpdateModalOpen(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleUpdateStatus}>Actualizar Estado</button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="tabs tabs-boxed bg-white p-2 rounded-lg mb-6">
          <button
            className={`tab tab-lg gap-2 ${activeTab === "info" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <Info className="w-5 h-5" />
            Información
          </button>
          <button
            className={`tab tab-lg gap-2 ${activeTab === "team" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            <Users className="w-5 h-5" />
            Equipo
          </button>
          {hasDocuments && (
            <button
              className={`tab tab-lg gap-2 ${activeTab === "docs" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("docs")}
            >
              <FileText className="w-5 h-5" />
              Documentos
            </button>
          )}
          <button
            className={`tab tab-lg gap-2 ${activeTab === "messages" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="w-5 h-5" />
            Mensajes
            {messages.length > 0 && (
              <span className="badge badge-primary badge-sm">{messages.length}</span>
            )}
          </button>
        </div>

        {/* Secciones de contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeTab === "info" && (
            <>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Descripción y Objetivos
                  </h2>
                  <p className="text-gray-600 mb-6">{descripcion}</p>
                  
                  <h3 className="text-xl font-semibold mb-4">Objetivos del Proyecto</h3>
                  <ul className="space-y-3">
                    {objetivos?.map((objetivo, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-1" />
                        <span className="text-gray-600">{objetivo.nombre}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    Fechas
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-medium">Inicio</span>
                      </div>
                      <p className="text-gray-600">{fechaInicio}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-medium">Finalización</span>
                      </div>
                      <p className="text-gray-600">{fechaFin}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "team" && (
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Líder del Proyecto
                </h2>
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-white rounded-full w-12 h-12">
                      <span className="text-xl">{liderProyecto?.nombre?.[0]}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{liderProyecto?.nombre}</p>
                    <p className="text-sm text-gray-500">{liderProyecto?.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profesor Guía
                </h2>
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-white rounded-full w-12 h-12">
                      <span className="text-xl">{profesorGuia?.nombre?.[0]}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{profesorGuia?.nombre}</p>
                    <p className="text-sm text-gray-500">{profesorGuia?.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Colaboradores
                </h2>
                <div className="space-y-4">
                  {colaboradores?.map((colaborador, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-white rounded-full w-10 h-10">
                          <span>{colaborador.nombre[0]}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{colaborador.nombre}</p>
                        <p className="text-sm text-gray-500">{colaborador.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "docs" && hasDocuments && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-primary" />
                  Documentos del Proyecto
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {vistaPreviaDocumento.map((docUrl, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Documento {index + 1}</h3>
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Abrir en nueva pestaña
                        </a>
                      </div>
                      <iframe
                        src={docUrl}
                        className="w-full h-[600px] rounded-lg border border-gray-200"
                        title={`Documento ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Mensajes
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
                      <button type="submit" className="btn btn-primary gap-2">
                        <Send className="w-4 h-4" />
                        Enviar
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No hay mensajes en este proyecto</p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-grow">
                          <p className="text-gray-800">{message.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
