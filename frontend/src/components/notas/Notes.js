import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  PlusCircle,
  Pencil,
  Save,
  Trash2,
  Notebook,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_URL = "http://localhost:5000/api/notas";

// Configuración de módulos para ReactQuill
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link'],
    ['clean']
  ]
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Estilos personalizados para ReactQuill en modo oscuro
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ql-snow .ql-picker {
        color: #fff;
      }
      .ql-snow .ql-stroke {
        stroke: #fff;
      }
      .ql-snow .ql-fill {
        fill: #fff;
      }
      .ql-toolbar.ql-snow {
        border-color: #374151 !important;
        background: rgba(31, 41, 55, 0.5);
        border-radius: 0.5rem 0.5rem 0 0;
      }
      .ql-container.ql-snow {
        border-color: #374151 !important;
        background: rgba(17, 24, 39, 0.5);
        border-radius: 0 0 0.5rem 0.5rem;
        min-height: 200px;
      }
      .ql-editor {
        color: #fff;
        min-height: 200px;
      }
      .ql-editor.ql-blank::before {
        color: #9ca3af;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuillChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const resetForm = () => {
    setFormData({ title: "", content: "" });
    setEditingId(null);
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/list/1`);
      if (!response.ok) throw new Error("Error al obtener las notas");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      setError("No se pudieron cargar las notas.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: 1,
          titulo: formData.title,
          contenido: formData.content,
        }),
      });
      if (!response.ok) throw new Error("Error al crear la nota");
      await fetchNotes();
      resetForm();
    } catch (error) {
      setError("No se pudo crear la nota.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editNote = async (noteId) => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/update/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: formData.title,
          contenido: formData.content
        }),
      });
      if (!response.ok) throw new Error("Error al actualizar la nota");
      await fetchNotes();
      resetForm();
    } catch (error) {
      setError("No se pudo actualizar la nota.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta nota?")) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/delete/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar la nota");
      await fetchNotes();
    } catch (error) {
      setError("No se pudo eliminar la nota.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300 mb-4"
        >
          <ArrowLeft size={20} />
          Regresar
        </button>

          <div className="text-center mt-6 space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
              <Notebook className="w-8 h-8 text-blue-400" />
              Notas y Cuadernos Digitales
            </h1>
            <p className="text-gray-400">Organiza tus pensamientos e ideas</p>
          </div>
        </header>

        {error && (
          <div className="mb-6 text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <div className="grid gap-8">
          {/* Form Section */}
          <section className="bg-gray-800/30 rounded-xl p-6 shadow-lg border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Editar Nota' : 'Nueva Nota'}
            </h2>
            <form onSubmit={createNote} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Título de la nota"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
                disabled={isSubmitting}
              />
              
              <div className="quill-wrapper">
                <ReactQuill
                  value={formData.content}
                  onChange={handleQuillChange}
                  modules={quillModules}
                  placeholder="Escribe tu nota aquí..."
                  theme="snow"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-3 pt-4">
                {editingId ? (
                  <>
                    <button
                      type="button"
                      onClick={() => editNote(editingId)}
                      disabled={isSubmitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <PlusCircle className="w-5 h-5" />
                    )}
                    Crear Nota
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Notes Grid */}
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <article
                  key={note.id_nota}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 flex flex-col gap-4 group hover:border-gray-600/50 transition-all duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-100">{note.titulo}</h3>
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: note.contenido }}
                  />
                  <div className="flex gap-2 mt-auto pt-4">
                    <button
                      onClick={() => {
                        setFormData({
                          title: note.titulo,
                          content: note.contenido
                        });
                        setEditingId(note.id_nota);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                      disabled={isSubmitting}
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id_nota)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Eliminar</span>
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <p className="text-gray-400">No hay notas disponibles.</p>
                <p className="text-gray-500 text-sm mt-1">¡Crea una nueva nota para empezar!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Notes;