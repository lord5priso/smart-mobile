// api/db.js
const mysql = require('mysql2/promise');

// Configuration de la connexion à ta base cloud Aiven
const pool = mysql.createPool({
    host: 'PROVENANCE_DE_TON_ACCÈS_AIVEN.aivencloud.com', // <-- Mets ton hôte Aiven ici
    port: 11374,
    user: 'avnadmin',
    password: 'TON_MOT_DE_PASSE_AIVEN',                 // <-- Mets ton mot de passe Aiven ici
    database: 'defaultdb',
    ssl: {
        rejectUnauthorized: false // Indispensable pour la sécurité SSL d'Aiven
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
