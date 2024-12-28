const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const router = express.Router();

// Clave secreta para JWT (utiliza una variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || "clave-secreta";

// Registro de usuarios
router.post("/register", async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el email ya está registrado
    const checkEmailQuery = "SELECT * FROM usuarios WHERE email = ?";
    const [existingUser] = await db.promise().query(checkEmailQuery, [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar el nuevo usuario en la base de datos
    const query = `
      INSERT INTO usuarios (nombre, email, contrasena)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.promise().query(query, [nombre, email, hashedPassword]);

    res.status(201).json({ message: "Usuario registrado exitosamente", id_usuario: result.insertId });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Buscar al usuario por correo electrónico
    const query = "SELECT * FROM usuarios WHERE email = ?";
    const [user] = await db.promise().query(query, [email]);

    if (user.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const foundUser = user[0];

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(contrasena, foundUser.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Generar un token JWT
    const token = jwt.sign({ id_usuario: foundUser.id_usuario, email: foundUser.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id_usuario: foundUser.id_usuario,
        nombre: foundUser.nombre,
        email: foundUser.email,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Middleware para verificar el token JWT
router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Acceso no autorizado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: "Token válido", user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
});

module.exports = router;
