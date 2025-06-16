const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const { authenticateToken } = require('./middlewares/verificarSesion.js')
const connection = require('./config/db.js')
const bcrypt = require('bcryptjs')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))

// -CRUD-
// Obtener datos del perfil
app.get('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id
  const table = req.user.tipo === 'admin' ? 'administradores' : 'clientes'

  connection.query(
    `SELECT nombre_usuario as username, nombre_completo, email FROM ${table} WHERE id = ?`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' })
      if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
      res.json(results[0])
    }
  )
})

// Actualizar datos del perfil
app.put('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id
  const table = req.user.tipo === 'admin' ? 'administradores' : 'clientes'
  const { username, fullName, email } = req.body

  connection.query(
    `UPDATE ${table} SET nombre_usuario = ?, nombre_completo = ?, email = ? WHERE id = ?`,
    [username, fullName, email, userId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar perfil' })
      res.json({ message: 'Perfil actualizado correctamente' })
    }
  )
})

// Cambiar contraseña
app.put('/api/profile/password', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const table = req.user.tipo === 'admin' ? 'administradores' : 'clientes'
  const { currentPassword, newPassword } = req.body

  try {
    const [results] = await connection.promise().query(
      `SELECT password FROM ${table} WHERE id = ?`,
      [userId]
    )

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const isValidPassword = await bcrypt.compare(currentPassword, results[0].password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await connection.promise().query(
      `UPDATE ${table} SET password = ? WHERE id = ?`,
      [hashedNewPassword, userId]
    )

    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (err) {
    console.error('Error al cambiar contraseña:', err)
    res.status(500).json({ error: 'Error en el servidor' })
  }
})

// Eliminar cuenta
app.delete('/api/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const table = req.user.tipo === 'admin' ? 'administradores' : 'clientes'
  const { password } = req.body

  try {
    const [results] = await connection.promise().query(
      `SELECT password FROM ${table} WHERE id = ?`,
      [userId]
    )

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const isValidPassword = await bcrypt.compare(password, results[0].password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Contraseña incorrecta' })
    }

    await connection.promise().query(
      `DELETE FROM ${table} WHERE id = ?`,
      [userId]
    )

    res.json({ message: 'Cuenta eliminada correctamente' })
  } catch (err) {
    console.error('Error al eliminar cuenta:', err)
    res.status(500).json({ error: 'Error en el servidor' })
  }
})
