

const { pool } = require('../db'); 

/**
 * Crea una nueva frase en la base de datos.
 * @param {object} req 
 * @param {object} res
 */
exports.createFrase = async (req, res) => {
   
    const { texto, marca_tiempo, descripcion, personaje_id, capitulo_id } = req.body;

    
    if (!texto || !personaje_id) {
        return res.status(400).json({ message: 'Los campos texto y personaje_id son obligatorios.' });
    }

    try {
        
        const [result] = await pool.query(
            'INSERT INTO frases (texto, marca_tiempo, descripcion, personaje_id, capitulo_id) VALUES (?, ?, ?, ?, ?)',
            [texto, marca_tiempo, descripcion, personaje_id, capitulo_id]
        );

       
        res.status(201).json({ message: 'Frase insertada correctamente', id: result.insertId });
    } catch (error) {
        
        console.error('Error al insertar frase:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtiene todas las frases con información detallada de personaje y capítulo.
 * @param {object} req 
 * @param {object} res 
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
          
            capitulo: frase.capitulo_id ? {
                id: frase.capitulo_id,
                titulo: frase.capitulo_titulo
            } : null
        }));
        res.json(frases); 
    } catch (error) {
        console.error('Error al obtener todas las frases:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Función auxiliar para obtener una frase específica con detalles de personaje y capítulo.
 * @param {number} fraseId 
 * @returns {object|null} 
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
          
            capitulo: frase.capitulo_id ? {
                id: frase.capitulo_id,
                titulo: frase.capitulo_titulo
            } : null
        };
    } catch (error) {
       
        throw error;
    }
}

/**
 * Obtiene una frase específica por su ID.
 * @param {object} req 
 * @param {object} res 
 */
exports.getFraseById = async (req, res) => {
    const { id } = req.params;

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
 * @param {object} req 
 * @param {object} res 
 */
exports.updateFrase = async (req, res) => {
    const { id } = req.params; 
    const { texto, marca_tiempo, descripcion, personaje_id, capitulo_id } = req.body; 

  
    if (!texto || !personaje_id) {
        return res.status(400).json({ message: 'Los campos texto y personaje_id son obligatorios.' });
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
/**
 * Elimina una frase por su ID.
 * @param {object} req 
 * @param {object} res 
 */
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