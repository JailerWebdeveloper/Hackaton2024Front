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
  return getData(`/usuarios`);
};

export const getUserinfo = async (id) => {
  return getData(`/usuarios/${id}`);
};

export const searchUsers = async (query) => {
  return getData(`/usuarios/search?q=${query}`);
};

export const getAllUsersDashboard = async () => {
  return getData(`/users/dashboard-usuarios`);
};
//proyectos
export const GetProjectbyID = async (id) => {
  return getData(`/proyectos/${id}`);
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
  return getData(`/archivos/todosarchivosporidproyecto/${proyectoid}`);
};

//proyectos

export const GetallProjects = async () => {
  return getData(`/proyectos`);
}
export const getProjectsBystatus = async (status) => {  
  return getData(`/proyectos/dashboard-proyectos/${status}`);
}

export const getProjectsByID = async (id) => {
  return getData(`/proyectos/${id}`);
}

export const getProjectsbyEmail = async (email) => {
  return getData(`/proyectos/search/email/${email}`);
}

export const getProjectsbyName = async (name) => {
  return getData(`/proyectos/search/name/${name}`);
}

export const getProjectsbyProgram = async (id) => {
  return getData(`/proyectos/todosproyectosporidprograma/${id}`);
};

//mensajes
export const getMessagesbyProject = async (id) => {
  return getData(`/mensajes/proyecto/${id}`);
}

export const getMensajesporCorreo = async (email) => {
  return getData(`/mensajes/mensajesporcorreo/${email}`);
}

//reportes
export const getReporteUsuarios = async () => {
  return getData(`/reports/users`);
}

export const getReporteProyectos = async (id) => {
  return getData(`/reports/project/${id}`);
}