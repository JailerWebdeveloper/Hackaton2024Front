import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield } from 'react-icons/fa';
import { toast } from 'sonner';
import { updateUserRole } from '../../../../utils/services/get';

const EditUserRole = ({ user, onSave, onCancel }) => {
  const [selectedRole, setSelectedRole] = useState(user.rol);
  const [loading, setLoading] = useState(false);
  const roles = ['admin', 'Docente', 'estudiante'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRole === user.rol) {
      onCancel();
      return;
    }

    setLoading(true);
    try {
      await updateUserRole(user.id, selectedRole); // Use user.id instead of user.cedula
      toast.success('Rol actualizado exitosamente');
      onSave({ ...user, rol: selectedRole });
    } catch (error) {
      console.error('Error details:', error.response?.data || error);
      toast.error('Error al actualizar el rol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-base-100 rounded-lg shadow-xl p-6 max-w-md w-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <FaUserShield className="text-2xl text-primary" />
            <h2 className="text-xl font-bold">Modificar Rol de Usuario</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium opacity-70">Nombre:</label>
                <p className="font-semibold">{`${user.nombre} ${user.apellido}`}</p>
              </div>
              <div>
                <label className="text-sm font-medium opacity-70">Cédula:</label>
                <p className="font-semibold">{user.cedula}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Correo:</label>
              <p className="font-semibold">{user.correo}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Seleccionar Nuevo Rol</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={loading}
              >
                {roles.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading || selectedRole === user.rol}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditUserRole;