// api/mairie_reports.js
const pool = require('./db');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ status: 'error', message: 'Méthode non autorisée' });
    }

    const { mairie } = req.query;

    if (!mairie) {
        return res.status(400).json({ status: 'error', message: 'Paramètre Mairie manquant' });
    }

    try {
        // Recherche des rapports contenant le nom de la mairie (ex: "Douala 5") dans le champ mairie
        const query = 'SELECT * FROM reports WHERE mairie LIKE ? ORDER BY votes DESC, id DESC';
        const [rows] = await pool.execute(query, [`%${mairie}%`]);
        
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}

