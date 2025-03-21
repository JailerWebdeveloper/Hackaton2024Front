import baseApi from "./api";

export const getData = async (endpoint, params = {}) => {
  try {
    const response = await baseApi.get(endpoint, { params });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message.message || "Error del servidor"
      );
    } else if (error.request) {
      throw new Error("No se recibió respuesta del servidor");
    } else {
      throw new Error("Error al configurar la petición");
    }
  }
};

//usuarios
export const getAllUsers = async () => {
  return getData(`/users`);
};

export const getUserinfo = async (id) => {
  return getData(`/users/${id}`);
};

export const searchUsers = async (query) => {
  return getData(`/users/search?q=${query}`);
};

export const getAllUsersDashboard = async () => {
  return getData(`/users/dashboard-usuarios`);
};

export const GetallProject = async () => {
  return getData(`/proyectos`);
};

export const GetProjectbyUser = async (userid) => {
  return getData(`/proyectos/usuario/${userid}`);
};

//facutades

export const getFacultades = async () => {
  return getData(`/facultad`);
};

export const getFacultadbyID = async (id) => {
  return getData(`/facultad/getbyid/${id}`);
};

//programas

export const getProgramas = async () => {
  return getData(`/programa`);
};

export const getProgramabyID = async (id) => {
  return getData(`/programa/getbyid/${id}`);
};
export const getProgramabyFacultad = async (id) => {
  return getData(`/programa/todosprogramasporidfacultad/${id}`);
};

//archivos

export const getFilesbyProject = async (id) => {
  return getData(`/public/docs/${id}`);
};

//proyectos

export const GetProjectbyID = async (id) => {
  return getData(`/proyectos/${id}`);
};

export const GetallProjects = async () => {
  return getData(`/proyectos`);
};
export const getProjectsBystatus = async (status) => {
  return getData(`/proyectos/dashboard-proyectos/${status}`);
};

export const getProjectsByID = async (id) => {
  return getData(`/proyectos/${id}`);
};

export const getProjectsbyEmail = async (email) => {
  const queryParams = new URLSearchParams({ email });
  return getData(`/proyectos/search/email?${queryParams}`);
};


export const getProjectsbyName = async (name) => {
  return getData(`/proyectos/search/name/${name}`);
};

export const getProjectsbyProgram = async (id) => {
  return getData(`/proyectos/todosproyectosporidprograma/${id}`);
};

//mensajes
export const getMessagesbyProject = async (id) => {
  return getData(`/mensajes/proyecto/${id}`);
};

export const getMensajesporCorreo = async (email) => {
  return getData(`/mensajes/mensajesporcorreo/${email}`);
};

//reportes
export const getReporteUsuarios = async () => {
  try {
    const response = await baseApi.get(`/reports/users`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    throw error;
  }
};

export const getallReporteProyectos = async ()=>{
  try {
    const response = await baseApi.get(`/reports/projects`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    throw error;
  }
}

export const getReporteProyectos = async (id) => {
  try {
    const response = await baseApi.get(`/reports/project/${id}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    throw error;
  }
};


export const getReporteProyectosexcel = async (id) => {
  try {
    const response = await baseApi.get(`/reports/export`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    throw error;
  }
};
