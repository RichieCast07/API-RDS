const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) throw err;
    console.log('Estudiantes-Conexión a la BD establecida');
});


exports.login = async (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM Estudiantes', async (err, result) => {
        if (err) {
            res.status(500).send('Error en el servidor');
            throw err;
        }
        if (result.length === 0) {
            return res.status(401).send(' inválidas');
        }
        const user = result[0];
        // Verificar contraseña (con bcrypt)
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Credenciales inválidas');
        }
        // Generar JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};

  // Middleware de autenticación
    const authenticateJWT = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
            return res.sendStatus(403); // Prohibido (token inválido)
            }
            req.user = user;
            next();
        });
        } else {
        res.sendStatus(401); // No autorizado (sin token)
        }
    };

    // Rutas protegidas con autenticación JWT
    exports.getAllUsers = [authenticateJWT, (req, res) => {
        db.query('SELECT * FROM Estudiantes', (err, result) => {
        if (err) {
            res.status(500).send('Error al obtener los Estudiantes');
            throw err;
        }
        res.json(result);
        });
    }];

    exports.addUser = (req, res) => {
        const newUser = req.body;
        // Hashear la contraseña antes de guardarla (bcrypt)
        bcrypt.hash(newUser.password, 10, (err, hash) => { // 10 es el número de rondas de hashing
        if (err) {
            res.status(500).send('Error al hashear la contraseña');
            throw err;
        }
        newUser.password = hash;

        db.query('INSERT INTO Estudiantes SET ?', newUser, (err, result) => {
            if (err) {
            res.status(500).send('Error al agregar el usuario');
            throw err;
            }
            res.status(201).send('Usuario agregado correctamente');
        });
        });
    };

    // Actualizar un usuario existente
    exports.updateUser = (req, res) => {
        const userId = req.params.id;
        const updatedUser = req.body;
        db.query('UPDATE Estudiantes SET ? WHERE id = ?', [updatedUser, userId], (err, result) => {
        if (err) {
            res.status(500).send('Error al actualizar el usuario');
            throw err;
        }
        res.send('Usuario actualizado correctamente');
        });
    };

    // Eliminar un usuario
    exports.deleteUser = (req, res) => {
        const userId = req.params.id;
        db.query('DELETE FROM Estudiantes WHERE id = ?', userId, (err, result) => {
        if (err) {
            res.status(500).send('Error al eliminar el usuario');
            throw err;
        }
        res.send('Usuario eliminado correctamente');
        });
    };