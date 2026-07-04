// ==========================================
// 1. DATA FIXE DE SECOURS (23 POINTS REALS DOUALA)
// ==========================================
const signalementsMairie = [
    // --- Zone Nord / Makepe / Bonamoussadi (Douala 5) ---
    { id: "mock_1", lat: 4.0585, lng: 9.7420, mairie: "Domaine Universitaire, Makepe", description: "Gros dépôt d'ordures ménagères bloquant le trottoir près de l'entrée de l'IUT.", votes: 8, status: "reported", photo: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop" },
    { id: "mock_2", lat: 4.0642, lng: 9.7381, mairie: "Carrefour Rond-point BM, Bonamoussadi", description: "Bacs Hysacam qui débordent complètement sur la chaussée, forte odeur.", votes: 14, status: "reported", photo: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop" },
    { id: "mock_3", lat: 4.0715, lng: 9.7490, mairie: "Logbessou, Douala 5e", description: "Nettoyage communautaire effectué par les jeunes du quartier.", votes: 3, status: "cleaned", photo: "https://images.unsplash.com/photo-1563132337-f159f484226c?w=500&auto=format&fit=crop" },
    { id: "mock_4", lat: 4.0531, lng: 9.7542, mairie: "Kotto Immeuble, Douala 5e", description: "Décharge sauvage d'appareils électroniques et plastiques derrière le marché.", votes: 6, status: "in_progress", photo: "" },

    // --- Centre Ville / Akwa / Bonanjo / Deido ---
    { id: "mock_5", lat: 4.0495, lng: 9.7210, mairie: "Ancien Dalip, Akwa", description: "Accumulation de cartons commerciaux et de bouteilles plastiques sur l'axe principal.", votes: 19, status: "in_progress", photo: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop" },
    { id: "mock_6", lat: 4.0412, lng: 9.6895, mairie: "Plateau de Joss, Bonanjo", description: "Sacs poubelles abandonnés près des bureaux administratifs.", votes: 2, status: "cleaned", photo: "" },
    { id: "mock_7", lat: 4.0610, lng: 9.7122, mairie: "Rond-point Deido", description: "Déchets plastiques obstruant le caniveau, risque d'inondation en cas de pluie.", votes: 25, status: "reported", photo: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop" },
    { id: "mock_8", lat: 4.0445, lng: 9.7150, mairie: "Boulevard de la Liberté, Akwa", description: "Petite décharge sauvage en cours de ramassage.", votes: 4, status: "in_progress", photo: "" },

    // --- Zone Est / Bepanda / Bali / New Bell ---
    { id: "mock_9", lat: 4.0510, lng: 9.7305, mairie: "Bepanda Tonnerre", description: "Dépôt d'ordures sauvage au carrefour. Gêne la circulation des motos.", votes: 11, status: "reported", photo: "" },
    { id: "mock_10", lat: 4.0322, lng: 9.7114, mairie: "Marché Central, New Bell", description: "Restes de légumes et emballages abandonnés sur le secteur des commerçants.", votes: 32, status: "reported", photo: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop" },
    { id: "mock_11", lat: 4.0371, lng: 9.6992, mairie: "Bali, Rue des Manguiers", description: "Caniveau totalement débordé d'ordures.", votes: 7, status: "in_progress", photo: "" },
    { id: "mock_12", lat: 4.0280, lng: 9.7250, mairie: "Nkololoun", description: "Secteur entièrement nettoyé suite aux signalements répétés.", votes: 15, status: "cleaned", photo: "" },

    // --- Périphérie / Logpom / Ndogbong / Village ---
    { id: "mock_13", lat: 4.0592, lng: 9.7681, mairie: "Logpom, Carrefour Andem", description: "Tas d'immondices sur le terrain vague à côté de la station.", votes: 9, status: "reported", photo: "" },
    { id: "mock_14", lat: 4.0461, lng: 9.7595, mairie: "Ndogbong, Près de l'IUT (arrière)", description: "Bouteilles plastiques accumulées le long du mur.", votes: 5, status: "cleaned", photo: "" },
    { id: "mock_15", lat: 4.0150, lng: 9.7620, mairie: "Carrefour Village", description: "Gros tas de gravats et restes de chantier abandonnés en bordure de route.", votes: 18, status: "reported", photo: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop" },
    { id: "mock_16", lat: 4.0080, lng: 9.7810, mairie: "Yassa, Entrée Stade", description: "Emballages plastiques éparpillés après le match.", votes: 12, status: "in_progress", photo: "" },

    // --- Zone Ouest / Bonaberi ---
    { id: "mock_17", lat: 4.0680, lng: 9.6710, mairie: "Ancienne Route, Bonaberi", description: "Poubelles non collectées devant la ligne de commerces.", votes: 21, status: "reported", photo: "" },
    { id: "mock_18", lat: 4.0785, lng: 9.6620, mairie: "Quatre Étages, Bonaberi", description: "Dépôt d'ordures à côté du marché de Bonaberi.", votes: 13, status: "in_progress", photo: "" },
    { id: "mock_19", lat: 4.0595, lng: 9.6812, mairie: "Sodiko, Bonaberi", description: "Action de salubrité publique réussie.", votes: 4, status: "cleaned", photo: "" },

    // --- Cité des Palmiers / Nyalla / Ndogpassi / Youpwe ---
    { id: "mock_20", lat: 4.0560, lng: 9.7780, mairie: "Cité des Palmiers", description: "Caniveau bouché provoquant des stagnations d'eau sale.", votes: 16, status: "reported", photo: "" },
    { id: "mock_21", lat: 4.0310, lng: 9.7720, mairie: "Nyalla Carrefour", description: "Décharge sauvage d'ordures en face de la boulangerie.", votes: 10, status: "reported", photo: "" },
    { id: "mock_22", lat: 4.0410, lng: 9.7410, mairie: "Ndogpassi", description: "Les bacs de tri sélectif débordent.", votes: 6, status: "in_progress", photo: "" },
    { id: "mock_23", lat: 4.0220, lng: 9.6910, mairie: "Youpwe", description: "Restes d'activités de pêche et déchets plastiques sur la berge nettoyés.", votes: 8, status: "cleaned", photo: "" }
];

// Variable globale pour suivre l'onglet sélectionné
let communeFiltreActuelle = 'tous';

// ==========================================
// 2. LOGIQUE DE FILTRAGE DES COMMUNE
// ==========================================
function filtrerParCommune(commune) {
    communeFiltreActuelle = commune;
    
    // Gérer l'état graphique actif des boutons
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    
    if(commune === 'tous') document.getElementById('btn-tous').classList.add('active');
    if(commune === 'douala 5') document.getElementById('btn-douala5').classList.add('active');
    if(commune === 'akwa') document.getElementById('btn-akwa').classList.add('active');
    if(commune === 'bonaberi') document.getElementById('btn-bonaberi').classList.add('active');

    // Recharger la liste filtrée
    afficherSignalementsMairie();
}

// ==========================================
// 3. FONCTION PRINCIPALE D'AFFICHAGE
// ==========================================
function afficherSignalementsMairie() {
    const conteneur = document.getElementById("listeSignalementsMairie");
    if (!conteneur) return;

    conteneur.innerHTML = ""; // Clear la zone

    // Filtrer selon la commune cliquée
    const signalementsFilstres = signalementsMairie.filter(report => {
        if (communeFiltreActuelle === 'tous') return true;
        
        const zone = report.mairie.toLowerCase();
        if (communeFiltreActuelle === 'douala 5') {
            return zone.includes('makepe') || zone.includes('bonamoussadi') || zone.includes('logbessou') || zone.includes('kotto') || zone.includes('douala 5');
        }
        if (communeFiltreActuelle === 'akwa') {
            return zone.includes('akwa') || zone.includes('bonanjo') || zone.includes('deido');
        }
        if (communeFiltreActuelle === 'bonaberi') {
            return zone.includes('bonaberi') || zone.includes('sodiko');
        }
        return false;
    });

    // Cas où aucun signalement ne correspond à l'onglet
    if (signalementsFilstres.length === 0) {
        conteneur.innerHTML = `<div class="empty-message">Aucune alerte active dans cette zone pour le moment.</div>`;
        return;
    }

    // Générer les lignes HTML stylisées
    signalementsFilstres.forEach(report => {
        let statutTexte = "🔴 À Traiter";
        let classeBadge = "badge-reported";
        if (report.status === "in_progress") {
            statutTexte = "🟠 En cours";
            classeBadge = "badge-progress";
        } else if (report.status === "cleaned") {
            statutTexte = "🟢 Nettoyé";
            classeBadge = "badge-cleaned";
        }

        // Image générique si le mock n'en a pas
        let imageSrc = report.photo || "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop";

        const cardHtml = `
            <div class="card-signalement" style="border-left: 6px solid ${report.status === 'cleaned' ? '#2ecc71' : report.status === 'in_progress' ? '#f39c12' : '#e74c3c'}">
                <img src="${imageSrc}" class="card-img" alt="Déchet">
                <div class="card-body">
                    <h3 class="card-title">📍 ${report.mairie}</h3>
                    <p class="card-desc">${report.description}</p>
                    <div class="card-meta">
                        <span class="badge ${classeBadge}">${statutTexte}</span>
                        <span class="priority-count">⛔ Priorité : <b>${report.votes} votes</b></span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-action btn-take-charge" onclick="changerStatut('${report.id}', 'in_progress')">Prendre en charge</button>
                    <button class="btn-action btn-validate" onclick="changerStatut('${report.id}', 'cleaned')">Valider Nettoyage</button>
                </div>
            </div>
        `;
        conteneur.innerHTML += cardHtml;
    });
}

// ==========================================
// 4. ACTION INTERACTIVE (CHANGEMENT STATUT)
// ==========================================
function changerStatut(id, nouveauStatut) {
    let dechet = signalementsMairie.find(d => d.id === id);
    if (dechet) {
        dechet.status = nouveauStatut;
        // Rafraîchir instantanément l'écran de manière fluide
        afficherSignalementsMairie();
    }
}

// Lancement au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    afficherSignalementsMairie();
});

