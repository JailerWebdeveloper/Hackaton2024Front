import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getAllUsers, getProjectsByID } from '.../services/get'; 
import { updateProyecto } from '.../services/put'; 
import { useUser } from '.../hooks/useAuth'; 

const AssignEvaluator = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);

  const fetchProject = async () => {
    try {
      const projectResponse = await getProjectsByID(id);
      setProject(projectResponse);
    } catch (error) {
      toast.error("Error al cargar el proyecto");
    }
  };

  useEffect(() => {
    if (user && user.rol === 'administrador') {
      const loadUsers = async () => {
        try {
          const usersData = await getAllUsers();
          const evaluators = usersData.filter(u => 
            u.rol && u.rol.toLowerCase() === 'evaluador'
          );
          const options = evaluators.map(u => ({
            value: u.cedula,
            label: `${u.nombre} ${u.apellido} (${u.correo})`,
            nombre: `${u.nombre} ${u.apellido}`,
            email: u.correo,
            rol: 'Evaluador de Proyecto'
          }));
          setUsers(options);
        } catch (error) {
          toast.error("Error al cargar los usuarios");
        }
      };

      loadUsers();
      fetchProject();
    }
  }, [user, id]);

  const handleAssign = async () => {
    if (!selectedEvaluator) {
      toast.error("Por favor, seleccione un evaluador");
      return;
    }
    if (!project) {
      toast.error("Proyecto no cargado");
      return;
    }
    try {
      setLoading(true);
      const updatedProject = { ...project };

      if (!updatedProject.colaboradores) {
        updatedProject.colaboradores = [];
      }

      const evaluadorExistente = updatedProject.colaboradores.find(
        colaborador => colaborador.rol.toLowerCase() === 'evaluador de proyecto'
      );
      if (evaluadorExistente) {
        toast.error("Ya existe un evaluador asignado");
        setLoading(false);
        return;
      }

      updatedProject.colaboradores.push({
        nombre: selectedEvaluator.nombre,
        email: selectedEvaluator.email,
        rol: 'Evaluador de Proyecto'
      });

      await updateProyecto(project.id, updatedProject);
      toast.success("Evaluador asignado correctamente");
      setProject(updatedProject);
      setSelectedEvaluator(null);
    } catch (error) {
      toast.error("Error al asignar el evaluador");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.rol !== 'administrador') return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Asignar Evaluador de Proyecto</h2>
      <div className="mb-4">
        <Select
          options={users}
          value={selectedEvaluator}
          onChange={setSelectedEvaluator}
          placeholder="Seleccione un evaluador..."
        />
      </div>
      <button
        onClick={handleAssign}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Asignando..." : "Asignar Evaluador"}
      </button>
    </div>
  );
};

export default AssignEvaluator;
