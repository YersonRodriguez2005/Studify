import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Download,
    Search,
    Filter,
    Folder,
    AlertCircle,
    CheckCircle,
    Upload,
    ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/recursos";

const BibliotecaRecursos = () => {
    const navigate = useNavigate();
    const [recursos, setRecursos] = useState([]);
    const [archivo, setArchivo] = useState(null);
    const [etiqueta, setEtiqueta] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEtiqueta, setFilterEtiqueta] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRecursos();
    }, []);

    useEffect(() => {
        let timer;
        if (error || success) {
            timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 5000);
        }
        return () => timer && clearTimeout(timer);
    }, [error, success]);

    const fetchRecursos = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/list/1`);
            if (!response.ok) throw new Error("Error al obtener los recursos");
            const data = await response.json();
            setRecursos(data);
        } catch (error) {
            console.error("Error fetching recursos:", error);
            setError("No se pudieron cargar los recursos.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!archivo || !etiqueta.trim()) {
            setError("Debes seleccionar un archivo y proporcionar una etiqueta.");
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("archivo", archivo);
            formData.append("id_usuario", 1);
            formData.append("etiqueta", etiqueta.trim());

            const response = await fetch(`${API_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Error al subir el recurso");
            
            setSuccess("Recurso subido exitosamente");
            setEtiqueta("");
            setArchivo(null);
            e.target.reset();
            await fetchRecursos();
        } catch (error) {
            console.error("Error uploading:", error);
            setError("No se pudo subir el recurso.");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteRecurso = async (id_recurso) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este recurso?")) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/delete/${id_recurso}`, {
                method: "DELETE",
            });
            
            if (!response.ok) throw new Error("Error al eliminar el recurso");
            
            setSuccess("Recurso eliminado exitosamente");
            await fetchRecursos();
        } catch (error) {
            console.error("Error deleting:", error);
            setError("No se pudo eliminar el recurso.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (ruta_archivo) => {
        const url = `${API_URL}${ruta_archivo}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const filteredRecursos = recursos.filter((recurso) => {
        const matchesSearch = recurso.nombre_archivo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEtiqueta = !filterEtiqueta || recurso.etiqueta === filterEtiqueta;
        return matchesSearch && matchesEtiqueta;
    });

    const uniqueEtiquetas = Array.from(new Set(recursos.map(recurso => recurso.etiqueta)))
        .filter(Boolean)
        .sort();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
                <header className="space-y-4">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Regresar
                        </button>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
                            <Folder className="text-blue-500" />
                            Biblioteca de Recursos
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Gestiona tus documentos y recursos de manera eficiente
                        </p>
                    </div>
                </header>

                {(error || success) && (
                    <div className={`${error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'} 
                                border p-4 rounded-lg flex items-center gap-2`}>
                        {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        <span>{error || success}</span>
                    </div>
                )}

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Upload className="w-5 h-5" />
                        <h2 className="text-xl font-bold">Subir Nuevo Recurso</h2>
                    </div>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <input
                                type="file"
                                accept=".pdf,.docx,.pptx"
                                onChange={(e) => setArchivo(e.target.files?.[0])}
                                className="bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2 w-full
                                        file:bg-blue-600 file:text-white file:border-0 file:rounded-lg 
                                        file:px-4 file:py-2 file:mr-4 file:hover:bg-blue-500 cursor-pointer"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Etiqueta del recurso"
                                value={etiqueta}
                                onChange={(e) => setEtiqueta(e.target.value)}
                                className="bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2"
                                required
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 
                                         text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50
                                         disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                <Plus className="w-5 h-5" />
                                {isLoading ? "Subiendo..." : "Subir Recurso"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={filterEtiqueta}
                            onChange={(e) => setFilterEtiqueta(e.target.value)}
                            className="w-full pl-10 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white"
                        >
                            <option value="">Todas las etiquetas</option>
                            {uniqueEtiquetas.map((etiqueta) => (
                                <option key={etiqueta} value={etiqueta}>
                                    {etiqueta}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-400">Cargando recursos...</p>
                        </div>
                    ) : filteredRecursos.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-400">No se encontraron recursos</p>
                        </div>
                    ) : (
                        filteredRecursos.map((recurso) => (
                            <div
                                key={recurso.id_recurso}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 
                                         transition-all space-y-4"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-lg font-semibold break-all">
                                        {recurso.nombre_archivo}
                                    </h3>
                                    <span className="bg-blue-500/20 text-blue-400 text-sm px-2 py-1 rounded whitespace-nowrap">
                                        {recurso.etiqueta}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleDownload(recurso.ruta_archivo)}
                                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 
                                                 text-white px-4 py-2 rounded-lg transition-colors flex-1"
                                    >
                                        <Download className="w-5 h-5" />
                                        Descargar
                                    </button>
                                    <button
                                        onClick={() => deleteRecurso(recurso.id_recurso)}
                                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 
                                                 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BibliotecaRecursos;