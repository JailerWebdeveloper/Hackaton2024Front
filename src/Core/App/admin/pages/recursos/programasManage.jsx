import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    FiPlus,
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import { createPrograma } from "../../../../utils/services/post";
import { updatePrograma } from "../../../../utils/services/put";
import { getFacultades, getProgramas } from "../../../../utils/services/get";
import ProgramForm from "../../components/recursos/programForm";

const ITEMS_PER_PAGE = 10;

const Programs = () => {
    const [programs, setPrograms] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [programToDelete, setProgramToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterFaculty, setFilterFaculty] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async () => {
        try {
            const [infoPrograms, infoFaculties] = await Promise.all([
                getProgramas(),
                getFacultades(),
            ]);
            setPrograms(infoPrograms);
            setFaculties(infoFaculties);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error al obtener la información.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (data) => {
        const newdata = {
            nombre: data.nombre,
            facultadId: parseInt(data.facultadId),
        };
        try {
            if (editingProgram) {
                await updatePrograma(editingProgram.id, newdata);
                toast.success("Programa actualizado con éxito");
            } else {
               const response = await createPrograma(newdata);
                toast.success("Programa creado con éxito");
            }
            await fetchData();
            setIsModalOpen(false);
            setEditingProgram(null);
        } catch (error) {
            toast.error("Error al procesar la solicitud");
        }
    };

    // Edit program
    const handleEdit = (program) => {
        setEditingProgram(program);
        setIsModalOpen(true);
    };

    // Confirm delete program
    const confirmDelete = (program) => {
        setProgramToDelete(program);
    };

    // Handle delete program
    // const handleDelete = async () => {
    //     if (programToDelete) {
    //         try {
    //             await deleteProgram(programToDelete.id); // Eliminar programa
    //             await fetchData();
    //             toast.success("Programa eliminado con éxito");
    //             setProgramToDelete(null);
    //         } catch (error) {
    //             toast.error("Error al eliminar el programa");
    //         }
    //     }
    // };

    // Filtrar programas
    const filteredPrograms = programs.filter((program) => {
        const matchesSearch = program.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFaculty = filterFaculty
            ? program.facultad?.id === parseInt(filterFaculty)
            : true;
        return matchesSearch && matchesFaculty;
    });

    // Paginación
    const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPaginationRange = (currentPage, totalPages, maxVisiblePages = 5) => {
        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(currentPage - half, 1);
        let end = Math.min(currentPage + half, totalPages);

        if (end - start + 1 < maxVisiblePages) {
            if (start === 1) {
                end = Math.min(start + maxVisiblePages - 1, totalPages);
            } else if (end === totalPages) {
                start = Math.max(end - maxVisiblePages + 1, 1);
            }
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Gestión de Programas</h2>
                    <p className="mt-1 text-sm text-gray-600">Administra los programas académicos</p>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-200 space-y-4">
                    <div className="flex flex-wrap gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[300px]">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Faculty Filter */}
                        <div className="relative min-w-[200px]">
                            <select
                                className="w-full pl-4 pr-10 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                value={filterFaculty}
                                onChange={(e) => setFilterFaculty(e.target.value)}
                            >
                                <option value="">Todas las facultades</option>
                                {faculties.map((faculty) => (
                                    <option key={faculty.id} value={faculty.id}>
                                        {faculty.nombre}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Add Program Button */}
                        <button
                            onClick={() => {
                                setEditingProgram(null);
                                setIsModalOpen(true);
                            }}
                            className="btn btn-primary gap-2"
                        >
                            <FiPlus className="w-5 h-5" />
                            Nuevo Programa
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-auto h-[27rem]">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Facultad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((program) => (
                                <tr key={program.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium capitalize text-gray-900">
                                            {program.nombre}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                                        <div className="text-sm text-gray-500">
                                            {program.facultad?.nombre || "No asignada"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(program)}
                                            className="text-blue-600 hover:text-blue-900 "
                                        >
                                            <FiEdit2 className="h-5 w-5" />
                                        </button>
                                        {/* <button
                                            onClick={() => confirmDelete(program)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FiTrash2 className="h-5 w-5" />
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div>
                        <p className="text-sm text-gray-700">
                            Mostrando{" "}
                            <span className="font-medium">{indexOfFirstItem + 1}</span> -{" "}
                            <span className="font-medium">
                                {Math.min(indexOfLastItem, filteredPrograms.length)}
                            </span>{" "}
                            de <span className="font-medium">{filteredPrograms.length}</span>{" "}
                            resultados
                        </p>
                    </div>
                    <div>
                        <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                        >
                            <button
                                onClick={() => paginate(1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Primera</span>
                                <FiChevronLeft className="h-5 w-5" />
                            </button>

                            {getPaginationRange(currentPage, totalPages).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => paginate(page)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                            ? "z-10 bg-green-50 border-green-500 text-green-600"
                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => paginate(totalPages)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Última</span>
                                <FiChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación de Eliminación */}
            {programToDelete && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Confirmar Eliminación</h3>
                        <p>
                            ¿Estás seguro que deseas eliminar el programa "
                            {programToDelete.nombre}"?
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setProgramToDelete(null)}
                            >
                                Cancelar
                            </button>
                            {/* <button className="btn btn-error" onClick={handleDelete}>
                Eliminar
              </button> */}
                        </div>
                    </div>
                    <div
                        className="modal-backdrop"
                        onClick={() => setProgramToDelete(null)}
                    ></div>
                </div>
            )}

            {/* Modal para Crear/Editar Programa */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">
                            {editingProgram ? "Editar" : "Nuevo"} Programa
                        </h3>
                        <ProgramForm
                            onSubmit={handleSubmit}
                            initialData={editingProgram}
                            Faculties={faculties}
                        />
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingProgram(null);
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programs;
