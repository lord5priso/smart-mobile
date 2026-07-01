// api/add_report.js
const mysql = require('mysql2/promise');

export default async function handler(req, res) {
    // On n'accepte que les requêtes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Méthode non autorisée' });
    }

    try {
        // 1. Connexion à la base de données cloud Aiven
        // Remplis ici avec tes identifiants Aiven uniques
        const connection = await mysql.createConnection({
            host: 'PROVENANCE_DE_TON_ACCÈS_AIVEN.aivencloud.com',
            port: 11374,
            user: 'avnadmin',
            password: 'TON_MOT_DE_PASSE_AIVEN',
            database: 'defaultdb',
            ssl: { rejectUnauthorized: false } // Obligatoire pour Aiven
        });

        // 2. Récupération des données JSON envoyées par app.js
        const { lat, lng, description, mairie, photo } = req.body;

        // 3. Requête SQL d'insertion
        const query = 'INSERT INTO reports (lat, lng, description, mairie, photo) VALUES (?, ?, ?, ?, ?)';
        const values = [lat, lng, description, mairie, photo];

        await connection.execute(query, values);
        await connection.end();

        // 4. Réponse de succès
        return res.status(200).json({
            status: 'success',
            message: 'Signalement enregistré avec succès en JavaScript sur Vercel !'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Erreur serveur BDD : ' + error.message
        });
    }
}
