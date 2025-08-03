const express = require('express');
const cors = require('cors');
const { testDbConnection } = require('./db'); 
require('dotenv').config();





const frasesRoutes = require('./routes/frases');


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/frases', frasesRoutes);


// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Los Simpson funcionando. ¡D\'oh!');
});

// Iniciar el servidor
async function startServer() {
    await testDbConnection(); // Prueba la conexión a la base de datos antes de iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
    });
}

startServer();