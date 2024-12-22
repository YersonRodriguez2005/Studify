const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Archivo de conexión a la base de datos

// Obtener todas las notas de un usuario
router.get('/list/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;

  const query = "SELECT * FROM notas WHERE id_usuario = ? ORDER BY fecha_creacion DESC";
  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener las notas", details: err });
    }
    res.status(200).json(results);
  });
});

// Crear una nueva nota
router.post('/create', (req, res) => {
  const { id_usuario, titulo, contenido } = req.body;
  const fecha_creacion = new Date();

  if (!id_usuario || !titulo || !contenido) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const query = "INSERT INTO notas (id_usuario, titulo, contenido, fecha_creacion) VALUES (?, ?, ?, ?)";
  db.query(query, [id_usuario, titulo, contenido, fecha_creacion], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al crear la nota", details: err });
    }
    res.status(201).json({ message: "Nota creada exitosamente", id: result.insertId });
  });
});

// Actualizar una nota
router.put('/update/:id_nota', (req, res) => {
  const { id_nota } = req.params;
  const { titulo, contenido } = req.body;

  if (!titulo || !contenido) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const query = "UPDATE notas SET titulo = ?, contenido = ? WHERE id_nota = ?";
  db.query(query, [titulo, contenido, id_nota], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al actualizar la nota", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Nota no encontrada" });
    }
    res.status(200).json({ message: "Nota actualizada correctamente" });
  });
});

// Eliminar una nota
router.delete('/delete/:id_nota', (req, res) => {
  const { id_nota } = req.params;

  const query = "DELETE FROM notas WHERE id_nota = ?";
  db.query(query, [id_nota], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar la nota", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Nota no encontrada" });
    }
    res.status(200).json({ message: "Nota eliminada correctamente" });
  });
});

module.exports = router;
