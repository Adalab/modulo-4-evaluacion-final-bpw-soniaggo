// src/controllers/frasesController.js

const { pool } = require('../db'); // Importa tu conexión a la base de datos

/**
 * Crea una nueva frase en la base de datos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.createFrase = async (req, res) => {
    // Obtiene los datos del cuerpo de la petición (JSON)
    const { texto, marca_tiempo, descripcion, personaje_id, capitulo_id } = req.body;

    // Validación básica: 'texto' y 'personaje_id' son obligatorios
    // 'capitulo_id' es opcional según el esquema de la BD
    if (!texto || !personaje_id) {
        return res.status(400).json({ message: 'Los campos texto y personaje_id son obligatorios.' });
    }

    try {
        // Ejecuta la consulta SQL para insertar la nueva frase
        // Los '?' son placeholders que serán reemplazados por los valores del array
        const [result] = await pool.query(
            'INSERT INTO frases (texto, marca_tiempo, descripcion, personaje_id, capitulo_id) VALUES (?, ?, ?, ?, ?)',
            [texto, marca_tiempo, descripcion, personaje_id, capitulo_id]
        );

        // Si la inserción fue exitosa, devuelve un mensaje de éxito y el ID de la nueva frase
        res.status(201).json({ message: 'Frase insertada correctamente', id: result.insertId });
    } catch (error) {
        // Si ocurre un error, lo loguea en la consola del servidor y envía un error 500 al cliente
        console.error('Error al insertar frase:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtiene todas las frases con información detallada de personaje y capítulo.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.getAllFrases = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                f.id, f.texto, f.marca_tiempo, f.descripcion,
                p.id AS personaje_id, p.nombre AS personaje_nombre, p.apellido AS personaje_apellido,
                c.id AS capitulo_id, c.titulo AS capitulo_titulo
            FROM frases f
            JOIN personajes p ON f.personaje_id = p.id
            LEFT JOIN capitulos c ON f.capitulo_id = c.id -- Usamos LEFT JOIN para incluir frases sin capítulo
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
            // Si capitulo_id es NULL, el objeto capitulo será null
            capitulo: frase.capitulo_id ? {
                id: frase.capitulo_id,
                titulo: frase.capitulo_titulo
            } : null
        }));
        res.json(frases); // Devuelve la lista de frases
    } catch (error) {
        console.error('Error al obtener todas las frases:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Función auxiliar para obtener una frase específica con detalles de personaje y capítulo.
 * @param {number} fraseId - El ID de la frase a buscar.
 * @returns {object|null} La frase formateada o null si no se encuentra.
 */
async function getFraseWithDetails(fraseId) {
    try {
        const [rows] = await pool.query(`
            SELECT
                f.id, f.texto, f.marca_tiempo, f.descripcion,
                p.id AS personaje_id, p.nombre AS personaje_nombre, p.apellido AS personaje_apellido,
                c.id AS capitulo_id, c.titulo AS capitulo_titulo
            FROM frases f
            JOIN personajes p ON f.personaje_id = p.id
            LEFT JOIN capitulos c ON f.capitulo_id = c.id -- Usamos LEFT JOIN para incluir frases sin capítulo
            WHERE f.id = ?
        `, [fraseId]);

        if (rows.length === 0) {
            return null; // No se encontró la frase
        }

        const frase = rows[0];
        // Formatea la respuesta
        return {
            id: frase.id,
            texto: frase.texto,
            marca_tiempo: frase.marca_tiempo,
            descripcion: frase.descripcion,
            personaje: {
                id: frase.personaje_id,
                nombre: frase.personaje_nombre,
                apellido: frase.personaje_apellido
            },
            // Si capitulo_id es NULL, el objeto capitulo será null
            capitulo: frase.capitulo_id ? {
                id: frase.capitulo_id,
                titulo: frase.capitulo_titulo
            } : null
        };
    } catch (error) {
        // Propaga el error para que sea manejado por la función que llama (getFraseById)
        throw error;
    }
}

/**
 * Obtiene una frase específica por su ID.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
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

/**
 * Actualiza una frase existente por su ID.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.updateFrase = async (req, res) => {
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL
    const { texto, marca_tiempo, descripcion, personaje_id, capitulo_id } = req.body; // Obtiene los datos del cuerpo de la petición

    // Validación básica: 'texto' y 'personaje_id' son obligatorios para la actualización
    // 'capitulo_id' es opcional según el esquema de la BD
    if (!texto || !personaje_id) {
        return res.status(400).json({ message: 'Los campos texto y personaje_id son obligatorios.' });
    }

    try {
        // Ejecuta la consulta SQL para actualizar la frase
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
/**
 * Elimina una frase por su ID.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.deleteFrase = async (req, res) => {
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL

    try {
        // Ejecuta la consulta SQL para eliminar la frase
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