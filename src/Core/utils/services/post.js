import baseApi from "./api";

export const postData = async (endpoint, body) => {
  try {
    const response = await baseApi.post(endpoint, body);
    return {
     response
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response,
        error: error.response.data.message.message,
      };
    } else if (error.request) {
      throw new Error("No se recibió respuesta del servidor");
    } else {
      throw new Error("Error al configurar la petición");
    }
  }
};

//usuarios
export const createUser = async (body) => {
  return postData(`/users`, body);
};

export const loginUser = async (body) => {
  return postData(`/users/login`, body);
};

//facultad
export const createFacultad = async (body) => {
  return postData(`/facultad`, body);
};

//programa
export const createPrograma = async (body) => {
  return postData(`/programa`, body);
};

//archivo
export const createArchivo = async (formData) => {
  return await baseApi.post(`/archivos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

//proyecto
export const createProyecto = async (body) => {
  return postData(`/proyectos`, body);
};

//mensajes
export const createMensaje = async (body) => {
  return postData(`/mensajes`, body);
};
