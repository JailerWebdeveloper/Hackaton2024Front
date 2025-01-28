import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { projectsData } from '../../mock/reportdata';
import { 
  HiOutlineDocumentReport,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineChartPie
} from 'react-icons/hi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const getStatusColor = (status) => {
    const colors = {
      'En Progreso': 'badge-primary',
      'Retrasado': 'badge-error',
      'Completado': 'badge-success',
      'Planificación': 'badge-warning'
    };
    return colors[status] || 'badge-info';
  };

  return (
    <div className="container h-[39rem] overflow-auto mx-auto p-6">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <HiOutlineDocumentReport className="text-primary" />
          Dashboard de Reportes
        </h1>
        <p className="text-gray-600 mt-2">
          Análisis y métricas de los proyectos de investigación
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          {...fadeInUp}
          className="col-span-1 card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <HiOutlineChartPie className="text-primary" />
              Estado de Proyectos
            </h2>
            <div className="p-4">
              <Doughnut 
                data={projectsData.statusDistribution}
                options={commonOptions}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          {...fadeInUp}
          className="col-span-1 card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <HiOutlineAcademicCap className="text-primary" />
              Proyectos por Facultad
            </h2>
            <div className="p-4">
              <Bar 
                data={projectsData.facultyProgress}
                options={{
                  ...commonOptions,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          {...fadeInUp}
          className="col-span-1 card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <HiOutlineClock className="text-primary" />
              Cumplimiento de Plazos
            </h2>
            <div className="p-4">
              <Line 
                data={projectsData.timelineCompletion}
                options={{
                  ...commonOptions,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        {...fadeInUp} 
        className="mt-8 card bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="card-title mb-4">Proyectos Recientes</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Facultad</th>
                  <th>Estado</th>
                  <th>Progreso</th>
                  <th>Fecha Límite</th>
                </tr>
              </thead>
              <tbody>
                {projectsData.recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="font-medium">{project.title}</td>
                    <td>{project.faculty}</td>
                    <td>
                      <span className={`badge ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <progress 
                          className="progress progress-primary w-20" 
                          value={project.completion} 
                          max="100"
                        ></progress>
                        <span className="text-sm">{project.completion}%</span>
                      </div>
                    </td>
                    <td>{new Date(project.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;