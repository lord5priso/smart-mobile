// api/clean_report.js
const pool = require('./db');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Méthode non autorisée' });
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ status: 'error', message: 'ID de signalement manquant' });
    }

    try {
        // Mise à jour du statut en base de données
        const query = "UPDATE reports SET status = 'cleaned' WHERE id = ?";
        await pool.execute(query, [id]);
        
        return res.status(200).json({ status: 'success', message: 'Le statut de la zone a été mis à jour avec succès !' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
