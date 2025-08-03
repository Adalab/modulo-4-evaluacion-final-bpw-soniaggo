

const express = require('express');
const router = express.Router(); // Crea un "mini-aplicación" de Express para las rutas
const frasesController = require('../controllers/frasesController'); // Importa las funciones controladoras

// Define las rutas y asocia cada una con su función controladora
router.post('/', frasesController.createFrase);       
router.get('/', frasesController.getAllFrases);        
router.get('/:id', frasesController.getFraseById);     
router.put('/:id', frasesController.updateFrase);     
router.delete('/:id', frasesController.deleteFrase); 

module.exports = router; 