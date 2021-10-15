const mysql = require('mysql2');

// Configuración de la base de datos
//TODO: Mysql Change to MYSQL2
exports.connect = function() {
    let db_config = mysql.createConnection({
        connectionLimit: 10,
        host: '152.44.46.183',
        user: 'root',
        password: 'db010100',
        database: 'rk-megabase',
        debug: false
    });
    return db_config;
};