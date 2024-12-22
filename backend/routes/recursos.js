const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../models/db");

const router = express.Router();

// Configuración de multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/recursos/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx|pptx/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos PDF, DOCX o PPTX"));
    }
  },
});

// Obtener todos los recursos de un usuario
router.get("/list/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;
  const query = "SELECT * FROM recursos WHERE id_usuario = ?";
  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener los recursos", details: err });
    }
    res.status(200).json(results);
  });
});

// Subir un nuevo recurso
router.post("/upload", upload.single("archivo"), (req, res) => {
  const { id_usuario, etiqueta } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Debe adjuntar un archivo" });
  }

  const nombreArchivo = req.file.originalname;
  const rutaArchivo = `/uploads/recursos/${req.file.filename}`;

  const query =
    "INSERT INTO recursos (id_usuario, nombre_archivo, ruta_archivo, etiqueta) VALUES (?, ?, ?, ?)";
  db.query(query, [id_usuario, nombreArchivo, rutaArchivo, etiqueta || null], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al subir el recurso", details: err });
    }
    res.status(201).json({ message: "Recurso subido exitosamente", id: result.insertId });
  });
});

// Eliminar un recurso y su archivo asociado
router.delete("/delete/:id_recurso", (req, res) => {
  const { id_recurso } = req.params;

  // Obtener la ruta del archivo asociado al recurso
  const getQuery = "SELECT ruta_archivo FROM recursos WHERE id_recurso = ?";
  db.query(getQuery, [id_recurso], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al buscar el recurso", details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }

    const filePath = path.join(__dirname, "..", results[0].ruta_archivo);

    // Eliminar el recurso de la base de datos
    const deleteQuery = "DELETE FROM recursos WHERE id_recurso = ?";
    db.query(deleteQuery, [id_recurso], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).json({ error: "Error al eliminar el recurso", details: deleteErr });
      }

      // Intentar eliminar el archivo físico
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error al eliminar el archivo físico:", unlinkErr);
          return res.status(200).json({
            message: "Recurso eliminado, pero no se pudo eliminar el archivo asociado",
          });
        }

        res.status(200).json({ message: "Recurso y archivo eliminados correctamente" });
      });
    });
  });
});

// Buscar recursos por nombre o etiqueta
router.get("/search/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;
  const { query } = req.query;

  const searchQuery = `
    SELECT * FROM recursos 
    WHERE id_usuario = ? AND 
    (nombre_archivo LIKE ? OR etiqueta LIKE ?)`;
  const likeQuery = `%${query}%`;

  db.query(searchQuery, [id_usuario, likeQuery, likeQuery], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al buscar recursos", details: err });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
