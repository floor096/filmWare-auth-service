const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = (req, res) => {
  const { fullName, email, username, password, userType } = req.body

  const hashedPassword = bcrypt.hashSync(password, 10)

  const sql = `INSERT INTO usuarios (nombre_completo, email, nombre_usuario, password, tipo_usuario)
               VALUES (?, ?, ?, ?, ?)`
  db.query(sql, [fullName, email, username, hashedPassword, userType], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor', error: err })
    return res.status(201).json({ message: 'Usuario registrado correctamente' })
  })
}

exports.login = (req, res) => {
  const { username, password } = req.body

  const sql = 'SELECT * FROM usuarios WHERE nombre_usuario = ?'
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' })
    if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' })

    const user = results[0]
    const passwordIsValid = bcrypt.compareSync(password, user.password)

    if (!passwordIsValid) return res.status(401).json({ message: 'Contraseña incorrecta' })

    const token = jwt.sign(
      { id: user.id, username: user.nombre_usuario, tipo: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return res.json({
      message: 'Login exitoso',
      token,
      user: {
        nombre: user.nombre_usuario,
        tipo: user.tipo_usuario
      }
    })
  })
}
