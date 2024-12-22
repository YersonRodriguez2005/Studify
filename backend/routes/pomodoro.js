const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Archivo de conexión a la base de datos

// Registrar una nueva sesión Pomodoro
router.post('/register', (req, res) => {
  const { id_usuario, mode, duration } = req.body;
  const date = new Date().toISOString().slice(0, 10); // Fecha actual YYYY-MM-DD

  if (!id_usuario || !mode || !duration) {
    return res
      .status(400)
      .json({ error: "Se requieren 'id_usuario', 'mode' y 'duration'" });
  }

  const query =
    "INSERT INTO sesiones_pomodoro (id_usuario, mode, duration, date) VALUES (?, ?, ?, ?)";
  db.query(query, [id_usuario, mode, duration, date], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al registrar la sesión", details: err });
    }
    res
      .status(201)
      .json({ message: "Sesión registrada exitosamente", id: result.insertId });
  });
});


// Obtener todas las sesiones registradas
router.get('/history', (req, res) => {
  const query = "SELECT * FROM sesiones_pomodoro ORDER BY date DESC";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener el historial", details: err });
    }
    res.status(200).json(results);
  });
});

// Eliminar una sesión por ID
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  // Validar que el ID es un número
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido. Debe ser un número." });
  }

  const query = "DELETE FROM sesiones_pomodoro WHERE id_sesion = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar la sesión", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No se encontró la sesión con el ID proporcionado" });
    }
    res.status(200).json({ message: "Sesión eliminada correctamente" });
  });
});


module.exports = router;