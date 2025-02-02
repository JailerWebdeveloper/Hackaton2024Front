import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "../../../../utils/hooks/useAuth";
import {
  Trash2,
  Plus,
  Calendar,
  Users,
  BookOpen,
  FileText,
  User,
  Target,
  Info,
  AlertTriangle
} from "lucide-react";
import { GetProjectbyID } from "../../../../utils/services/get";
import { updateProyecto } from "../../../../utils/services/put";

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: userLoading, error: userError } = useUser();
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    linea_Investigacion: "",
    fechaInicio: "",
    fechaFin: "",
    fecha_entrega: "",
    programa: "",
    estado: "Activo",
    liderProyecto: {
      nombre: "",
      email: "",
      rol: "Investigador Principal"
    },
    objetivos: [{ nombre: "" }],
    profesorGuia: {
      nombre: "",
      email: "",
      rol: "Profesor Titular"
    },
    colaboradores: [
      {
        nombre: "",
        email: "",
        rol: ""
      }
    ],
    vistaPreviaDocumento: []
  });

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await GetProjectbyID(id);
      const projectData = {
        ...data,
        vistaPreviaDocumento: data.vistaPreviaDocumento || []
      };
      setFormData(projectData);

      if (user) {
        const isAdmin = user.rol === 'admin';
        const isProjectLeader = projectData.liderProyecto.email === user.correo;
        setCanEdit(isAdmin || isProjectLeader);
      }
    } catch (error) {
      toast.error("Error al cargar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && !userLoading) fetchProject();
  }, [id, user, userLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      toast.error("No tienes permisos para editar este proyecto");
      return;
    }

    try {
      setLoading(true);
      const { id: projectId, ...projectData } = {
        ...formData,
        programa: user.programa || formData.programa
      };

      const projectResponse = await updateProyecto(projectId, projectData);
      if (!projectResponse.status === 200) {
        throw new Error('Error al actualizar el proyecto');
      }

      if (documents.length > 0) {
        for (const doc of documents) {
          const formData = new FormData();
          formData.append('file', doc);
          formData.append('categoria', 'Documento Proyecto');
          formData.append('proyectoId', projectId);

          const fileResponse = await fetch(
            'https://hackathon-back-production.up.railway.app/archivos',
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!fileResponse.ok) {
            throw new Error('Error al cargar el archivo');
          }
        }
        toast.success('Documentos actualizados exitosamente');
      }

      toast.success("Proyecto actualizado correctamente");
      fetchProject();
      navigate(`/dashboard/project/${projectId}`);
    } catch (error) {
      toast.error(error.message || "Error al actualizar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value, index = null, subfield = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (index !== null && subfield) {
        newData[field][index][subfield] = value;
      } else if (subfield) {
        newData[field][subfield] = value;
      } else {
        newData[field] = value;
      }
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(prev => [...prev, ...files]);
    toast.success(`${files.length} documento(s) seleccionado(s)`);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const addColaborador = () => {
    setFormData(prev => ({
      ...prev,
      colaboradores: [...prev.colaboradores, { nombre: "", email: "", rol: "" }]
    }));
  };

  const removeColaborador = (index) => {
    if (formData.colaboradores.length > 1) {
      setFormData(prev => ({
        ...prev,
        colaboradores: prev.colaboradores.filter((_, i) => i !== index)
      }));
    }
  };

  const addObjetivo = () => {
    setFormData(prev => ({
      ...prev,
      objetivos: [...prev.objetivos, { nombre: "" }]
    }));
  };

  const removeObjetivo = (index) => {
    if (formData.objetivos.length > 1) {
      setFormData(prev => ({
        ...prev,
        objetivos: prev.objetivos.filter((_, i) => i !== index)
      }));
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (userError || !canEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-red-500 mx-auto mb-4 flex justify-center">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">
            {userError ? "Error al cargar la información del usuario." : "No tienes permisos para editar este proyecto."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container h-screen overflow-auto mx-auto p-4 md:p-8"
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Editar Proyecto</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen className="w-5 h-5" />
          <span>{formData.programa ? formData.programa.nombre : "No especificado"}</span>
          <span className={`badge ${formData.estado === 'Activo' ? 'badge-primary' :
            formData.estado === 'En revisión' ? 'badge-warning' :
              formData.estado === 'Aceptado' ? 'badge-success' :
                formData.estado === 'Negado' ? 'badge-error' :
                  'badge-ghost'
            }`}>
            {formData.estado}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs tabs-boxed bg-white p-2 rounded-lg mb-6">
        <button
          className={`tab tab-lg gap-2 ${activeTab === "general" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <Info className="w-5 h-5" />
          Información General
        </button>
        <button
          className={`tab tab-lg gap-2 ${activeTab === "team" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          <Users className="w-5 h-5" />
          Equipo
        </button>
        <button
          className={`tab tab-lg gap-2 ${activeTab === "objectives" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("objectives")}
        >
          <Target className="w-5 h-5" />
          Objetivos
        </button>
        <button
          className={`tab tab-lg gap-2 ${activeTab === "documents" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          <FileText className="w-5 h-5" />
          Documentos
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "general" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary" />
                  Información General
                </h2>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Título</span>
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => handleChange('titulo', e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Descripción</span>
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => handleChange('descripcion', e.target.value)}
                      className="textarea textarea-bordered h-24"
                      required
                    ></textarea>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Línea de Investigación</span>
                    </label>
                    <textarea
                      value={formData.linea_Investigacion}
                      onChange={(e) => handleChange('linea_Investigacion', e.target.value)}
                      className="textarea textarea-bordered h-24"
                      required
                    ></textarea>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Estado</span>
                    </label>
                    <select
                      value={formData.estado}
                      onChange={(e) => handleChange('estado', e.target.value)}
                      className="select select-bordered"
                      required
                    >
                      <option value="Activo">Activo</option>
                      <option value="En revisión">En revisión</option>
                      <option value="Aceptado">Aceptado</option>
                      <option value="Evaluación">Evaluación</option>
                      <option value="Negado">Negado</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  Fechas
                </h2>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Fecha de Inicio</span>
                    </label>
                    <input
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => handleChange('fechaInicio', e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Fecha de Fin</span>
                    </label>
                    <input
                      type="date"
                      value={formData.fechaFin}
                      onChange={(e) => handleChange('fechaFin', e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Fecha de Entrega</span>
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_entrega}
                      onChange={(e) => handleChange('fecha_entrega', e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "objectives" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Objetivos
              </h2>
              <button
                type="button"
                onClick={addObjetivo}
                className="btn btn-primary btn-sm gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Objetivo
              </button>
            </div>

            <div className="space-y-4">
              {formData.objetivos.map((objetivo, index) => (
                <div key={index} className="flex gap-4">
                  <div className="form-control flex-1">
                    <label className="label">
                      <span className="label-text">Objetivo {index + 1}</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={objetivo.nombre}
                        onChange={(e) => handleChange('objetivos', e.target.value, index, 'nombre')}
                        className="input input-bordered flex-1"
                        required
                      />
                      {formData.objetivos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeObjetivo(index)}
                          className="btn btn-error btn-square"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Líder del Proyecto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre</span>
                  </label>
                  <input
                    type="text"
                    value={formData.liderProyecto.nombre}
                    onChange={(e) => handleChange('liderProyecto', e.target.value, null, 'nombre')}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    value={formData.liderProyecto.email}
                    onChange={(e) => handleChange('liderProyecto', e.target.value, null, 'email')}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rol</span>
                  </label>
                  <input
                    type="text"
                    value={formData.liderProyecto.rol}
                    className="input input-bordered"
                    required
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profesor Guía
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre</span>
                  </label>
                  <input
                    type="text"
                    value={formData.profesorGuia.nombre}
                    onChange={(e) => handleChange('profesorGuia', e.target.value, null, 'nombre')}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    value={formData.profesorGuia.email}
                    onChange={(e) => handleChange('profesorGuia', e.target.value, null, 'email')}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rol</span>
                  </label>
                  <input
                    type="text"
                    value={formData.profesorGuia.rol}
                    className="input input-bordered"
                    required
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Colaboradores
                </h2>
                <button
                  type="button"
                  onClick={addColaborador}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Colaborador
                </button>
              </div>

              {formData.colaboradores.map((colaborador, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nombre</span>
                    </label>
                    <input
                      type="text"
                      value={colaborador.nombre}
                      onChange={(e) => handleChange('colaboradores', e.target.value, index, 'nombre')}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      value={colaborador.email}
                      onChange={(e) => handleChange('colaboradores', e.target.value, index, 'email')}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Rol</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={colaborador.rol}
                        onChange={(e) => handleChange('colaboradores', e.target.value, index, 'rol')}
                        className="input input-bordered flex-1"
                        required
                      />
                      {formData.colaboradores.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeColaborador(index)}
                          className="btn btn-error btn-square"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Documentos del Proyecto
            </h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Agregar Documentos</span>
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
                accept=".pdf,.doc,.docx"
                multiple
              />
            </div>

            {documents.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Documentos Seleccionados:</h3>
                <ul className="space-y-2">
                  {documents.map((doc, index) => (
                    <li key={index} className="flex items-center justify-between bg-base-200 p-2 rounded">
                      <span>{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="btn btn-error btn-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {formData.vistaPreviaDocumento.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Documentos Actuales:</h3>
                <ul className="space-y-2">
                  {formData.vistaPreviaDocumento.map((doc, index) => (
                    <li key={index} className="flex items-center justify-between bg-base-200 p-2 rounded">
                      <a
                        href={doc.ruta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary"
                      >
                        Documento {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-end mt-6">
          <button
            type="button"
            onClick={() => navigate(`/projects/${id}`)}
            className="btn btn-ghost"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProjectEdit;