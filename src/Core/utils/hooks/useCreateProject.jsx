import { useState } from 'react';
import { toast } from 'sonner';
import { createArchivo, createProyecto } from '../services/post';

export const useCreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProject = async (projectData, documentFile) => {

    try {
      setLoading(true);
      setError(null);

      const projectResponse = await createProyecto(projectData)


      if (projectResponse.status != 201) {
        throw new Error('Error al crear el proyecto');
      }

      toast.success('Proyecto creado exitosamente');

      if (documentFile) {

        const formData = {
          file: documentFile,
          categoria: 'Documento Proyecto',
          proyectoId: projectResponse.data.id

        }

        const fileResponse = await createArchivo(formData);

        if (fileResponse.status != 201) {
          throw new Error('Error al cargar el archivo');
        }

        toast.success('Archivo cargado exitosamente');
      }

    } catch (err) {
      const errorMessage = err.message || 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
};
