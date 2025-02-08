import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserEdit, FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';
import { getAllUsers, searchUsers, getReporteUsuarios } from '../../../../utils/services/get';
import EditUserRole from './editUser';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        setFilteredUsers(usersData); 
      } catch (error) {
        toast.error('Error al obtener usuarios');
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    const results = users.filter((user) =>
      user.cedula.toString().includes(searchTerm) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  };

  const handleSaveRole = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.cedula === updatedUser.cedula ? updatedUser : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedUser(null);
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
  };

  const getRoleColor = (rol) => {
    switch (rol.toLowerCase()) {
      case 'admin':
        return 'badge-primary';
      case 'docente':
        return 'badge-secondary';
      case 'estudiante':
        return 'badge-accent';
      default:
        return 'badge-ghost';
    }
  };

  // Función para descargar el reporte de usuarios
  const handleDownloadUserReport = async () => {
    try {
      const response = await getReporteUsuarios();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_usuarios.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Reporte de usuarios descargado con éxito");
    } catch (error) {
      toast.error("Error al descargar el reporte de usuarios");
    }
  };

  return (
    <div className="p-6 bg-base-200  overflow-auto h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      {/* Botón para descargar reporte de usuarios */}
      <div className="mb-5">
        <button 
          onClick={handleDownloadUserReport} 
          className="btn btn-primary"
        >
          Descargar Reporte de Usuarios
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-5 flex gap-2">
        <div className="form-control flex w-1/2">
          <div className="input-group flex gap-5">
            <input
              type="text"
              placeholder="Buscar por cédula, correo, nombre o apellido..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              <FaSearch className="mr-2" />
              Buscar
            </button>
          </div>
        </div>
      </form>

      {/* User Table */}
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.cedula}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover"
              >
                <td>{user.cedula}</td>
                <td>{`${user.nombre} ${user.apellido}`}</td>
                <td>{user.correo}</td>
                <td>{user.usuario}</td>
                <td>
                  <span className={`badge ${getRoleColor(user.rol)}`}>
                    {user.rol}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="btn btn-ghost btn-sm tooltip"
                    data-tip="Editar rol"
                  >
                    <FaUserEdit className="text-lg" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Role Modal */}
      {selectedUser && (
        <EditUserRole
          user={selectedUser}
          onSave={handleSaveRole}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default UserList;
