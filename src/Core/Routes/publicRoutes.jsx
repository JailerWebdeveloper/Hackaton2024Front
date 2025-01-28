import { Routes, Route } from "react-router-dom";
import Home from "../App/public/pages/Home/home";
import LayoutPublic from "../App/public/layouts/layoutPublic";



const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutPublic />}>
        <Route index element={<Home/>} />
       </Route>
    </Routes>
  );
};

export default PublicRoutes;
