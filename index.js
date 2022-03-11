const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
var cors = require('cors');



//Crear el servidor express
const app = express();

//Database
dbConnection();

//Cors
app.use(cors());

//Directiorio publico
app.use( express.static('public') );

//Lectura y parseo del body
app.use( express.json() );

//rutas
app.use('/api/auth', require('./routes/auth'));
// TODO: CRUD: Eventos
app.use('/api/events', require('./routes/events'));

//Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
});