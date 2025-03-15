import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'sonner';
import { CiUser } from "react-icons/ci";
import { loginUser } from "../../../utils/services/post";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");

        if (!email) {
            setEmailError("Por favor ingrese un correo válido");
            toast.error('Error en el correo', { description: 'Debe ingresar un correo electrónico' });
            return;
        }
        if (!password || password.length < 8) {
            setPasswordError("La contraseña debe tener al menos 8 caracteres");
            toast.error('Error en contraseña', { description: 'La contraseña debe tener 8 caracteres como mínimo' });
            return;
        }

        try {
            const data = {
                usuario: email,
                contrasena: password,
            }
            const response = await loginUser(data);

            if (response.status === 200 || response.status === 201) {
                const token = response.data.token;

                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");

                if (rememberMe) {
                    localStorage.setItem("authToken", token);
                } else {
                    sessionStorage.setItem("authToken", token);
                }

                const decodedToken = jwtDecode(token);
                if(decodedToken.rol == "inactivo"){
                    toast.warning('su usuario se encuentra inactivo')
                    return;
                }
                toast.success('Inicio de sesión exitoso', {
                    description: `Bienvenido, ${decodedToken.name || 'usuario'}`,
                    duration: 2000
                });

                navigate("/dashboard", { replace: true });
            } else {
                setPasswordError("Correo o contraseña inválidos");
                toast.error('Error de autenticación', { description: 'Verifique sus credenciales' });
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error('Error de conexión', { description: 'Intente nuevamente más tarde' });
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-color-primary mb-2">Iniciar Sesión</h1>
                    <p className="text-gray-600">
                        ¿No tienes cuenta?
                        <a
                            href="/auth/register"
                            className="text-color-primary hover:underline ml-1 font-semibold"
                        >
                            Regístrate
                        </a>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Usuario
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <CiUser className="text-gray-400" />
                            </span>
                            <input
                                type="text"
                                id="email"
                                className={`w-full pl-10 py-3 px-4 input input-bordered rounded-lg 
                                    ${emailError ? 'input-error' : 'border-color-primary'}`}
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                                required
                            />
                        </div>
                        {emailError && <p className="text-xs text-red-600 mt-2">{emailError}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FiLock className="text-gray-400" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className={`w-full pl-10 pr-10 py-3 px-4 input input-bordered rounded-lg 
                                    ${passwordError ? 'input-error' : 'border-color-primary'}`}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                            </button>
                        </div>
                        {passwordError && <p className="text-xs text-red-600 mt-2">{passwordError}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="checkbox text-color-primary mr-2"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember-me" className="text-sm text-gray-600">
                                Recordarme
                            </label>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="w-full btn bg-color-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition-all"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;