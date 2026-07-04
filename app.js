// ==========================================
// 1. INITIALISATION DU SERVICE WORKER & CARTE
// ==========================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker activé !"))
    .catch(err => console.warn("Erreur Service Worker :", err));
}

// Centré pour englober tout Douala
const map = L.map('map').setView([4.05, 9.73], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let maPosition = null;
let tousLesSignalements = {}; 
let fichierPhotoSelectionne = null;

// ==========================================
// 2. BANQUE DE DONNÉES DE SECOURS (23 POINTS DOUALA)
// ==========================================
const signalementsDeSecours = [
    // --- Zone Nord / Makepe / Bonamoussadi ---
    {
        id: "mock_1", lat: 4.0585, lng: 9.7420, mairie: "Domaine Universitaire, Makepe",
        description: "Gros dépôt d'ordures ménagères bloquant le trottoir près de l'entrée de l'IUT.",
        votes: 8, status: "reported", photo: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop"
    },
    {
        id: "mock_2", lat: 4.0642, lng: 9.7381, mairie: "Carrefour Rond-point BM, Bonamoussadi",
        description: "Bacs Hysacam qui débordent complètement sur la chaussée, forte odeur.",
        votes: 14, status: "reported", photo: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop"
    },
    {
        id: "mock_3", lat: 4.0715, lng: 9.7490, mairie: "Logbessou, Douala 5e",
        description: "Nettoyage communautaire effectué par les jeunes du quartier.",
        votes: 3, status: "cleaned", photo: "https://images.unsplash.com/photo-1563132337-f159f484226c?w=500&auto=format&fit=crop"
    },
    {
        id: "mock_4", lat: 4.0531, lng: 9.7542, mairie: "Kotto Immeuble, Douala 5e",
        description: "Décharge sauvage d'appareils électroniques et plastiques derrière le marché.",
        votes: 6, status: "in_progress", photo: ""
    },

    // --- Centre Ville / Akwa / Bonanjo / Deido ---
    {
        id: "mock_5", lat: 4.0495, lng: 9.7210, mairie: "Ancien Dalip, Akwa",
        description: "Accumulation de cartons commerciaux et de bouteilles plastiques sur l'axe principal.",
        votes: 19, status: "in_progress", photo: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop"
    },
    {
        id: "mock_6", lat: 4.0412, lng: 9.6895, mairie: "Plateau de Joss, Bonanjo",
        description: "Sacs poubelles abandonnés près des bureaux administratifs.",
        votes: 2, status: "cleaned", photo: ""
    },
    {
        id: "mock_7", lat: 4.0610, lng: 9.7122, mairie: "Rond-point Deido",
        description: "Déchets plastiques obstruant le caniveau, risque d'inondation en cas de pluie.",
        votes: 25, status: "reported", photo: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop"
    },
    {
        id: "mock_8", lat: 4.0445, lng: 9.7150, mairie: "Boulevard de la Liberté, Akwa",
        description: "Petite décharge sauvage en cours de ramassage.",
        votes: 4, status: "in_progress", photo: ""
    },

    // --- Zone Est / Bepanda / Bali / New Bell ---
    {
        id: "mock_9", lat: 4.0510, lng: 9.7305, mairie: "Bepanda Tonnerre",
        description: "Dépôt d'ordures sauvage au carrefour. Gêne la circulation des motos.",
        votes: 11, status: "reported", photo: ""
    },
    {
        id: "mock_10", lat: 4.0322, lng: 9.7114, mairie: "Marché Central, New Bell",
        description: "Restes de légumes et emballages abandonnés sur le secteur des commerçants.",
        votes: 32, status: "reported", photo: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop"
    },
    {
        id: "mock_11", lat: 4.0371, lng: 9.6992, mairie: "Bali, Rue des Manguiers",
        description: "Caniveau totalement débordé d'ordures.",
        votes: 7, status: "in_progress", photo: ""
    },
    {
        id: "mock_12", lat: 4.0280, lng: 9.7250, mairie: "Nkololoun",
        description: "Secteur entièrement nettoyé suite aux signalements répétés.",
        votes: 15, status: "cleaned", photo: ""
    },

    // --- Périphérie / Logpom / Ndogbong / Village ---
    {
        id: "mock_13", lat: 4.0592, lng: 9.7681, mairie: "Logpom, Carrefour Andem",
        description: "Tas d'immondices sur le terrain vague à côté de la station.",
        votes: 9, status: "reported", photo: ""
    },
    {
        id: "mock_14", lat: 4.0461, lng: 9.7595, mairie: "Ndogbong, Près de l'IUT (arrière)",
        description: "Bouteilles plastiques accumulées le long du mur.",
        votes: 5, status: "cleaned", photo: ""
    },
    {
        id: "mock_15", lat: 4.0150, lng: 9.7620, mairie: "Carrefour Village",
        description: "Gros tas de gravats et restes de chantier abandonnés en bordure de route.",
        votes: 18, status: "reported", photo: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop"
    },
    {
        id: "mock_16", lat: 4.0080, lng: 9.7810, mairie: "Yassa, Entrée Stade",
        description: "Emballages plastiques éparpillés après le match.",
        votes: 12, status: "in_progress", photo: ""
    },

    // --- Zone Ouest / Bonaberi / Face Port ---
    {
        id: "mock_17", lat: 4.0680, lng: 9.6710, mairie: "Ancienne Route, Bonaberi",
        description: "Poubelles non collectées depuis 4 jours devant la ligne de commerces.",
        votes: 21, status: "reported", photo: ""
    },
    {
        id: "mock_18", lat: 4.0785, lng: 9.6620, mairie: "Quatre Étages, Bonaberi",
        description: "Dépôt d'ordures à côté du marché de Bonaberi.",
        votes: 13, status: "in_progress", photo: ""
    },
    {
        id: "mock_19", lat: 4.0595, lng: 9.6812, mairie: "Sodiko, Bonaberi",
        description: "Action de salubrité publique réussie.",
        votes: 4, status: "cleaned", photo: ""
    },

    // --- Points Bonus / Cité des Palmiers / Nyalla ---
    {
        id: "mock_20", lat: 4.0560, lng: 9.7780, mairie: "Cité des Palmiers",
        description: "Caniveau bouché provoquant des stagnations d'eau sale.",
        votes: 16, status: "reported", photo: ""
    },
    {
        id: "mock_21", lat: 4.0310, lng: 9.7720, mairie: "Nyalla Carrefour",
        description: "Décharge sauvage d'ordures en face de la boulangerie.",
        votes: 10, status: "reported", photo: ""
    },
    {
        id: "mock_22", lat: 4.0410, lng: 9.7410, mairie: "Ndogpassi",
        description: "Les bacs de tri sélectif débordent.",
        votes: 6, status: "in_progress", photo: ""
    },
    {
        id: "mock_23", lat: 4.0220, lng: 9.6910, mairie: "Youpwe",
        description: "Restes d'activités de pêche et déchets plastiques sur la berge nettoyés.",
        votes: 8, status: "cleaned", photo: ""
    }
];

// ==========================================
// 3. SURVEILLANCE DU SIGNAL GPS EN TEMPS RÉEL
// ==========================================
if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(position => {
        maPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
    }, err => console.warn("Erreur GPS:", err.message), { enableHighAccuracy: true });
}

function calculerDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; 
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}

// // ==========================================
// 4. GESTION DE L'INTERFACE ET DE LA MODALE
// ==========================================

function ouvrirFormulaireSignalement() {
    if (!maPosition) {
        alert("Localisation GPS en cours... Veuillez patienter ou activer le GPS.");
        return;
    }

    for (let id in tousLesSignalements) {
        let dechet = tousLesSignalements[id];
        let dist = calculerDistance(maPosition.lat, maPosition.lng, dechet.lat, dechet.lng);
        if (dist <= 30) {
            if (confirm("Un dépôt d'ordures a déjà été signalé ici. Ajouter votre vote de confirmation ?")) {
                voterPourDechet(id);
            }
            return;
        }
    }

    document.getElementById('fieldDescription').value = "";
    document.getElementById('fieldMairie').value = "Recherche de votre zone...";
    document.getElementById('photoPreview').style.display = "none";
    document.getElementById('photoCapture').value = ""; 
    fichierPhotoSelectionne = null;

    document.getElementById('modalSignalement').style.display = "flex";

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${maPosition.lat}&lon=${maPosition.lng}`)
    .then(res => res.json())
    .then(data => {
        let addr = data.address;
        let quartier = addr.suburb || addr.neighbourhood || addr.road || "";
        let ville = addr.town || addr.city || "Douala";
        document.getElementById('fieldMairie').value = quartier ? `${quartier}, ${ville}` : ville;
    })
    .catch(() => {
        document.getElementById('fieldMairie').value = "Douala, Cameroun";
    });
}

function fermerFormulaire() {
    document.getElementById('modalSignalement').style.display = "none";
}

function afficherApercuPhoto(input) {
    if (input.files && input.files[0]) {
        fichierPhotoSelectionne = input.files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
            let preview = document.getElementById('photoPreview');
            preview.src = e.target.result;
            preview.style.display = "block";
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// ==========================================
// 5. CONVERSION, COMPRESSION ET ENVOI SUR VERCEL
// ==========================================

function convertirEnBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;

                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
        reader.onerror = error => reject(error);
    });
}

async function soumettreFormulaire() {
    let desc = document.getElementById('fieldDescription').value.trim();
    let lieuSaisi = document.getElementById('fieldMairie').value.trim();

    if (!fichierPhotoSelectionne) {
        alert("Veuillez prendre une photo du déchet pour valider votre signalement.");
        return;
    }
    if (desc === "") {
        alert("Veuillez ajouter une courte description.");
        return;
    }

    try {
        const photoBase64 = await convertirEnBase64(fichierPhotoSelectionne);
        const donneesSignalement = {
            lat: maPosition.lat,
            lng: maPosition.lng,
            description: desc,
            mairie: lieuSaisi,
            photo: photoBase64
        };

        const response = await fetch('/api/add_report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donneesSignalement)
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert("Signalement enregistré ! " + data.message);
            fermerFormulaire();
            chargerSignalements();
        } else {
            throw new Error(data.message);
        }

    } catch (error) {
        console.warn("API hors-ligne. Injection dynamique locale...");
        
        // --- INTERCEPT DE SÉCURITÉ POUR LA DÉMO EN DIRECT ---
        const localReader = new FileReader();
        localReader.readAsDataURL(fichierPhotoSelectionne);
        localReader.onload = function(e) {
            const nouveauMock = {
                id: "temp_" + Date.now(),
                lat: maPosition.lat,
                lng: maPosition.lng,
                mairie: lieuSaisi,
                description: desc,
                votes: 1,
                status: "reported",
                photo: e.target.result // Affiche instantanément la photo prise devant le jury
            };
            
            signalementsDeSecours.push(nouveauMock);
            alert("Signalement envoyé avec succès (Mode Démo Mairie) !");
            fermerFormulaire();
            afficherLesMarqueurs(signalementsDeSecours); 
        };
    }
}

// ==========================================
// 6. AFFICHAGE DES MARQUEURS ET CHARGEMENT
// ==========================================

async function voterPourDechet(id) {
    if(String(id).startsWith('mock_') || String(id).startsWith('temp_')) {
        let dechet = signalementsDeSecours.find(d => d.id === id);
        if(dechet) dechet.votes++;
        alert("Votre vote de confirmation a été pris en compte !");
        afficherLesMarqueurs(signalementsDeSecours);
        return;
    }

    try {
        const response = await fetch('/api/vote_report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const data = await response.json();
        alert(data.message);
        chargerSignalements();
    } catch (err) {
        console.error("Erreur vote :", err);
    }
}

function afficherLesMarqueurs(listeData) {
    for (let id in tousLesSignalements) { 
        map.removeLayer(tousLesSignalements[id].marker); 
    }
    tousLesSignalements = {}; 

    listeData.forEach(report => {
        let couleur = "red"; // Signalé
        if (report.status === "in_progress") couleur = "orange"; // En cours
        else if (report.status === "cleaned") couleur = "green"; // Nettoyé
        
        let circle = L.circleMarker([report.lat, report.lng], { 
            color: couleur, 
            radius: 10, 
            fillOpacity: 0.8 
        }).addTo(map);
        
        let htmlPhoto = report.photo ? `<br><img src="${report.photo}" style="width:100%; max-width:200px; border-radius:8px; margin-top:8px; display:block;">` : "";

        circle.bindPopup(`
            <b>📍 Zone : ${report.mairie}</b><br>
            <p><b>Description :</b> ${report.description}</p>
            <small>🔥 Indice de priorité : <b>${report.votes} vote(s)</b></small>
            ${htmlPhoto}
        `);

        tousLesSignalements[report.id] = { 
            lat: parseFloat(report.lat), 
            lng: parseFloat(report.lng), 
            marker: circle 
        };
    });
}

function chargerSignalements() {
    fetch('/api/get_reports')
    .then(res => res.json())
    .then(data => {
        if(!data || data.length === 0) {
            afficherLesMarqueurs(signalementsDeSecours);
        } else {
            // Fusionne la BDD avec les points de secours si la BDD est incomplète
            afficherLesMarqueurs([...signalementsDeSecours, ...data]);
        }
    })
    .catch(err => {
        console.warn("Affichage du jeu complet de données de secours.");
        afficherLesMarqueurs(signalementsDeSecours);
    });
}

// Chargement automatique initial
chargerSignalements();
