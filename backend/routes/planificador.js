const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Obtener todos los eventos de un usuario
router.get('/list/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;
  const query = "SELECT * FROM eventos_academicos WHERE id_usuario = ?";
  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener los eventos", details: err });
    }
    res.status(200).json(results);
  });
});

// Crear un evento
router.post('/create', (req, res) => {
  const { id_usuario, titulo, descripcion, tipo, fecha_inicio, fecha_fin, recordatorio } = req.body;

  if (!id_usuario || !titulo || !tipo || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const query = `
    INSERT INTO eventos_academicos (id_usuario, titulo, descripcion, tipo, fecha_inicio, fecha_fin, recordatorio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [id_usuario, titulo, descripcion, tipo, fecha_inicio, fecha_fin, recordatorio || false], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al crear el evento", details: err });
    }
    res.status(201).json({ message: "Evento creado exitosamente", id_evento: result.insertId });
  });
});

// Actualizar un evento
router.put('/update/:id_evento', (req, res) => {
  const { id_evento } = req.params;
  const { titulo, descripcion, tipo, fecha_inicio, fecha_fin, recordatorio } = req.body;

  const query = `
    UPDATE eventos_academicos
    SET titulo = ?, descripcion = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, recordatorio = ?
    WHERE id_evento = ?
  `;
  db.query(query, [titulo, descripcion, tipo, fecha_inicio, fecha_fin, recordatorio, id_evento], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al actualizar el evento", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    res.status(200).json({ message: "Evento actualizado exitosamente" });
  });
});

// Eliminar un evento
router.delete('/delete/:id_evento', (req, res) => {
  const { id_evento } = req.params;

  const query = "DELETE FROM eventos_academicos WHERE id_evento = ?";
  db.query(query, [id_evento], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar el evento", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    res.status(200).json({ message: "Evento eliminado exitosamente" });
  });
});

module.exports = router;
