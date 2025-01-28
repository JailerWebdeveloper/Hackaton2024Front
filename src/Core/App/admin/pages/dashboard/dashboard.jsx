import React, { useState, useEffect } from 'react';
import { LuSearch, LuUsers, LuFolder, LuCheckCircle, LuClock } from "react-icons/lu";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import ProjectCard from "../../components/projectCard/projectCard";
import { GetallProject, getFacultades, getProgramas } from "../../../../utils/services/get";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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

    // Stats calculation
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.estado === 'Activo').length;
    const completedProjects = projects.filter(p => p.estado === 'Finalizado').length;
    const uniqueStudents = new Set(projects.map(p => p.liderProyecto.id)).size;

    // Chart data
    const chartData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Proyectos Activos',
                data: [12, 19, 15, 17, 20, activeProjects],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Tendencia de Proyectos',
            },
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsResponse, facultadesResponse, programasResponse] = await Promise.all([
                    GetallProject(),
                    getFacultades(),
                    getProgramas()
                ]);
                setProjects(projectsResponse);
                setFilteredProjects(projectsResponse);
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

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className={`bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 border-l-4 ${color}`}>
            <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('border', 'bg')}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="w-full overflow-auto h-screen flex flex-col p-4 md:p-8 bg-gray-50">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={LuFolder}
                    title="Total Proyectos"
                    value={totalProjects}
                    color="border-blue-500"
                />
                <StatCard
                    icon={LuClock}
                    title="Proyectos Activos"
                    value={activeProjects}
                    color="border-green-500"
                />
                <StatCard
                    icon={LuCheckCircle}
                    title="Proyectos Completados"
                    value={completedProjects}
                    color="border-purple-500"
                />
                <StatCard
                    icon={LuUsers}
                    title="Estudiantes Líderes"
                    value={uniqueStudents}
                    color="border-orange-500"
                />
            </div>

            {/* Chart Section */}
            <div className='grid  cols-2 p-4 gap-2'>
                <div className="bg-white max-w-lg flex items-center justify-center h-[10rem]  rounded-xl shadow-md mb-8">
                    <Line options={chartOptions} data={chartData} />
                </div>
            </div>

            {/* Filters Section */}
            <div className="w-full flex flex-wrap justify-between items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-md">
                <div className="flex-grow">
                    <label className="input input-bordered flex items-center gap-2 bg-gray-50">
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

                <div className="flex flex-wrap gap-4">
                    <select
                        name="facultad"
                        className="select select-bordered bg-gray-50"
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
                        className="select select-bordered bg-gray-50"
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
                        className="select select-bordered bg-gray-50"
                        value={filters.estado}
                        onChange={handleFilterChange}
                    >
                        <option value="">Todos los Estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {loading ? (
                    <div className="col-span-full flex justify-center items-center py-12">
                        <div className="loading loading-spinner loading-lg text-primary"></div>
                    </div>
                ) : error ? (
                    <div className="col-span-full text-center text-red-500 py-8 bg-white rounded-xl shadow-md">
                        <LuAlert className="w-12 h-12 mx-auto mb-2" />
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
                    <div className="col-span-full text-center text-gray-500 py-8 bg-white rounded-xl shadow-md">
                        <LuFolder className="w-12 h-12 mx-auto mb-2" />
                        No se encontraron proyectos
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;