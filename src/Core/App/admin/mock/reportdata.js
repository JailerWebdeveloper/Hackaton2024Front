export const projectsData = {
    statusDistribution: {
      labels: ['En Progreso', 'Completados', 'Retrasados', 'Planificación'],
      datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'],
      }]
    },
  
    facultyProgress: {
      labels: ['Ingeniería', 'Ciencias', 'Humanidades', 'Medicina', 'Economía'],
      datasets: [{
        label: 'Proyectos Activos',
        data: [25, 18, 15, 12, 10],
        backgroundColor: '#3b82f6',
      }]
    },
  
    timelineCompletion: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'A Tiempo',
          data: [12, 15, 18, 14, 16, 19],
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          fill: true,
        },
        {
          label: 'Retrasados',
          data: [3, 5, 4, 6, 3, 2],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          fill: true,
        }
      ]
    },
  
    recentProjects: [
      {
        id: 1,
        title: "Sistema de Gestión Académica",
        faculty: "Ingeniería",
        status: "En Progreso",
        completion: 75,
        dueDate: "2024-03-15"
      },
      {
        id: 2,
        title: "Estudio de Biodiversidad Local",
        faculty: "Ciencias",
        status: "Retrasado",
        completion: 45,
        dueDate: "2024-02-28"
      },
      {
        id: 3,
        title: "Análisis de Impacto Social",
        faculty: "Humanidades",
        status: "Completado",
        completion: 100,
        dueDate: "2024-01-30"
      },
      {
        id: 4,
        title: "Investigación en Telemedicina",
        faculty: "Medicina",
        status: "En Progreso",
        completion: 60,
        dueDate: "2024-04-10"
      },
      {
        id: 5,
        title: "Modelos Económicos Sostenibles",
        faculty: "Economía",
        status: "Planificación",
        completion: 15,
        dueDate: "2024-05-01"
      }
    ]
  };