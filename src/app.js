const express = require('express');
const cors = require('cors');
const { testDbConnection } = require('./db'); // Importa la función de prueba de conexión
require('dotenv').config();
// src/app.js (continuación de lo que ya tenías)

// ... (tus imports y middlewares como express.json(), cors(), etc.)

// Importa las rutas de frases
const frasesRoutes = require('./routes/frases');
// const personajesRoutes = require('./routes/personajes'); // Para los bonus
// const capitulosRoutes = require('./routes/capitulos');   // Para los bonus

// Usa las rutas en tu aplicación

// app.use('/personajes', personajesRoutes); // Descomentar para los bonus
// app.use('/capitulos', capitulosRoutes);   // Descomentar para los bonus

// ... (tu ruta de prueba y el inicio del servidor)


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite a Express parsear cuerpos de solicitud JSON
app.use(express.urlencoded({ extended: true })); // Permite a Express parsear cuerpos de solicitud con URL-encoded data
app.use('/frases', frasesRoutes);
// Rutas (se definirán en la Sección 3)
// app.use('/frases', require('./routes/frases'));
// app.use('/personajes', require('./routes/personajes'));
// app.use('/capitulos', require('./routes/capitulos'));

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