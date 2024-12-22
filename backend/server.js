const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./models/db");
const pomodoroRoutes = require("./routes/pomodoro");
const tareasRoutes = require("./routes/tareas");
const notasRoutes = require("./routes/notas");
const cursosRoutes = require("./routes/cursos");
const planificadorRoutes = require("./routes/planificador");
const recursosRoutes = require("./routes/recursos");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración para servir archivos estáticos
app.use("/uploads/recursos", express.static(path.join(__dirname, "uploads/recursos")));
app.use('/uploads/certificates', express.static(path.join(__dirname, 'uploads/certificates')));

// Rutas
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/notas", notasRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/planificador", planificadorRoutes);
app.use("/api/recursos", recursosRoutes);

// Ruta inicial
app.get("/", (req, res) => {
  res.send("Bienvenido al backend de Studify");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
