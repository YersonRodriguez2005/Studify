import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PomodoroPro from "./components/pomodoro/PomodoroPro";
import Tareas from "./components/tareas/ToDoList";
import Notas from "./components/notas/Notes";
import Cursos from "./components/cursos/Cursos";
import Planificador from "./components/planificador/Planificador";
import BibliotecaRecursos from "./components/recursos/BibliotecaRecursos";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Registro";
import FloatingTimer from "./components/FloatingTimer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <div className="relative">
      <FloatingTimer /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Rutas protegidas */}
          <Route
            path="/pomodoro"
            element={
              <ProtectedRoute>
                <PomodoroPro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tareas"
            element={
              <ProtectedRoute>
                <Tareas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notas"
            element={
              <ProtectedRoute>
                <Notas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cursos"
            element={
              <ProtectedRoute>
                <Cursos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <Planificador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recursos"
            element={
              <ProtectedRoute>
                <BibliotecaRecursos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
