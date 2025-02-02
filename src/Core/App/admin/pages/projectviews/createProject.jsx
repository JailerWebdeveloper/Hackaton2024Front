import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Calendar, Users, Target, BookOpen, Upload } from 'lucide-react';
import { useCreateProject } from '../../../../utils/hooks/useCreateProject';
import { useUser } from '../../../../utils/hooks/useAuth';
import { getAllUsers } from '../../../../utils/services/get';

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject, loading } = useCreateProject();
  const { user } = useUser();

  const [objectives, setObjectives] = useState([{ nombre: '' }]);
  const [collaborators, setCollaborators] = useState([]);
  const [document, setDocument] = useState(null);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    linea_Investigacion: '',
    fechaInicio: '',
    fechaFin: '',
    fecha_entrega: '',
    programa: '',
    liderProyecto: {
      nombre: user?.nombre || '',
      email: user?.correo || '',
      rol: 'Líder de Proyecto',
    },
    profesorGuia: { nombre: '', email: '', rol: 'Docente Guía' },
    vistaPreviaDocumento: [],
  });

  const lineasInvestigacion = [
    "Sistemas de información",
    "Ingeniería de software",
    "Seguridad de información",
    "Informática educativa",
    "Telecomunicaciones y teleinformática",
    "Big Data y Analytics",
    "Sistemas inteligentes",
    "Robótica y automatización",
    "Tecnologías emergentes"
  ];

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData.map(user => ({
          value: user.cedula,
          label: `${user.nombre} ${user.apellido} (${user.correo})`,
          nombre: `${user.nombre} ${user.apellido}`,
          email: user.correo,
          rol: user.rol
        })));
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();
  }, []);

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
        colaboradores: collaborators
      };

      await createProject(dataToSubmit, document);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCollaboratorsChange = (selectedOptions) => {
    const newCollaborators = selectedOptions.map(option => ({
      nombre: option.nombre,
      email: option.email,
      rol: 'Colaborador'
    }));
    setCollaborators(newCollaborators);
  };

  return (
    <div className="h-screen overflow-auto bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Crear Nuevo Proyecto</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Información Básica */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Información Básica
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título del Proyecto</label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Línea de Investigación</label>
                  <select
                    name="linea_Investigacion"
                    value={formData.linea_Investigacion}
                    onChange={(e) => setFormData({ ...formData, linea_Investigacion: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione una línea</option>
                    {lineasInvestigacion.map((linea) => (
                      <option key={linea} value={linea}>{linea}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Fechas del Proyecto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
                  <input
                    type="date"
                    name="fecha_entrega"
                    value={formData.fecha_entrega}
                    onChange={(e) => setFormData({ ...formData, fecha_entrega: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Objetivos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objetivos
              </h2>
              <div className="space-y-2">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={objective.nombre}
                      onChange={(e) => {
                        const newObjectives = [...objectives];
                        newObjectives[index] = { nombre: e.target.value };
                        setObjectives(newObjectives);
                      }}
                      placeholder="Escriba el objetivo"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setObjectives(objectives.filter((_, i) => i !== index))}
                      className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setObjectives([...objectives, { nombre: '' }])}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Agregar Objetivo
                </button>
              </div>
            </div>

            {/* Equipo */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Equipo del Proyecto
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Docente Guía</label>
                  <Select
                    options={users.filter(user => user.rol === 'docente')}
                    onChange={(selected) => setFormData({
                      ...formData,
                      profesorGuia: {
                        nombre: selected.nombre,
                        email: selected.email,
                        rol: 'Docente Guía'
                      }
                    })}
                    placeholder="Seleccione el docente guía"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Colaboradores</label>
                  <Select
                    isMulti
                    options={users}
                    onChange={handleCollaboratorsChange}
                    placeholder="Seleccione los colaboradores"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Documento */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Documento del Proyecto
              </h2>
              <div>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setDocument(file);
                    setFormData({
                      ...formData,
                      vistaPreviaDocumento: [file ? file.name : '']
                    });
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {formData.vistaPreviaDocumento[0] && (
                  <p className="mt-2 text-sm text-gray-500">
                    Documento seleccionado: {formData.vistaPreviaDocumento[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Proyecto'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProject;