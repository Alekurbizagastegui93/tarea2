const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario, 
    eliminarUsuario  
} = require('../controllers/usuarioController');

//RUTAS
router.get('/', obtenerUsuarios);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;