// ---NUEVO ---
const mysql = require('mysql2')
require('dotenv').config()

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Manejo de conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar la base de datos:', err)
    return
  }
  console.log('Conexión exitosa a MySQL')
})

module.exports = connection
