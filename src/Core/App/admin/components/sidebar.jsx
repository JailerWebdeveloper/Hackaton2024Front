import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import {
    HiOutlineTemplate,
    HiOutlineUser,
    HiViewBoards,
    HiChartPie,
    HiChevronDown,
    HiChevronRight
} from "react-icons/hi";
import { MdHome } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { TiThMenu } from "react-icons/ti";
import { useUser } from '../../../utils/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const menuItems = [
    {
        icon: MdHome,
        label: 'Inicio',
        path: '/dashboard'
    },
    {
        icon: HiOutlineTemplate,
        label: 'Gestión de Proyectos',
        subItems: [
            { label: 'Gestionar mis  Proyectos', path: 'projects/list' },
            { label: 'Crear Nuevo', path: 'projects/create' }
        ]
    },
    {
        icon: HiOutlineUser,
        label: 'Gestión de Usuarios',
        subItems: [
            { label: 'Administrar Usuarios', path: 'users/list' },
            // { label: 'Permisos', path: '/users/permissions' },
            // { label: 'Roles', path: '/users/roles' }
        ]
    },
    // { 
    //     icon: HiViewBoards, 
    //     label: 'Gestión de Procesos',
    //     subItems: [
    //         { label: 'Flujos de Trabajo', path: '/processes/workflows' },
    //         { label: 'Procesos Automatizados', path: '/processes/automated' },
    //         { label: 'Estadísticas', path: '/processes/stats' }
    //     ]
    // },
    {
        icon: HiChartPie,
        label: 'Reportes',
        subItems: [
            { label: 'Reportes Generales', path: 'reports/general' },
        ]
    }
];

const Sidebar = () => {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const location = useLocation();

    const toggleMenuItem = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    const isActiveParent = (subItems) => {
        return subItems?.some(item => location.pathname === item.path);
    };

    const { user, loading, error } = useUser();


    const handleLogout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        navigate("/auth/login");
    };


    const filteredMenuItems = menuItems.filter(item => {
        if (item.label === 'Gestión de Usuarios' && user?.rol !== 'admin') return false;
        if (item.label === 'Reportes' && user?.rol !== 'admin') return false;
        return true;
    });


    console.log(user)

    return (
        <aside className="h-full flex-col md:flex-row flex shadow-lg">
            <div
                className="flex md:flex-col p-4 w-full md:w-16 bg-white border-r border-gray-100 justify-between md:h-full"
                id="useraside"
            >
                <div className="flex flex-row md:flex-col">
                    <Link to="/profile" className="avatar online placeholder">
                        <div className="bg-blue-500 text-white w-[2rem] md:w-16 rounded-full flex items-center justify-center">
                            <span className="text-xl">
                                {user?.nombre?.[0]?.toUpperCase() || ''}{user?.apellido?.[0]?.toUpperCase() || ''}
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex flex-row md:flex-col gap-4 items-center">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-600 hover:text-blue-500 flex items-center gap-3 uppercase transition-all duration-150"
                    >
                        <TiThMenu className='size-6' />
                    </button>
                    <div className='divider divider-horizontal ml-0'></div>
                    <div className="indicator hover:text-blue-600 text-gray-600 transition-all duration-150">
                        <span className="indicator-item badge badge-xs bg-red-500"></span>
                        <Link to="/notifications" className="rounded-full p-2">
                            <IoNotifications className="size-6" />
                        </Link>
                    </div>

                    <button onClick={handleLogout} className="rounded-full p-2 hover:text-red-600 text-gray-600 transition-all duration-150">
                        <RiLogoutCircleLine className="size-6" />
                    </button>
                </div>
            </div>

            <div
                className={`${isMenuOpen ? "block" : "hidden"
                    } md:flex flex-col p-4 w-full md:w-64 bg-gray-50 justify-between h-full`}
                id="menuaside"
            >
                <ul className="h-full w-full flex flex-col gap-2">
                    <p className="uppercase font-extrabold text-gray-500 ml-2 mt-5 mb-3">Menu</p>
                    {filteredMenuItems.map((item, index) => (
                        <li
                            key={index}
                            className="w-full"
                        >
                            {item.path ? (
                                <Link
                                    to={item.path}
                                    className={`text-gray-800 w-full rounded-lg p-2 items-center gap-2 font-semibold text-sm flex hover:bg-gray-200 hover:text-blue-600 transition-all duration-150
                                        ${isActiveRoute(item.path) ? 'bg-blue-50 text-blue-600' : ''}`}
                                >
                                    <item.icon className="size-6" />
                                    {item.label}
                                </Link>
                            ) : (
                                <div
                                    onClick={() => toggleMenuItem(index)}
                                    className={`text-gray-800 w-full rounded-lg p-2 items-center gap-2 font-semibold text-sm flex hover:bg-gray-200 hover:text-blue-600 transition-all duration-150 cursor-pointer
                                        ${isActiveParent(item.subItems) ? 'bg-blue-50 text-blue-600' : ''}`}
                                >
                                    <item.icon className="size-6" />
                                    {item.label}
                                    {item.subItems && (
                                        openMenuIndex === index ?
                                            <HiChevronDown className="ml-auto" /> :
                                            <HiChevronRight className="ml-auto" />
                                    )}
                                </div>
                            )}

                            <AnimatePresence>
                                {openMenuIndex === index && item.subItems && (
                                    <motion.ul
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="pl-8 overflow-hidden"
                                    >
                                        {item.subItems.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                <Link
                                                    to={subItem.path}
                                                    className={`block text-gray-600 text-sm py-2 hover:text-blue-600 transition-colors
                                                        ${isActiveRoute(subItem.path) ? 'text-blue-600 font-medium' : ''}`}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;