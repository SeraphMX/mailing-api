const mysql = require('mysql');

// Configuración de la base de datos
exports.connect = function() {
    let db_config = mysql.createConnection({
        connectionLimit: 10,
        host: '162.241.2.161',
        user: 'wehostmx_c420',
        password: 'Cannademius',
        database: 'wehostmx_cannademia',
        debug: false
    });
    return db_config;
};