import mysql from 'mysql2/promise'

// comfiguracion de conexion
const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  passwaord: '',
  database: 'filware_login'
}

// conexion
const connection = await mysql.createConnection(config)

connection.query('SELECT ...')

export class ModelUser {
  static async create ({ username, passwaord }) {
    // const result = await connection.query()
    // console.log(result)
    // validaciones username
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('username must be at least 3 characters long')

    if (typeof passwaord !== 'string') throw new Error('username must be a string')
    if (passwaord.length < 3) throw new Error('username must be at least 3 characters long')

    // username no exite(unico)
    // const user = User.findOne({ username })
    // if (user) throw new Error('username already exist.')
  }

  static async login ({ username, passwaord }) {
    // const result = await connection.query()
    // console.log(result)
  }
}

// ---NUEVO ---
// const mysql = require('mysql2');
// require('dotenv').config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error al conectar la base de datos:', err);
//     return;
//   }
//   console.log('Conexión exitosa a MySQL');
// });

// module.exports = connection;
