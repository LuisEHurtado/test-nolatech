const mysql = require('mysql');
const { database } = require('../configs/db.config');
const { promisify }= require('util');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Se cerró la conexión a la base de datos.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('La base de datos tiene muchas conexiones.');
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('La conexión a la base de datos fue rechazada');
      }
    }
  
    if (connection) connection.release();
    console.log('La base de datos está conectada');
  
    return;
  });
  
  pool.query = promisify(pool.query);
  
  module.exports = pool;