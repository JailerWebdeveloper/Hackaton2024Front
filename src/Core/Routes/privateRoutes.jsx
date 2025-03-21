import { Routes, Route } from "react-router-dom";
import AdminLayout from "../App/admin/layouts/adminLayout";
import Dashboard from "../App/admin/pages/dashboard/dashboard";
import ProjectView from "../App/admin/pages/projectviews/projectView";
import Reports from "../App/admin/pages/graph/graphView";
import CreateProject from "../App/admin/pages/projectviews/createProject";
  import UserList from "../App/admin/pages/users/userList";
import UserProjects from "../App/admin/pages/projectviews/projectUserList";
import ProjectEdit from "../App/admin/pages/projectviews/projectEdit";
import { AuthPrivateRoute } from "../utils/hooks/authPrivateRoute";
import Programs from "../App/admin/pages/recursos/programasManage";
import Faculties from "../App/admin/pages/recursos/facultadManage";
import Profile from "../App/admin/pages/users/profile";


const PrivateRoutes = () => (
  <Routes>
  <Route path="/" element={<AuthPrivateRoute><AdminLayout /></AuthPrivateRoute>}>
    <Route index element={<Dashboard/>} />
    <Route path="/project/:id" element={<ProjectView/>}/>
    <Route path="/reports/general" element={<Reports/>}/>
    <Route path="/projects/create" element={<CreateProject/>}/>
    <Route path="/projects/edit/:id" element={<ProjectEdit/>}/>
    <Route path="/projects/list" element={<UserProjects/>}/>
    <Route path="/users/list" element={<UserList/>}/>
    <Route path="/profile" element={<Profile/>}/>

    <Route path ='/manage/programs' element={<Programs/>}/>
    <Route path ='/manage/Faculties' element={<Faculties/>}/>
  </Route>
</Routes>
);

export default PrivateRoutes;
