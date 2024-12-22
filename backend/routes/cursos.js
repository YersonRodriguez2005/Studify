const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../models/db");

const router = express.Router();

// Configuración de multer para subir archivos PDF con validación de tamaño
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/certificates/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos PDF"));
    }
  },
});

// Obtener todos los cursos por usuario
router.get("/list/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;

  const query = "SELECT * FROM cursos WHERE id_usuario = ?";
  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener los cursos", details: err });
    }
    res.status(200).json(results);
  });
});

// Crear un curso nuevo
router.post("/create", (req, res) => {
  const { id_usuario, nombre_curso, progreso, fecha_inscripcion } = req.body;

  if (!id_usuario || !nombre_curso || !progreso || !fecha_inscripcion) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const query =
    "INSERT INTO cursos (id_usuario, nombre_curso, progreso, fecha_inscripcion) VALUES (?, ?, ?, ?)";
  db.query(query, [id_usuario, nombre_curso, progreso, fecha_inscripcion], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al crear el curso", details: err });
    }
    res.status(201).json({ message: "Curso creado exitosamente", id: result.insertId });
  });
});

// Editar un curso
router.put("/update/:id_curso", (req, res) => {
  const { id_curso } = req.params;
  const { nombre_curso, progreso, fecha_inscripcion } = req.body;

  if (!nombre_curso || !progreso || !fecha_inscripcion) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  const query = `
    UPDATE cursos 
    SET nombre_curso = ?, progreso = ?, fecha_inscripcion = ? 
    WHERE id_curso = ?`;

  db.query(query, [nombre_curso, progreso, fecha_inscripcion, id_curso], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al actualizar el curso", details: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.status(200).json({ message: "Curso actualizado correctamente" });
  });
});

// Subir un certificado
router.post("/upload/:id_curso", upload.single("certificado"), (req, res) => {
  const { id_curso } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "Debe adjuntar un archivo PDF" });
  }

  const certificadoPath = `/uploads/certificates/${req.file.filename}`;

  const query = "UPDATE cursos SET certificado = ? WHERE id_curso = ?";
  db.query(query, [certificadoPath, id_curso], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al subir el certificado", details: err });
    }
    res.status(200).json({ message: "Certificado subido exitosamente", path: certificadoPath });
  });
});

// Eliminar un curso y su certificado
router.delete("/delete/:id_curso", (req, res) => {
  const { id_curso } = req.params;

  // Obtener el certificado asociado al curso
  const getCertificateQuery = "SELECT certificado FROM cursos WHERE id_curso = ?";
  db.query(getCertificateQuery, [id_curso], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener el certificado del curso", details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const certificadoPath = results[0].certificado;

    // Eliminar el curso de la base de datos
    const deleteCourseQuery = "DELETE FROM cursos WHERE id_curso = ?";
    db.query(deleteCourseQuery, [id_curso], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error al eliminar el curso", details: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      // Eliminar el archivo de certificado si existe
      if (certificadoPath) {
        const fullPath = path.join(__dirname, "..", certificadoPath);
        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error al eliminar el archivo:", unlinkErr);
            return res.status(200).json({
              message: "Curso eliminado, pero no se pudo eliminar el archivo asociado",
            });
          }

          res.status(200).json({ message: "Curso y certificado eliminados correctamente" });
        });
      } else {
        res.status(200).json({ message: "Curso eliminado correctamente" });
      }
    });
  });
});

module.exports = router;