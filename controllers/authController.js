// ----NUEVO----
const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    const { fullName, email, username, password, userType } = req.body

    if (!fullName || !email || !username || !password || !userType) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    // Verificar si el usuario ya existe
    const checkUserSql = 'SELECT * FROM usuarios WHERE nombre_usuario = ? OR email = ?'
    const [existingUsers] = await db.promise().query(checkUserSql, [username, email])

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'El usuario o email ya están en uso' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const sql = `INSERT INTO usuarios (nombre_completo, email, nombre_usuario, password, tipo_usuario)
                 VALUES (?, ?, ?, ?, ?)`
    await db.promise().query(sql, [fullName, email, username, hashedPassword, userType])

    return res.status(201).json({ message: 'Usuario registrado correctamente' })
  } catch (err) {
    console.error('Error en registro:', err)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' })
    }

    const sql = 'SELECT * FROM usuarios WHERE nombre_usuario = ?'
    const [results] = await db.promise().query(sql, [username])

    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const user = results[0]
    const passwordIsValid = await bcrypt.compare(password, user.password)

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.nombre_usuario, tipo: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return res.json({
      message: 'Login exitoso',
      token,
      user: { nombre: user.nombre_usuario, tipo: user.tipo_usuario }
    })
  } catch (err) {
    console.error('Error en login:', err)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}
