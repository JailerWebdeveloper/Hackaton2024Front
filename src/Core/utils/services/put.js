import baseApi from "./api";
import axios from "axios";

export const updateData = async (endpoint, body) => {
  try {
    console.log("Payload enviado:", body);

    const response = await baseApi.put(endpoint, body);
    return response.data;
  } catch (error) {
    console.error("Error en updateData:", error);

    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data.message,
      };
    } else if (error.request) {
      throw new Error("No se recibió respuesta del servidor");
    } else {
      throw new Error("Error al configurar la petición");
    }
  }
};


export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await axios.put(
      `https://hackathon-back-production.up.railway.app/users/asignar-rol/${userId}`,
      { rol: newRole },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el rol del usuario", error);
    throw error;
  }
};


export const updateFacultad = async (id, body) => {
  return updateData(`/facultad/update/${id}`, body);
};

export const updatePrograma = async (id, body) => {
  return updateData(`/programa/update/${id}`, body);
};

export const updateProyecto = async (id, body) => {
  return updateData(`/proyectos/update/${id}`, body);
};

export const addFinalDate = async (id, date) => {
  return updateData(`/proyectos/agregar-fecha/${id}`, { date });
};
