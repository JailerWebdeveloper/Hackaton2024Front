import { Outlet } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";

const AuthLayout = () => {
    return (<>
        <div className="min-h-screen w-full  items-center hero  " style={{
            backgroundImage: "url(/BGupc.webp)",
        }} >
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="absolute z-20 top-5 md:top-8 md:left-10 p-4 flex group justify-center items-center rounded-xl hover:bg-gray-200 hover:bg-opacity-10 transition-all duration-150">
                <a href="/" className=" text-gray-400 transition-all duration-150 group-hover:text-white flex items-center gap-2 "><IoIosArrowBack className="size-8 md:block hidden"/><HiOutlineHome className="size-8 mb-1" /></a>
            </div>
            <Outlet />
        </div>
    </>);
}

export default AuthLayout;