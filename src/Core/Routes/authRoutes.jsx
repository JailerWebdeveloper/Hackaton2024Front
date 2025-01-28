import { Routes, Route } from "react-router-dom";
import AuthLayout from "../App/auth/layouts/authLayout";
import Login from "../App/auth/pages/login";
import Register from "../App/auth/pages/register";




const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register/>}/>
       </Route>
    </Routes>
  );
};

export default AuthRoutes;
