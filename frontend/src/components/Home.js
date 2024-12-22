import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  CheckSquare,
  NotebookPen,
  GraduationCap,
  Calendar,
  BookOpen,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Logo from "./img/logo.jpg";

const Home = () => {
  const toolsSectionRef = useRef(null);

  const scrollToTools = () => {
    toolsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const tools = [
    {
      name: "Pomodoro Pro",
      description: "Temporizador para mejorar tu enfoque y productividad.",
      path: "/pomodoro",
      icon: Clock,
    },
    {
      name: "Tareas",
      description: "Gestión de tareas con prioridades y recordatorios.",
      path: "/tareas",
      icon: CheckSquare,
    },
    {
      name: "Notas",
      description: "Notas digitales con soporte multimedia.",
      path: "/notas",
      icon: NotebookPen,
    },
    {
      name: "Cursos",
      description: "Progreso y gestión de cursos y certificaciones.",
      path: "/cursos",
      icon: GraduationCap,
    },
    {
      name: "Planificador",
      description: "Calendario interactivo para organizar tus actividades.",
      path: "/plan",
      icon: Calendar,
    },
    {
      name: "Biblioteca",
      description: "Organiza y accede a tus recursos académicos.",
      path: "/recursos",
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-gray-100">
      {/* Header con logo y hero section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent" />
        <div className="container mx-auto px-4 pt-8 pb-20 md:pt-16 md:pb-32">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
              <img
                src={Logo}
                alt="Studify Logo"
                className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl shadow-xl"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Studify
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Organiza, aprende y alcanza tus metas académicas con herramientas
              diseñadas para tu éxito.
            </p>
            <button
              onClick={scrollToTools}
              className="mt-10 inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-blue-400 bg-transparent border border-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            >
              Explorar herramientas
              <ChevronDown className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </header>

      {/* Herramientas */}
      <main className="relative">
        <div
          ref={toolsSectionRef}
          className="container mx-auto px-4 py-16 md:py-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
            Herramientas para potenciar tu aprendizaje
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {tools.map((tool, index) => {
              const ToolIcon = tool.icon;
              return (
                <Link
                  to={tool.path}
                  key={index}
                  className="group relative bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 
                    border border-gray-700/50 shadow-lg
                    hover:bg-gray-800/60 hover:border-blue-500/50
                    transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <ToolIcon className="text-blue-400 group-hover:text-blue-300 transition-colors" size={28} />
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {tool.name}
                    </h3>
                  </div>

                  <p className="text-gray-400 group-hover:text-gray-300 mb-8 min-h-[50px] transition-colors">
                    {tool.description}
                  </p>

                  <div className="absolute bottom-6 right-6 flex items-center text-blue-400 
                    group-hover:text-blue-300 transition-colors">
                    <span className="mr-2 text-sm font-medium">Explorar</span>
                    <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
