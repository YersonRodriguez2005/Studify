import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Flag,
  AlertTriangle,
  ArrowLeft,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Navegación

const API_URL = "http://localhost:5000/api/tareas";

const ToDoList = () => {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  // API functions remain the same
  const fetchTareas = async () => {
    try {
      const response = await fetch(`${API_URL}/list/1`);
      if (!response.ok) throw new Error("Error al obtener las tareas");
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las tareas.");
    }
  };

  const createTarea = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: 1,
          titulo,
          descripcion,
          prioridad,
          fecha_vencimiento: fechaVencimiento,
        }),
      });
      if (!response.ok) throw new Error("Error al crear la tarea");
      await fetchTareas();
      setTitulo("");
      setDescripcion("");
      setPrioridad("media");
      setFechaVencimiento("");
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      setError("No se pudo crear la tarea.");
    }
  };

  const toggleEstado = async (id_tarea, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === "pendiente" ? "completada" : "pendiente";
      await fetch(`${API_URL}/update/${id_tarea}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      await fetchTareas();
    } catch (error) {
      console.error(error);
      setError("No se pudo actualizar la tarea.");
    }
  };

  const deleteTarea = async (id_tarea) => {
    try {
      await fetch(`${API_URL}/delete/${id_tarea}`, {
        method: "DELETE",
      });
      await fetchTareas();
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar la tarea.");
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta":
        return "text-red-500";
      case "media":
        return "text-yellow-500";
      case "baja":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "alta":
        return <AlertTriangle className="w-4 h-4" />;
      case "media":
        return <Flag className="w-4 h-4" />;
      case "baja":
        return <Info className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Botón regresar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300 mb-4"
        >
          <ArrowLeft size={20} />
          Regresar
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          To-Do List Inteligente
        </h1>

        {error && (
          <div className="mb-6 text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-500/20 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            {isFormOpen ? "Cerrar Formulario" : "Nueva Tarea"}
          </button>
        </div>

        {isFormOpen && (
          <form onSubmit={createTarea} className="mb-8 bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título de la tarea"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />

              <textarea
                placeholder="Descripción de la tarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[100px]"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <select
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    required
                  >
                    <option value="alta">Alta Prioridad</option>
                    <option value="media">Media Prioridad</option>
                    <option value="baja">Baja Prioridad</option>
                  </select>
                </div>

                <div className="flex-1">
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Crear Tarea
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {tareas.length > 0 ? (
            tareas.map((tarea) => (
              <div
                key={tarea.id_tarea}
                className={`bg-gray-800/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/50 transition-all duration-200 ${tarea.estado === "completada" ? "opacity-75" : ""
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h2 className={`text-xl font-bold ${tarea.estado === "completada" ? "line-through text-gray-400" : ""
                      }`}>
                      {tarea.titulo}
                    </h2>

                    {tarea.descripcion && (
                      <p className="text-gray-400">{tarea.descripcion}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className={`flex items-center gap-1 ${getPriorityColor(tarea.prioridad)}`}>
                        {getPriorityIcon(tarea.prioridad)}
                        Prioridad {tarea.prioridad}
                      </span>

                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {tarea.fecha_vencimiento}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      onClick={() => toggleEstado(tarea.id_tarea, tarea.estado)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${tarea.estado === "pendiente"
                          ? "bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30"
                          : "bg-green-600/20 text-green-500 hover:bg-green-600/30"
                        }`}
                    >
                      {tarea.estado === "pendiente" ? (
                        <>
                          <Circle className="w-4 h-4" />
                          Pendiente
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Completada
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => deleteTarea(tarea.id_tarea)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12" />
              </div>
              <p className="text-lg">No hay tareas pendientes.</p>
              <p className="text-sm">¡Comienza agregando una nueva tarea!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;