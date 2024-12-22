const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Archivo de conexión a la base de datos

// Crear una nueva tarea
router.post('/create', (req, res) => {
    const { id_usuario, titulo, descripcion, prioridad, fecha_vencimiento } = req.body;

    if (!id_usuario || !titulo || !prioridad) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const query = `INSERT INTO tareas (id_usuario, titulo, descripcion, prioridad, fecha_vencimiento, estado) 
                   VALUES (?, ?, ?, ?, ?, 'pendiente')`;
    db.query(query, [id_usuario, titulo, descripcion, prioridad, fecha_vencimiento], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al crear la tarea", details: err });
        }
        res.status(201).json({ message: "Tarea creada exitosamente", id: result.insertId });
    });
});

// Listar todas las tareas de un usuario
router.get('/list/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const query = "SELECT * FROM tareas WHERE id_usuario = ?";
    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener las tareas", details: err });
        }
        res.status(200).json(results);
    });
});

// Actualizar una tarea (editar o cambiar estado)
router.put('/update/:id_tarea', (req, res) => {
    const { id_tarea } = req.params;
    const { titulo, descripcion, prioridad, fecha_vencimiento, estado } = req.body;

    const query = `UPDATE tareas SET 
                   titulo = COALESCE(?, titulo),
                   descripcion = COALESCE(?, descripcion),
                   prioridad = COALESCE(?, prioridad),
                   fecha_vencimiento = COALESCE(?, fecha_vencimiento),
                   estado = COALESCE(?, estado)
                   WHERE id_tarea = ?`;
    db.query(query, [titulo, descripcion, prioridad, fecha_vencimiento, estado, id_tarea], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al actualizar la tarea", details: err });
        }
        res.status(200).json({ message: "Tarea actualizada exitosamente" });
    });
});

// Eliminar una tarea
router.delete('/delete/:id_tarea', (req, res) => {
    const { id_tarea } = req.params;

    const query = "DELETE FROM tareas WHERE id_tarea = ?";
    db.query(query, [id_tarea], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al eliminar la tarea", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró la tarea con el ID proporcionado" });
        }
        res.status(200).json({ message: "Tarea eliminada correctamente" });
    });
});

module.exports = router;
