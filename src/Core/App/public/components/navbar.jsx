import React, { useState } from 'react';
import { FiLogIn, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar bg-base-100 shadow-md px-4 md:px-8 py-3">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="/BannerUPC.png"
                        alt="Logoupc"
                        className="h-8 md:h-12 w-auto mr-2 md:mr-4 transition-transform hover:scale-105"
                    />
                    <div className=" divider divider-horizontal mx-2 md:mx-4"></div>
                    <h1 className="text-lg md:text-2xl font-semibold text-color-primary capitalize">
                        Hackaton 2024
                    </h1>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <a
                        href='/auth/login'
                        className="btn btn-outline text-color-primary hover:text-white hover:bg-color-primary transition-all 
                        active:scale-95 flex items-center gap-2"
                    >
                        <FiLogIn className="mr-1" />
                        Iniciar sesión
                    </a>

                    <a
                        href='/auth/register'
                        className="btn bg-color-primary text-white hover:text-color-primary hover:bg-white transition-all 
                        active:scale-95 flex items-center gap-2"
                    >
                        <FiUserPlus className="mr-1" />
                        Regístrate
                    </a>
                </div>

                <div className="md:hidden">
                    <button 
                        onClick={toggleMenu} 
                        className="btn btn-ghost"
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-20" onClick={toggleMenu}>
                    <div 
                        className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-6 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end">
                            <button 
                                onClick={toggleMenu} 
                                className="btn btn-ghost btn-circle"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <a
                                href='/auth/login'
                                className="btn btn-outline text-color-primary hover:text-white hover:bg-color-primary transition-all 
                                active:scale-95 flex items-center justify-center gap-2"
                                onClick={toggleMenu}
                            >
                                <FiLogIn />
                                Iniciar sesión
                            </a>

                            <a
                                href='/auth/register'
                                className="btn bg-color-primary text-white hover:text-color-primary hover:bg-white transition-all 
                                active:scale-95 flex items-center justify-center gap-2"
                                onClick={toggleMenu}
                            >
                                <FiUserPlus />
                                Regístrate
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;