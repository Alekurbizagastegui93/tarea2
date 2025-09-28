const { Usuario } = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const obtenerUsuarios = async(req, res) => {
    try{
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] },//no se envia contraseña
        order: [['createdAt','DESC']]
        });

        

        res.json({
            success: true,
            message: 'Usuarios Obtenidos Correctamente',
            data: usuarios,
            total: usuarios.length
        });

        
    }catch(error){
        console.error('Error al obtener usuarios', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, activo } = req.body;
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password, 
            activo: activo !== undefined ? activo : true
        });

        const usuarioResponse = { ...nuevoUsuario.toJSON() };
        delete usuarioResponse.password;

        return res.status(201).json({
            success: true,
            message: "Usuario creado exitosamente (Contraseña simple)",
            data: usuarioResponse 
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor al crear el usuario.",
            error: error.message
        });
    }
};

const actualizarUsuario = async (req, res) => {
    const id = req.params.id; // ID del usuario a actualizar
    const datosActualizados = req.body; // Datos a modificar

    try {
        // Ejecuta la actualización en Sequelize
        const [filasActualizadas, [usuarioActualizado]] = await Usuario.update(
            datosActualizados, {
                where: { id: id },
                returning: true, // Devuelve el registro actualizado
            }
        );

        if (filasActualizadas === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        
        // Prepara la respuesta
        const usuarioResponse = { ...usuarioActualizado.toJSON() };
        delete usuarioResponse.password;

        res.json({
            success: true,
            message: `Usuario ${id} actualizado correctamente`,
            data: usuarioResponse
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

const eliminarUsuario = async (req, res) => {
    const id = req.params.id; // ID del usuario a eliminar

    try {
        const filasEliminadas = await Usuario.destroy({
            where: { id: id }
        });

        if (filasEliminadas === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // 204 No Content: Indica que la eliminación fue exitosa, pero no hay datos que devolver.
        res.status(204).send();

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};