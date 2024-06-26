const express = require('express');
const router = express.Router();
const comentariosController = require('../controller/comentarios');

// Rutas para los endpoints CRUD
router.get('/', comentariosController.getAllcomentarios);
router.post('/', comentariosController.addcomentarios);
router.put('/:id', comentariosController.updatecomentarios);
router.delete('/:id', comentariosController.deletecomentarios);

module.exports = router;