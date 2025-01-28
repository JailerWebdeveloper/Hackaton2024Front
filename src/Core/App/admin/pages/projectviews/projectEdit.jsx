import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "../../../../utils/hooks/useAuth";
import { FaTrash, FaPlus } from "react-icons/fa";
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
    fechaInicio: "",
    fechaFin: "",
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

    fetchProject();

    if (id && !userLoading) fetchProject();
  }, [id, user, userLoading,]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      toast.error("No tienes permisos para editar este proyecto");
      return;
    }

    try {
      setLoading(true);

      const { id, ...projectData } = {
        ...formData,
        programa: user.programa || formData.programa
      };
      console.log(projectData)
      const projectResponse = updateProyecto(id, projectData);

      if (!projectResponse.status === 200) {
        throw new Error('Error al actualizar el proyecto');
      }

      if (documents.length > 0) {
        for (const doc of documents) {
          const formData = new FormData();
          formData.append('file', doc);
          formData.append('categoria', 'Documento Proyecto');
          formData.append('proyectoId', id);

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
      navigate(`/dashboard/project/${id}`);
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
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (userError || !canEdit) {
    return (
      <div className="alert alert-error">
        <div>
          <span>{userError ? "Error al cargar la información del usuario." : "No tienes permisos para editar este proyecto."}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 md:p-8"
    >
      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${activeTab === "general" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          Información General
        </button>
        <button
          className={`tab ${activeTab === "team" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          Equipo
        </button>
        <button
          className={`tab ${activeTab === "objectives" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("objectives")}
        >
          Objetivos
        </button>
        <button
          className={`tab ${activeTab === "documents" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          Documentos
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "general" && (
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title">Información General</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <span className="label-text">Estado</span>
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => handleChange('estado', e.target.value)}
                    className="select select-bordered"
                    required
                  >
                    <option value="Planificación">Planificación</option>
                    <option value="Desarrollo">Desarrollo</option>
                    <option value="Evaluación">Evaluación</option>
                    <option value="Completado">Completado</option>
                    <option value="Activo">Activo</option>
                  </select>
                </div>

                <div className="form-control md:col-span-2">
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
              </div>
            </div>
          </div>
        )}

        {activeTab === "objectives" && (
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Objetivos</h2>
                <button
                  type="button"
                  onClick={addObjetivo}
                  className="btn btn-primary btn-sm"
                >
                  <FaPlus className="mr-2" /> Agregar Objetivo
                </button>
              </div>

              {formData.objetivos.map((objetivo, index) => (
                <div key={index} className="flex gap-4 mb-4">
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
                          <FaTrash />
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
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Líder del Proyecto</h2>
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
            </div>

            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Profesor Guía</h2>
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
            </div>

            <div className="card bg-base-100">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title">Colaboradores</h2>
                  <button
                    type="button"
                    onClick={addColaborador}
                    className="btn btn-primary btn-sm"
                  >
                    <FaPlus className="mr-2" /> Agregar Colaborador
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
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title">Documentos del Proyecto</h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Agregar Documentos</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered"
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
                          <FaTrash />
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
                        <a href={doc.ruta} target="_blank" rel="noopener noreferrer" className="link link-primary">
                          Documento {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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