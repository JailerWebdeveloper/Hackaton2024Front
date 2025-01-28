import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const ProgramForm = ({ Faculties, onSubmit, initialData = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || { nombre: "", facultadId: 0 },
  });

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Nombre del programa */}
      <div>
        <label className="label">
          <span className="label-text">Nombre del Programa</span>
        </label>
        <input
          type="text"
          {...register("nombre", { required: "El nombre del programa es requerido" })}
          className="input input-bordered w-full"
          placeholder="Ingrese el nombre del programa"
        />
        {errors.nombre && (
          <span className="text-error text-sm">{errors.nombre.message}</span>
        )}
      </div>

      {/* Facultad asociada */}
      <div>
        <label className="label">
          <span className="label-text">Facultad</span>
        </label>
        <select
          {...register("facultadId", { required: "La facultad es requerida" })}
          className="select select-bordered w-full"
        >
          <option value="">Seleccione una Facultad</option>
          {Faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.nombre}
            </option>
          ))}
        </select>
        {errors.facultadId && (
          <span className="text-error text-sm">{errors.facultadId.message}</span>
        )}
      </div>

      {/* Botón de acción */}
      <button type="submit" className="btn btn-primary w-full">
        {initialData ? "Actualizar" : "Crear"} Programa
      </button>
    </motion.form>
  );
};

export default ProgramForm;
