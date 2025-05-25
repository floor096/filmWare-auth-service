import express from 'express'
import { PORT } from './config.js'

const app = express()

app.get('/', (req, res) => {
  res.send('<h1>hello wordl</h1>')
})

app.post('/login', (req, res) => {
  res.json({ user: 'holis' })
})
app.post('/register', (req, res) => { })
app.post('/logout', (req, res) => { })

app.post('/protected', (req, res) => { })

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})

// -----NUEVO ------
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
