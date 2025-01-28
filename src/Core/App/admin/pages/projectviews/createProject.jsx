import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TeamMembers from '../../components/teamMembers';
import Objectives from '../../components/objetives';
import BasicInfo from '../../components/basicInfo';
import { useCreateProject } from '../../../../utils/hooks/useCreateProject';
import { useUser } from '../../../../utils/hooks/useAuth';

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject, loading } = useCreateProject();
  const { user } = useUser();

  const [objectives, setObjectives] = useState([{ nombre: '' }]);
  const [collaborators, setCollaborators] = useState([{ nombre: '', email: '', rol: '' }]);
  const [document, setDocument] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    programa: '',
    liderProyecto: {
      nombre: user?.nombre || '',
      email: user?.correo || '',
      rol: 'Líder de Proyecto',
    },
    profesorGuia: { nombre: '', email: '', rol: 'Docente Guía' },
    vistaPreviaDocumento: [],
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        liderProyecto: {
          nombre: user.nombre,
          email: user.correo,
          rol: 'Líder de Proyecto',
        },
        programa: user.programa || prev.programa,
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        objetivos: objectives.filter((obj) => obj.nombre.trim() !== ''),
        colaboradores: collaborators.filter(
          (col) => col.nombre.trim() !== '' && col.email.trim() !== ''
        ),
      };
  
      await createProject(dataToSubmit, document); 
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
    setFormData((prev) => ({
      ...prev,
      vistaPreviaDocumento: [file ? file.name : '',]
    }));
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...objectives];
    newObjectives[index] = { nombre: value };
    setObjectives(newObjectives);
  };

  const handleCollaboratorChange = (index, field, value) => {
    const newCollaborators = [...collaborators];
    newCollaborators[index] = { ...newCollaborators[index], [field]: value };
    setCollaborators(newCollaborators);
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4 md:p-8"
    >
      <div className="w-full mx-auto h-[39rem] overflow-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Crear Nuevo Proyecto</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <BasicInfo formData={formData} onChange={handleInputChange} />

          {/* Objetivos */}
          <Objectives
            objectives={objectives.map((obj) => obj.nombre)}
            onAdd={() => setObjectives([...objectives, { nombre: '' }])}
            onRemove={(index) => setObjectives(objectives.filter((_, i) => i !== index))}
            onChange={handleObjectiveChange}
          />

          {/* Miembros del Equipo */}
          <TeamMembers
            collaborators={collaborators}
            onAdd={() =>
              setCollaborators([
                ...collaborators,
                { nombre: '', email: '', rol: 'Colaborador' },
              ])
            }
            onRemove={(index) => setCollaborators(collaborators.filter((_, i) => i !== index))}
            onChange={handleCollaboratorChange}
          />

          {/* Campos Adicionales */}
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Fecha de Inicio</span>
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Fecha de Fin</span>
              </label>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Docente Guía</span>
              </label>
              <input
                type="text"
                name="profesorGuia"
                value={formData.profesorGuia.nombre}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profesorGuia: { ...prev.profesorGuia, nombre: e.target.value },
                  }))
                }
                placeholder="Nombre del Docente Guía"
                className="input input-bordered w-full"
              />
              <input
                type="email"
                name="profesorGuiaEmail"
                value={formData.profesorGuia.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profesorGuia: { ...prev.profesorGuia, email: e.target.value },
                  }))
                }
                placeholder="Correo del Docente Guía"
                className="input input-bordered w-full mt-2"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Cargar Documento</span>
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
              {formData.vistaPreviaDocumento && (
                <p className="text-sm text-gray-600 mt-2">
                  Documento seleccionado: {formData.vistaPreviaDocumento}
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateProject;
