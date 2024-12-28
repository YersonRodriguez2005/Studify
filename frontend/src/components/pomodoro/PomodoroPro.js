import React, { useMemo, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Play,
  Pause,
  RefreshCw,
  Clock,
  Coffee,
  Moon,
  BarChart2,
  Trash2,
  ArrowLeft,
  Target,
  History
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../../context/TimerContext";

const API_URL = "http://localhost:5000/api"; // Ajusta esto a tu URL de backend

const PomodoroPro = () => {
  const navigate = useNavigate();
  const {
    time,
    isRunning,
    toggleTimer,
    mode,
    setTimerMode,
    history,
    deleteSession,
    setHistory, // Asegúrate de tener esto en tu contexto
  } = useTimer();

  // Verificar autenticación y obtener datos del usuario
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return token;
  }, [navigate]);

  // Obtener el historial de sesiones del usuario
  const fetchSessions = useCallback(async () => {
    const token = checkAuth();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.sessions);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al obtener las sesiones:", error);
    }
  }, [navigate, setHistory, checkAuth]);

  // Eliminar una sesión
  const handleDeleteSession = async (sessionId) => {
    const token = checkAuth();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        deleteSession(sessionId);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al eliminar la sesión:", error);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const token = checkAuth();
    if (token) {
      fetchSessions();
    }
  }, [checkAuth, fetchSessions]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getModeColor = useMemo(() => {
    switch (mode) {
      case "work":
        return "bg-blue-600";
      case "shortBreak":
        return "bg-green-600";
      case "longBreak":
        return "bg-yellow-600";
      default:
        return "bg-purple-600";
    }
  }, [mode]);

  const getModeGradient = useMemo(() => {
    switch (mode) {
      case "work":
        return "from-blue-600/20 to-blue-600/5";
      case "shortBreak":
        return "from-green-600/20 to-green-600/5";
      case "longBreak":
        return "from-yellow-600/20 to-yellow-600/5";
      default:
        return "from-purple-600/20 to-purple-600/5";
    }
  }, [mode]);

  const chartData = Array.isArray(history)
    ? history.map((session, index) => ({
      name: `Sesión ${index + 1}`,
      duration: session.duration,
      mode: session.mode === "work" ? "Trabajo" : "Descanso",
    }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6">
      {/* El resto del JSX permanece igual */}
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-300 border border-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar
          </button>
          <h1 className="text-2xl sm:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Pomodoro Pro
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Timer Controls */}
          <div className="space-y-8">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { mode: "work", label: "Trabajo", Icon: Target, color: "bg-blue-500" },
                { mode: "shortBreak", label: "Descanso Corto", Icon: Coffee, color: "bg-green-500" },
                { mode: "longBreak", label: "Descanso Largo", Icon: Moon, color: "bg-yellow-500" },
              ].map(({ mode: m, label, Icon, color }) => (
                <button
                  key={m}
                  onClick={() => setTimerMode(m)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    mode === m 
                      ? `${color} shadow-lg shadow-${color}/20` 
                      : "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  } transition-all duration-300 transform hover:scale-105`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="text-center">
              <div className={`bg-gradient-to-b ${getModeGradient} backdrop-blur-sm rounded-2xl p-8 mb-6 border border-gray-700/50`}>
                <div className={`text-5xl sm:text-7xl font-mono ${getModeColor} bg-clip-text text-transparent`}>
                  {formatTime(time)}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-600/20"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5" /> Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" /> Iniciar
                    </>
                  )}
                </button>
                <button
                  onClick={() => setTimerMode(mode)}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/20"
                >
                  <RefreshCw className="w-5 h-5" /> Reiniciar
                </button>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-400" />
              Historial de Sesiones
            </h3>
            <div className="overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              {Array.isArray(history) && history.length > 0 ? (
                <ul className="space-y-2">
                  {history.map((session) => (
                    <li
                      key={session.id_sesion}
                      className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        {session.mode === "work" ? (
                          <Target className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Coffee className="w-4 h-4 text-green-400" />
                        )}
                        <span className="text-sm">
                          {`${session.mode === "work" ? "Trabajo" : "Descanso"} - ${session.duration} min`}
                          <span className="text-gray-400 ml-2">{session.date}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSession(session.id_sesion)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay sesiones completadas aún.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {Array.isArray(history) && history.length > 0 && (
          <section className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              Métricas de Productividad
            </h3>
            <div className="overflow-x-auto">
              <BarChart
                width={800}
                height={300}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                className="min-w-[500px]"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Legend />
                <Bar 
                  dataKey="duration" 
                  fill="#8B5CF6" 
                  name="Duración (min)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PomodoroPro;