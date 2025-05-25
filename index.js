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
