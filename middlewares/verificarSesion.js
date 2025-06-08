// -----NUEVO-----
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] // Obtener token de los headers

  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verificar el token con la clave secreta
    req.user = decoded // Guardar datos del usuario en `req.user`
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado.' })
  }
}
