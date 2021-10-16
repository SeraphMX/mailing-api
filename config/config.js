// Configuración de puerto
process.env.PORT = process.env.PORT || 3001;

// Vencimiento del token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED de autenticación
process.env.SEED = process.env.SEED || 'seed-development';

//ServerCode
process.env.SERVERCODE = "radik";

//Host
process.env.HOST = "localhost";

//Sending Mail
process.env.EMAILPORT = 2525
