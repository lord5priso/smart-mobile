// api/db.js
const mysql = require('mysql2/promise');

// Configuration de la connexion à ta base cloud Aiven
const pool = mysql.createPool({
    host: 'mysql-20b10a5-smartwaste-fb237.a.aivencloud.com', // <-- Mets ton hôte Aiven ici
    port: 15667,
    user: 'avnadmin',
    password: 'AVNS_Jyu7rxxl9c9ZMlRQ3om',                 // <-- Mets ton mot de passe Aiven ici
    database: 'defaultdb',
    ssl: {
        rejectUnauthorized: false // Indispensable pour la sécurité SSL d'Aiven
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
