const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) throw err;
    console.log('Comentarios-Conexión a la BD establecida');
});

exports.getAllcomentarios = (req, res) => {
    db.query('SELECT * FROM Comentarios', (err, result) => {
        if (err) {
            res.status(500).send('Error al obtener los comentarios');
            throw err;
        }
        res.json(result);
        });
};

    exports.addcomentarios = (req, res) => {
        const newcomentarios = req.body;
        db.query('INSERT INTO Comentarios SET ?', newcomentarios, (err, result) => {
        if (err) {
            res.status(500).send('Error al agregar el comentarios');
            throw err;
        }
        res.status(201).send('Comentarios agregados correctamente');
        });
    };

    exports.updatecomentarios = (req, res) => {
        const comentariosId = req.params.id;
        const updatedcomentarios = req.body;
        db.query('UPDATE Comentarios SET ? WHERE id = ?', [updatedcomentarios, comentariosId], (err, result) => {
        if (err) {
            res.status(500).send('Error al actualizar el comentarios');
            throw err;
        }
        res.send('Comentarios actualizados correctamente');
        });
    };

    exports.deletecomentarios = (req, res) => {
        const comentariosId = req.params.id;
        db.query('DELETE FROM Comentarios WHERE id = ?', comentariosId, (err, result) => {
        if (err) {
            res.status(500).send('Error al eliminar el comentarios');
            throw err;
        }
        res.send('Comentarios eliminados correctamente');
        });
    };