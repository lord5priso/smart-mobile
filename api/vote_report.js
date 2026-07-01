// api/vote_report.js
const pool = require('./db');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Méthode non autorisée' });
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ status: 'error', message: 'ID du signalement manquant.' });
    }

    try {
        // Incrémentation du nombre de votes (+1) pour le signalement donné
        const query = 'UPDATE reports SET votes = votes + 1 WHERE id = ?';
        await pool.execute(query, [id]);

        return res.status(200).json({
            status: 'success',
            message: 'Votre vote a bien été pris en compte ! Priorité augmentée.'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
