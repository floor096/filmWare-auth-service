// -----NUEVO-en-middlewares----
const jwt = require('jsonwebtoken')

function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Sin autorización' })

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Sin token' })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido' })
    req.user = decoded
    next()
  })
}

module.exports = { authenticateToken }
