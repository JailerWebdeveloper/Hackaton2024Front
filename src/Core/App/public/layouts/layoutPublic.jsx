import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

const LayoutPublic = () => {
    return (
    <>
    <div className="h-screen w-full flex-col flex">
        <Navbar/>
        <div className="flex-1 w-full"> 
            <Outlet />
            </div>
       
        <Footer/>
        </div>
    </>);
}

export default LayoutPublic;