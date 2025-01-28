import baseApi from "./api";

export const deleteData = async (endpoint) => {
  try {
    const response = await baseApi.delete(endpoint);
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.data.status,
        error: error.response.data.message.message,
      };
    } else if (error.request) {
      throw new Error("No se recibió respuesta del servidor");
    } else {
      throw new Error("Error al configurar la petición");
    }
  }
};

//proyectos
export const deleteProyecto = async (id) => {
  return deleteData(`/proyectos/${id}`);
};
