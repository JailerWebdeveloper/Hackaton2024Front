import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserEdit, FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';
import { getAllUsers, searchUsers } from '../../../../utils/services/get';
import EditUserRole from './editUser';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        setFilteredUsers(usersData); // Sincroniza el filtro con los usuarios originales
      } catch (error) {
        toast.error('Error al obtener usuarios');
      }
    };
    fetchUsers();
  }, []);


  // Search functionality
  // Search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      // Si el término está vacío, mostrar todos los usuarios
      setFilteredUsers(users);
      return;
    }
    // Filtrar usuarios localmente
    const results = users.filter((user) =>
      user.cedula.toString().includes(searchTerm) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  };


  // Handle role save
  const handleSaveRole = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.cedula === updatedUser.cedula ? updatedUser : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedUser(null);
  };

  // Handle role edit cancel
  const handleCancelEdit = () => {
    setSelectedUser(null);
  };

  // Utility to determine badge color for roles
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

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

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
