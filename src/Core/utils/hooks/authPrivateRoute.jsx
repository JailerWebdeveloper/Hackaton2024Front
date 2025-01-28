import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


const isTokenValid = () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
//   if (!token || token.split('.').length !== 3) {
//       console.error("Token inválido o malformado.");
//       return false;
//   }
  try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
      return decoded.exp > currentTime;
  } catch (error) {
      console.error("Error al decodificar el token:", error);
      return false;
  }
};


const AuthPrivateRoute = ({ children }) => {
    return isTokenValid() ? children : <Navigate to="/" />;
};

export {
    AuthPrivateRoute,
    isTokenValid
} 

