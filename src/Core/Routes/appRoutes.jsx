import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./publicRoutes";
import AuthRoutes from "./authRoutes";
import PrivateRoutes from "./privateRoutes";
import NotFound from "../App/public/pages/notFound404";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<PublicRoutes/>} />
        <Route path="/auth/*" element={<AuthRoutes/>}/>
        <Route path="/dashboard/*" element={<PrivateRoutes />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
};

export default AppRoutes;
