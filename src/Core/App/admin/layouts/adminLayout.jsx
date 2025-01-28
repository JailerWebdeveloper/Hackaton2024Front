import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

const AdminLayout = () => {
    return (
        <>
            <div className="h-screen w-full">
                <div className="w-full h-full flex flex-col">
                    <div className=" w-full h-full md:flex-row flex flex-col">
                        <Sidebar />
                        <div className="flex-1">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>


        </>);
}

export default AdminLayout;