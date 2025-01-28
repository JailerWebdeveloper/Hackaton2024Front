import { useState } from 'react';
import { toast } from 'sonner';

export const useCreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProject = async (projectData, documentFile) => {
    try {
      setLoading(true);
      setError(null);

      console.log(projectData)
      const projectResponse = await fetch(
        'https://hackathon-back-production.up.railway.app/proyectos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        }
      );

      if (!projectResponse.ok) {
        throw new Error('Error al crear el proyecto');
      }

      const createdProject = await projectResponse.json();
      toast.success('Proyecto creado exitosamente');

      if (documentFile) {
        const formData = new FormData();
        formData.append('file', documentFile);
        formData.append('categoria', 'Documento Proyecto');
        formData.append('proyectoId', createdProject.id);

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

        toast.success('Archivo cargado exitosamente');
      }

      return createdProject;
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido';
      console.log(err)
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
};
