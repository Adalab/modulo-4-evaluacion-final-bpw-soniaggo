// src/routes/frases.js

const express = require('express');
const router = express.Router(); // Crea un "mini-aplicación" de Express para las rutas
const frasesController = require('../controllers/frasesController'); // Importa las funciones controladoras

// Define las rutas y asocia cada una con su función controladora
router.post('/', frasesController.createFrase);       // POST /frases
router.get('/', frasesController.getAllFrases);        // GET /frases
router.get('/:id', frasesController.getFraseById);     // GET /frases/:id
router.put('/:id', frasesController.updateFrase);      // PUT /frases/:id
router.delete('/:id', frasesController.deleteFrase);   // DELETE /frases/:id

module.exports = router; // Exporta el router para usarlo en app.js