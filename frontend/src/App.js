import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PomodoroPro from "./components/pomodoro/PomodoroPro";
import Tareas from "./components/tareas/ToDoList";
import Notas from "./components/notas/Notes";
import Cursos from "./components/cursos/Cursos";
import Planificador from "./components/planificador/Planificador";
import BibliotecaRecursos from "./components/recursos/BibliotecaRecursos";
import Home from "./components/Home";
import FloatingTimer from "./components/FloatingTimer";


const App = () => {
  return (
    <Router>
      <div className="relative">
        <FloatingTimer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pomodoro" element={<PomodoroPro />} />
          <Route path="/tareas" element={<Tareas />} />
          <Route path="/notas" element={<Notas />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/plan" element={<Planificador />} />
          <Route path="/recursos" element={<BibliotecaRecursos />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
