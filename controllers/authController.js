const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    const { fullName, email, username, password, userType } = req.body

    if (!fullName || !email || !username || !password || !userType) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    const checkAdminSql = 'SELECT * FROM administradores WHERE nombre_usuario = ? OR email = ?'
    const checkClientSql = 'SELECT * FROM clientes WHERE nombre_usuario = ? OR email = ?'

    const [admins] = await db.promise().query(checkAdminSql, [username, email])
    const [clients] = await db.promise().query(checkClientSql, [username, email])

    if (admins.length > 0 || clients.length > 0) {
      return res.status(409).json({ message: 'El usuario o email ya están en uso' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const table = userType === 'admin' ? 'administradores' : 'clientes'

    const sql = `INSERT INTO ${table} (nombre_completo, email, nombre_usuario, password, tipo)
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

    const adminSql = 'SELECT * FROM administradores WHERE nombre_usuario = ?'
    const clientSql = 'SELECT * FROM clientes WHERE nombre_usuario = ?'

    const [adminResult] = await db.promise().query(adminSql, [username])
    const [clientResult] = await db.promise().query(clientSql, [username])

    const user = adminResult[0] || clientResult[0]
    const tipo = adminResult.length ? 'admin' : 'cliente'

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const passwordIsValid = await bcrypt.compare(password, user.password)

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.nombre_usuario, tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return res.json({
      message: 'Login exitoso',
      token,
      user: { nombre: user.nombre_usuario, tipo }
    })
  } catch (err) {
    console.error('Error en login:', err)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}
