import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const FacultyForm = ({ onSubmit, initialData = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || { nombre: "" },
  });

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Nombre de la facultad */}
      <div>
        <label className="label">
          <span className="label-text">Nombre de la Facultad</span>
        </label>
        <input
          type="text"
          {...register("nombre", { required: "El nombre de la facultad es requerido" })}
          className="input input-bordered w-full"
          placeholder="Ingrese el nombre de la facultad"
        />
        {errors.nombre && (
          <span className="text-error text-sm">{errors.nombre.message}</span>
        )}
      </div>

      {/* Botón de acción */}
      <button type="submit" className="btn btn-primary w-full">
        {initialData ? "Actualizar" : "Crear"} Facultad
      </button>
    </motion.form>
  );
};

export default FacultyForm;
