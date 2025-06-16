const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
// const verificarSesion = require('../middlewares/verificarSesion') // ✅ Importamos el middleware JWT
const { authenticateToken } = require('../middlewares/verificarSesion') // ✅ Correcto

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/perfil', authenticateToken, (req, res) => { // ✅ Protegemos la ruta "perfil"
  res.json({ message: 'Bienvenido al perfil', user: req.user })
})

module.exports = router
