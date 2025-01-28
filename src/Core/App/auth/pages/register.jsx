import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaIdCard, FaGraduationCap, FaBuilding } from 'react-icons/fa';
import { getFacultades, getProgramas } from '../../../utils/services/get';
import { createUser } from "../../../utils/services/post";

const Register = () => {
    const navigate = useNavigate();
    const [facultades, setFacultades] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [formState, setFormState] = useState({
        cedula: "",
        nombre: "",
        apellido: "",
        correo: "",
        usuario: "",
        contrasena: "",
        confirmarContrasena: "",
        facultadId: "",
        programaId: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [facultadesData, programasData] = await Promise.all([
                    getFacultades(),
                    getProgramas()
                ]);
                setFacultades(facultadesData);
                setProgramas(programasData);
            } catch (error) {
                toast.error('Error al cargar datos', { 
                    description: 'No se pudieron cargar las facultades y programas' 
                });
            }
        };

        loadInitialData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));

        if (name === 'facultadId') {
            setFormState(prev => ({ ...prev, programaId: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formState.cedula || !/^\d{7,10}$/.test(formState.cedula)) {
            newErrors.cedula = "La cédula debe tener entre 7 y 10 dígitos";
            toast.error('Error en cédula', { description: newErrors.cedula });
        }

        if (!formState.nombre) {
            newErrors.nombre = "El nombre es requerido";
            toast.error('Error en nombre', { description: newErrors.nombre });
        }

        if (!formState.apellido) {
            newErrors.apellido = "El apellido es requerido";
            toast.error('Error en apellido', { description: newErrors.apellido });
        }

        if (!formState.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.correo)) {
            newErrors.correo = "Ingrese un correo electrónico válido";
            toast.error('Error en correo', { description: newErrors.correo });
        }

        if (!formState.usuario) {
            newErrors.usuario = "El nombre de usuario es requerido";
            toast.error('Error en usuario', { description: newErrors.usuario });
        }

        if (!formState.contrasena || formState.contrasena.length < 8) {
            newErrors.contrasena = "La contraseña debe tener al menos 8 caracteres";
            toast.error('Error en contraseña', { description: newErrors.contrasena });
        }

        if (formState.contrasena !== formState.confirmarContrasena) {
            newErrors.confirmarContrasena = "Las contraseñas no coinciden";
            toast.error('Error en confirmación', { description: newErrors.confirmarContrasena });
        }

        if (!formState.facultadId) {
            newErrors.facultadId = "Seleccione una facultad";
            toast.error('Error en facultad', { description: newErrors.facultadId });
        }

        if (!formState.programaId) {
            newErrors.programaId = "Seleccione un programa";
            toast.error('Error en programa', { description: newErrors.programaId });
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            try {
                const data = {
                    cedula: parseInt(formState.cedula),
                    nombre: formState.nombre,
                    apellido: formState.apellido,
                    correo: formState.correo,
                    usuario: formState.usuario,
                    contrasena: formState.contrasena,
                    rol: "estudiante", 
                    facultadId: parseInt(formState.facultadId),
                    programaId: parseInt(formState.programaId)
                };

                const response = await createUser(data);


                if (response.ok) {
                    toast.success('Usuario registrado correctamente', {
                        description: 'Redirigiendo a inicio de sesión',
                        duration: 2000
                    });
                    navigate("/auth/login");
                } else {
                    const errorData = await response.json();
                    toast.error('Error al registrar', {
                        description: errorData.message || 'No se pudo completar el registro'
                    });
                }
            } catch (error) {
                toast.error('Error de conexión', { description: 'Intente nuevamente más tarde' });
                console.error("Error during registration:", error);
            }
        }

        setErrors(newErrors);
    };

    const filteredProgramas = programas.filter(
        programa => programa.facultad.id === parseInt(formState.facultadId)
    );

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-color-primary mb-2">Registro de Usuario</h1>
                    <p className="text-gray-600">
                        ¿Ya tienes una cuenta?
                        <a href="/auth/login" className="text-color-primary hover:underline ml-1 font-semibold">
                            Inicia sesión
                        </a>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Cédula</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FaIdCard className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    name="cedula"
                                    value={formState.cedula}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full pl-10 ${errors.cedula ? 'input-error' : ''}`}
                                    placeholder="Ingrese su cédula"
                                />
                            </div>
                            {errors.cedula && <span className="text-error text-xs mt-1">{errors.cedula}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Nombre</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FiUser className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formState.nombre}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full pl-10 ${errors.nombre ? 'input-error' : ''}`}
                                    placeholder="Ingrese su nombre"
                                />
                            </div>
                            {errors.nombre && <span className="text-error text-xs mt-1">{errors.nombre}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Apellido</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FiUser className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formState.apellido}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full pl-10 ${errors.apellido ? 'input-error' : ''}`}
                                    placeholder="Ingrese su apellido"
                                />
                            </div>
                            {errors.apellido && <span className="text-error text-xs mt-1">{errors.apellido}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Correo Electrónico</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FiMail className="text-gray-400" />
                                </span>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formState.correo}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full pl-10 ${errors.correo ? 'input-error' : ''}`}
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            {errors.correo && <span className="text-error text-xs mt-1">{errors.correo}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Usuario</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FiUser className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    name="usuario"
                                    value={formState.usuario}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full pl-10 ${errors.usuario ? 'input-error' : ''}`}
                                    placeholder="Nombre de usuario"
                                />
                            </div>
                            {errors.usuario && <span className="text-error text-xs mt-1">{errors.usuario}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Facultad</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FaBuilding className="text-gray-400" />
                                </span>
                                <select
                                    name="facultadId"
                                    value={formState.facultadId}
                                    onChange={handleChange}
                                    className={`select select-bordered w-full pl-10 ${errors.facultadId ? 'select-error' : ''}`}
                                >
                                    <option value="">Seleccione una facultad</option>
                                    {facultades.map(facultad => (
                                        <option key={facultad.id} value={facultad.id}>
                                            {facultad.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.facultadId && <span className="text-error text-xs mt-1">{errors.facultadId}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Programa</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FaGraduationCap className="text-gray-400" />
                                </span>
                                <select
                                    name="programaId"
                                    value={formState.programaId}
                                    onChange={handleChange}
                                    className={`select select-bordered w-full pl-10 ${errors.programaId ? 'select-error' : ''}`}
                                    disabled={!formState.facultadId}
                                >
                                    <option value="">Seleccione un programa</option>
                                    {filteredProgramas.map(programa => (
                                        <option key={programa.id} value={programa.id}>
                                            {programa.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.programaId && <span className="text-error text-xs mt-1">{errors.programaId}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Contraseña</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FiLock className="text-gray-400" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="contrasena"
                                    value={formState.contrasena}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full pl-10 ${errors.contrasena ? 'input-error' : ''}`}
                                    placeholder="********"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                                </button>
                            </div>
                            {errors.contrasena && <span className="text-error text-xs mt-1">{errors.contrasena}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirmar Contraseña</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FiLock className="text-gray-400" />
                                </span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmarContrasena"
                                    value={formState.confirmarContrasena}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full pl-10 ${errors.confirmarContrasena ? 'input-error' : ''}`}
                                    placeholder="********"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                                </button>
                            </div>
                            {errors.confirmarContrasena && <span className="text-error text-xs mt-1">{errors.confirmarContrasena}</span>}
                        </div>
                    </div>

                    <div className="mt-6">
                        <button type="submit" className="btn bg-color-primary w-full">
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;