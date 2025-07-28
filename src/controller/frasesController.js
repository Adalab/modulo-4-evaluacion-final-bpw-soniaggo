// src/controllers/frasesController.js

const { pool } = require('../db'); // Importa tu conexión a la base de datos

exports.createFrase = async (req, res) => {
    const { texto, marca_tiempo, descripcion, personaje_id, capitulo_id } = req.body; // Obtiene los datos del cuerpo de la petición

    // Validación básica
    if (!texto || !personaje_id || !capitulo_id) {
        return res.status(400).json({ message: 'Los campos texto, personaje_id y capitulo_id son obligatorios.' });
    }

    try {
        const [result] = await pool.query( // Ejecuta la inserción SQL
            'INSERT INTO frases (texto, marca_tiempo, descripcion, personaje_id, capitulo_id) VALUES (?, ?, ?, ?, ?)',
            [texto, marca_tiempo, descripcion, personaje_id, capitulo_id]
        );
        res.status(201).json({ message: 'Frase insertada correctamente', id: result.insertId }); // Devuelve éxito y el ID de la nueva frase
    } catch (error) {
        console.error('Error al insertar frase:', error);
        res.status(500).json({ message: 'Error interno del servidor.' }); // Error del servidor
    }
};

// src/controllers/frasesController.js (continuación)

exports.getAllFrases = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                f.id, f.texto, f.marca_tiempo, f.descripcion,
                p.id AS personaje_id, p.nombre AS personaje_nombre, p.apellido AS personaje_apellido,
                c.id AS capitulo_id, c.titulo AS capitulo_titulo
            FROM frases f
            JOIN personajes p ON f.personaje_id = p.id
            JOIN capitulos c ON f.capitulo_id = c.id
        `);

        // Formatear la respuesta para que sea más legible para el cliente
        const frases = rows.map(frase => ({
            id: frase.id,
            texto: frase.texto,
            marca_tiempo: frase.marca_tiempo,
            descripcion: frase.descripcion,
            personaje: {
                id: frase.personaje_id,
                nombre: frase.personaje_nombre,
                apellido: frase.personaje_apellido
            },
            capitulo: {
                id: frase.capitulo_id,
                titulo: frase.capitulo_titulo
            }
        }));
        res.json(frases); // Devuelve la lista de frases
    } catch (error) {
        console.error('Error al obtener todas las frases:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// src/controllers/frasesController.js (continuación)

// Función auxiliar (ya la incluí en la respuesta anterior, pero la pongo de nuevo aquí)
async function getFraseWithDetails(fraseId) {
    const [rows] = await pool.query(`
        SELECT
            f.id, f.texto, f.marca_tiempo, f.descripcion,
            p.id AS personaje_id, p.nombre AS personaje_nombre, p.apellido AS personaje_apellido,
            c.id AS capitulo_id, c.titulo AS capitulo_titulo
        FROM frases f
        JOIN personajes p ON f.personaje_id = p.id
        JOIN capitulos c ON f.capitulo_id = c.id
        WHERE f.id = ?
    `, [fraseId]);

    if (rows.length === 0) {
        return null; // No se encontró la frase
    }

    const frase = rows[0];
    return { // Formatea la respuesta
        id: frase.id,
        texto: frase.texto,
        marca_tiempo: frase.marca_tiempo,
        descripcion: frase.descripcion,
        personaje: {
            id: frase.personaje_id,
            nombre: frase.personaje_nombre,
            apellido: frase.personaje_apellido
        },
        capitulo: {
            id: frase.capitulo_id,
            titulo: frase.capitulo_titulo
        }
    };
}

exports.getFraseById = async (req, res) => {
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL
    try {
        const frase = await getFraseWithDetails(id);
        if (!frase) {
            return res.status(404).json({ message: 'Frase no encontrada.' }); // Frase no encontrada
        }
        res.json(frase); // Devuelve la frase
    } catch (error) {
        console.error('Error al obtener frase por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
// src/controllers/frasesController.js (continuación)

exports.updateFrase = async (req, res) => {
    const { id } = req.params;
    const { texto, marca_tiempo, descripcion, personaje_id, capitulo_id } = req.body;
    if (!texto || !personaje_id || !capitulo_id) {
        return res.status(400).json({ message: 'Los campos texto, personaje_id y capitulo_id son obligatorios.' });
    }
    try {
        const [result] = await pool.query(
            'UPDATE frases SET texto = ?, marca_tiempo = ?, descripcion = ?, personaje_id = ?, capitulo_id = ? WHERE id = ?',
            [texto, marca_tiempo, descripcion, personaje_id, capitulo_id, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Frase no encontrada para actualizar.' });
        }
        res.json({ message: 'Frase actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar frase:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// src/controllers/frasesController.js (continuación)

exports.deleteFrase = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM frases WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Frase no encontrada para eliminar.' });
        }
        res.json({ message: 'Frase eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar frase:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};