import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  FileText,
  ArrowLeft,
  Upload,
  Edit,
  Save,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/cursos";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [nombreCurso, setNombreCurso] = useState("");
  const [progreso, setProgreso] = useState("En progreso");
  const [fechaInscripcion, setFechaInscripcion] = useState("");
  const [certificado, setCertificado] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Existing fetch, create, upload, delete, and edit functions remain the same
  const fetchCursos = async () => {
    try {
      const response = await fetch(`${API_URL}/list/1`);
      if (!response.ok) throw new Error("Error al obtener los cursos");
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los cursos.");
    }
  };

  const createCurso = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: 1,
          nombre_curso: nombreCurso,
          progreso,
          fecha_inscripcion: fechaInscripcion,
        }),
      });
      if (!response.ok) throw new Error("Error al crear el curso");
      await fetchCursos();
      setNombreCurso("");
      setProgreso("En progreso");
      setFechaInscripcion("");
    } catch (error) {
      console.error(error);
      setError("No se pudo crear el curso.");
    }
  };

  const uploadCertificado = async (id_curso) => {
    if (!certificado) {
      setError("Debe seleccionar un archivo PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("certificado", certificado);

    try {
      const response = await fetch(`${API_URL}/upload/${id_curso}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error al subir el certificado");
      await fetchCursos();
      setCertificado(null);
    } catch (error) {
      console.error(error);
      setError("No se pudo subir el certificado.");
    }
  };

  const deleteCurso = async (id_curso) => {
    try {
      await fetch(`${API_URL}/delete/${id_curso}`, {
        method: "DELETE",
      });
      await fetchCursos();
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar el curso.");
    }
  };

  const editCurso = async (id_curso) => {
    try {
      const response = await fetch(`${API_URL}/update/${id_curso}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_curso: nombreCurso,
          progreso,
          fecha_inscripcion: fechaInscripcion,
        }),
      });
      if (!response.ok) throw new Error("Error al actualizar el curso");
      await fetchCursos();
      setIsEditing(null);
    } catch (error) {
      console.error(error);
      setError("No se pudo actualizar el curso.");
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  // Progress badge component
  const ProgressBadge = ({ status }) => {
    const colors = {
      "En progreso": "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
      "Completado": "bg-green-500/20 text-green-400 border-green-500/20",
      "Pendiente": "bg-red-500/20 text-red-400 border-red-500/20",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 rounded-lg transition duration-300 w-fit"
          >
            <ArrowLeft size={20} />
            Regresar
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <FileText className="text-blue-400" />
            Gestor de Cursos
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <AlertCircle className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Creation Form */}
        {!isEditing && (
          <form onSubmit={createCurso} className="mb-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del curso"
                value={nombreCurso}
                onChange={(e) => setNombreCurso(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                required
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={progreso}
                  onChange={(e) => setProgreso(e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                >
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
                <input
                  type="date"
                  value={fechaInscripcion}
                  onChange={(e) => setFechaInscripcion(e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition duration-200 font-medium"
              >
                <Plus className="w-5 h-5" />
                Crear Curso
              </button>
            </div>
          </form>
        )}

        {/* Course List */}
        <div className="grid gap-6">
          {cursos.length > 0 ? (
            cursos.map((curso) => (
              <div
                key={curso.id_curso}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl transition duration-200 hover:border-gray-600/50"
              >
                {isEditing === curso.id_curso ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={nombreCurso}
                      onChange={(e) => setNombreCurso(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700/50"
                    />
                    <select
                      value={progreso}
                      onChange={(e) => setProgreso(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700/50"
                    >
                      <option value="En progreso">En progreso</option>
                      <option value="Completado">Completado</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                    <input
                      type="date"
                      value={fechaInscripcion}
                      onChange={(e) => setFechaInscripcion(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-gray-700/50"
                    />
                    <button
                      onClick={() => editCurso(curso.id_curso)}
                      className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white flex items-center justify-center gap-2 transition duration-200 font-medium"
                    >
                      <Save className="w-5 h-5" />
                      Guardar Cambios
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h2 className="text-xl font-bold">{curso.nombre_curso}</h2>
                      <ProgressBadge status={curso.progreso} />
                    </div>
                    
                    <p className="text-gray-400">
                      Fecha de inscripción: {curso.fecha_inscripcion}
                    </p>
                    
                    {curso.certificado && (
                      <a
                        href={`http://localhost:5000${curso.certificado}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-400 hover:text-blue-300 transition duration-200"
                      >
                        Ver Certificado
                      </a>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex-1 sm:flex-none">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setCertificado(e.target.files[0])}
                          className="hidden"
                        />
                        <span className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg cursor-pointer transition duration-200 w-full sm:w-auto">
                          <Upload className="w-5 h-5" />
                          Subir Certificado
                        </span>
                      </label>
                      <button
                        onClick={() => uploadCertificado(curso.id_curso)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition duration-200"
                      >
                        Guardar Certificado
                      </button>
                      <button
                        onClick={() => {
                          setNombreCurso(curso.nombre_curso);
                          setProgreso(curso.progreso);
                          setFechaInscripcion(curso.fecha_inscripcion);
                          setIsEditing(curso.id_curso);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white flex items-center justify-center gap-2 transition duration-200"
                      >
                        <Edit className="w-5 h-5" />
                        Editar
                      </button>
                      <button
                        onClick={() => deleteCurso(curso.id_curso)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white flex items-center justify-center gap-2 transition duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
              No hay cursos registrados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cursos;