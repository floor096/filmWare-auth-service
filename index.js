// import express from 'express'
// import cors from 'cors'
// import authRoutes from './routes/authRoutes.js'
// import dotenv from 'dotenv'

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')

dotenv.config() // Cargar variables de entorno

const app = express()

// Middleware
app.use(cors()) // permitir solicitudes desde el frontend
app.use(express.json()) // Permitir que el servidor procese JSON

// Rutas de autenticación
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
