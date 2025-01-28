import React, { useState, useEffect } from 'react';
import { LuSearch } from "react-icons/lu";
import ProjectCard from "../../components/projectCard/projectCard";
import { GetallProject, getFacultades, getProgramas } from "../../../../utils/services/get";

const Dashboard = () => {
    const [projects, setProjects] = useState([]); 
    const [filteredProjects, setFilteredProjects] = useState([]); 
    const [facultades, setFacultades] = useState([]); 
    const [programas, setProgramas] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [filters, setFilters] = useState({
        facultad: '',
        programa: '',
        estado: '',
    }); 

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const [projectsResponse, facultadesResponse, programasResponse] = await Promise.all([
                    GetallProject(),
                    getFacultades(),
                    getProgramas()
                ]);
                setProjects(projectsResponse.data); 
                setFilteredProjects(projectsResponse.data); 
                setFacultades(facultadesResponse); 
                setProgramas(programasResponse); 
            } catch (err) {
                setError('Error al cargar los datos. Inténtalo de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = projects;

            if (searchTerm) {
                filtered = filtered.filter(project =>
                    project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.liderProyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (filters.facultad) {
                filtered = filtered.filter(project =>
                    project.programa.facultad.nombre === filters.facultad
                );
            }

            if (filters.programa) {
                filtered = filtered.filter(project =>
                    project.programa.nombre === filters.programa
                );
            }

            if (filters.estado) {
                filtered = filtered.filter(project =>
                    project.estado === filters.estado
                );
            }

            setFilteredProjects(filtered);
        };

        applyFilters();
    }, [searchTerm, filters, projects]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    return (
        <div className="w-full overflow-auto h-screen flex flex-col p-4 md:p-8 bg-gray-50">
            <div className="w-full flex flex-wrap justify-between items-center mb-6 gap-4">
                <div className="flex-grow">
                    <label className="input input-bordered flex items-center gap-2 shadow-sm">
                        <LuSearch className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            className="grow bg-transparent focus:outline-none"
                            placeholder="Buscar proyectos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>
                </div>

                <div className="flex gap-4">
                    <select
                        name="facultad"
                        className="select select-bordered"
                        value={filters.facultad}
                        onChange={handleFilterChange}
                    >
                        <option value="">Todas las Facultades</option>
                        {facultades.map((facultad) => (
                            <option key={facultad.id} value={facultad.nombre}>
                                {facultad.nombre}
                            </option>
                        ))}
                    </select>

                    <select
                        name="programa"
                        className="select select-bordered"
                        value={filters.programa}
                        onChange={handleFilterChange}
                    >
                        <option value="">Todos los Programas</option>
                        {programas
                            .filter(programa => !filters.facultad || programa.facultad.nombre === filters.facultad)
                            .map((programa) => (
                                <option key={programa.id} value={programa.nombre}>
                                    {programa.nombre}
                                </option>
                            ))}
                    </select>

                    <select
                        name="estado"
                        className="select select-bordered"
                        value={filters.estado}
                        onChange={handleFilterChange}
                    >
                        <option value="">Todos los Estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
                {loading ? (
                    <div className="col-span-full text-center text-gray-500 py-8">
                        Cargando proyectos...
                    </div>
                ) : error ? (
                    <div className="col-span-full text-center text-red-500 py-8">
                        {error}
                    </div>
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-8">
                        No se encontraron proyectos
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
