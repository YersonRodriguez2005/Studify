import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Calendar as CalendarIcon,
  AlertCircle,
  Book,
  ClipboardList,
  GraduationCap,
  X,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/planificador";

const EventTypeIcons = {
  clase: <Book className="w-4 h-4" />,
  examen: <GraduationCap className="w-4 h-4" />,
  tarea: <ClipboardList className="w-4 h-4" />
};

const EventTypeColors = {
  clase: "bg-blue-500",
  examen: "bg-red-500",
  tarea: "bg-green-500"
};

const Planificador = () => {
  const [eventos, setEventos] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filterType, setFilterType] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const initialFormState = {
    titulo: "",
    descripcion: "",
    tipo: "clase",
    fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_fin: new Date().toISOString().split("T")[0],
    recordatorio: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/list/1`);
      if (!response.ok) throw new Error("Error al obtener los eventos");
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      setError("No se pudieron cargar los eventos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.tipo || !formData.fecha_inicio || !formData.fecha_fin) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/update/${editingId}` : `${API_URL}/create`;
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: 1,
          ...formData
        }),
      });

      if (!response.ok) throw new Error(`Error al ${editingId ? 'actualizar' : 'crear'} el evento`);
      
      await fetchEventos();
      setFormData(initialFormState);
      setEditingId(null);
      setIsFormVisible(false);
    } catch (error) {
      setError(`No se pudo ${editingId ? 'actualizar' : 'crear'} el evento.`);
    }
  };

  const startEdit = (evento) => {
    setFormData({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      tipo: evento.tipo,
      fecha_inicio: evento.fecha_inicio.split('T')[0],
      fecha_fin: evento.fecha_fin.split('T')[0],
      recordatorio: evento.recordatorio
    });
    setEditingId(evento.id_evento);
    setIsFormVisible(true);
  };

  const deleteEvento = async (id_evento) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
    
    try {
      await fetch(`${API_URL}/delete/${id_evento}`, { method: "DELETE" });
      await fetchEventos();
    } catch (error) {
      setError("No se pudo eliminar el evento.");
    }
  };

  const filteredAndSortedEventos = eventos
    .filter(evento => 
      (filterType === "todos" || evento.tipo === filterType) &&
      (evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
       evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.fecha_inicio);
      const dateB = new Date(b.fecha_inicio);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <CalendarIcon className="text-blue-400 w-8 h-8" />
            Planificador Académico
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2 text-red-300">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
          >
            {isFormVisible ? <X /> : <Plus />}
            {isFormVisible ? 'Cerrar Formulario' : 'Nuevo Evento'}
          </button>

          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700"
            >
              <option value="todos">Todos</option>
              <option value="clase">Clases</option>
              <option value="examen">Exámenes</option>
              <option value="tarea">Tareas</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 rounded-lg"
            >
              <Clock className="w-4 h-4" />
              {sortOrder === "asc" ? "Más recientes" : "Más antiguos"}
            </button>

            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700"
            />
          </div>
        </div>

        {isFormVisible && (
          <div className="mb-8 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">{editingId ? 'Editar Evento' : 'Nuevo Evento'}</h2>
              <p className="text-gray-400">Completa todos los campos requeridos</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formData.titulo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700"
                required
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700"
                >
                  <option value="clase">Clase</option>
                  <option value="examen">Examen</option>
                  <option value="tarea">Tarea</option>
                </select>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700"
                />
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="recordatorio"
                  checked={formData.recordatorio}
                  onChange={handleInputChange}
                  className="rounded border-gray-700"
                />
                <label>Activar recordatorio</label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Guardar Cambios' : 'Crear Evento'}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-center col-span-full">Cargando eventos...</p>
          ) : filteredAndSortedEventos.length === 0 ? (
            <p className="text-center col-span-full">No hay eventos para mostrar</p>
          ) : (
            filteredAndSortedEventos.map((evento) => (
              <div 
                key={evento.id_evento} 
                className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {EventTypeIcons[evento.tipo]}
                      <span className={`px-2 py-1 rounded-full text-xs ${EventTypeColors[evento.tipo]}`}>
                        {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(evento)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvento(evento.id_evento)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{evento.titulo}</h3>
                  <p className="text-gray-400 mb-3">{evento.descripcion}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {new Date(evento.fecha_inicio).toLocaleDateString()} -{" "}
                      {new Date(evento.fecha_fin).toLocaleDateString()}
                    </span>
                  </div>
                  {evento.recordatorio && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs border border-gray-600 rounded-full">
                      Recordatorio activado
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Planificador;