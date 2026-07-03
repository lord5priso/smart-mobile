// ==========================================
// 1. INITIALISATION DU SERVICE WORKER & CARTE
// ==========================================

// Enregistrement du Service Worker pour la PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker activé !"))
    .catch(err => console.warn("Erreur Service Worker :", err));
}

// Initialisation de la carte Leaflet centrée sur Douala
const map = L.map('map').setView([4.05, 9.7], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let maPosition = null;
let tousLesSignalements = {}; 
let fichierPhotoSelectionne = null;

// ==========================================
// 2. SURVEILLANCE DU SIGNAL GPS EN TEMPS RÉEL
// ==========================================
if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(position => {
        maPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
    }, err => console.warn("Erreur GPS:", err.message), { enableHighAccuracy: true });
}

// Formule de Haversine pour calculer la distance en mètres entre deux points GPS
function calculerDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Rayon de la Terre en mètres
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

// ==========================================
// 3. GESTION DE L'INTERFACE ET DE LA MODALE
// ==========================================

function ouvrirFormulaireSignalement() {
    if (!maPosition) {
        alert("Localisation GPS en cours... Veuillez patienter ou activer le GPS de votre smartphone.");
        return;
    }

    // Vérification anti-doublon (bloque si un déchet est déjà signalé à moins de 30 mètres)
    for (let id in tousLesSignalements) {
        let dechet = tousLesSignalements[id];
        let dist = calculerDistance(maPosition.lat, maPosition.lng, dechet.lat, dechet.lng);
        if (dist <= 30) {
            if (confirm("Un dépôt d'ordures a déjà été signalé ici. Cliquez sur OK pour ajouter votre vote de confirmation (+1 vote).")) {
                voterPourDechet(id);
            }
            return;
        }
    }

    // Réinitialisation complète des champs du formulaire
    document.getElementById('fieldDescription').value = "";
    document.getElementById('fieldMairie').value = "Recherche de votre zone...";
    document.getElementById('photoPreview').style.display = "none";
    document.getElementById('photoCapture').value = ""; // Reset du fichier
    fichierPhotoSelectionne = null;

    // Affichage de la boîte modale
    document.getElementById('modalSignalement').style.display = "flex";

    // Reverse Geocoding automatique : interroge OpenStreetMap pour pré-remplir le quartier
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${maPosition.lat}&lon=${maPosition.lng}`)
    .then(res => res.json())
    .then(data => {
        let addr = data.address;
        let quartier = addr.suburb || addr.neighbourhood || addr.road || "";
        let ville = addr.town || addr.city || "Douala";
        
        let emplacementApparent = quartier ? `${quartier}, ${ville}` : ville;
        document.getElementById('fieldMairie').value = emplacementApparent;
    })
    .catch(() => {
        document.getElementById('fieldMairie').value = "Douala, Cameroun";
    });
}

function fermerFormulaire() {
    document.getElementById('modalSignalement').style.display = "none";
}

// Déclenchée automatiquement lorsque le fichier image est choisi/capturé
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
// 4. CONVERSION, COMPRESSION ET ENVOI SUR VERCEL
// ==========================================

// Fonction modifiée : Compresse et redimensionne via Canvas pour respecter la limite de Vercel (< 4.5 Mo)
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

                // Limite haute de résolution (1024px maximum pour le côté le plus grand)
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compression au format JPEG avec une qualité de 70%
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
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
        alert("Veuillez ajouter une courte description des déchets.");
        return;
    }

    try {
        // 1. Conversion et compression automatique de la photo en texte Base64 léger
        const photoBase64 = await convertirEnBase64(fichierPhotoSelectionne);

        // 2. Préparation de l'objet de données
        const donneesSignalement = {
            lat: maPosition.lat,
            lng: maPosition.lng,
            description: desc,
            mairie: lieuSaisi,
            photo: photoBase64
        };

        // 3. Envoi vers notre API Node.js Serverless sur Vercel
        const response = await fetch('/api/add_report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donneesSignalement)
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert("Signalement enregistré ! " + data.message);
            fermerFormulaire();
            chargerSignalements(); // Met à jour la carte immédiatement
        } else {
            alert("Erreur retournée par l'API : " + data.message);
        }

    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
        alert("Impossible de contacter le serveur Vercel.");
    }
}

// ==========================================
// 5. CHARGEMENT ET REQUÊTES DE SÉCURITÉ
// ==========================================

async function voterPourDechet(id) {
    try {
        const response = await fetch('/api/vote_report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const data = await response.json();
        alert(data.message);
        chargerSignalements(); // Rafraîchir les compteurs visuels
    } catch (err) {
        console.error("Erreur lors du vote :", err);
    }
}

function chargerSignalements() {
    fetch('/api/get_reports')
    .then(res => res.json())
    .then(data => {
        // Nettoyage des anciens marqueurs pour éviter les doublons visuels
        for (let id in tousLesSignalements) { 
            map.removeLayer(tousLesSignalements[id].marker); 
        }
        tousLesSignalements = {}; 

        data.forEach(report => {
            // Attribution de la couleur selon le statut du rapport
            let couleur = "red";
            if (report.status === "in_progress") couleur = "orange";
            else if (report.status === "cleaned") couleur = "green";
            
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
    })
    .catch(err => console.error("Erreur de chargement des marqueurs :", err));
}

// Lancement automatique au chargement initial de l'application
chargerSignalements();

// Rafraîchissement automatique de la carte toutes les 15 secondes
setInterval(chargerSignalements, 15000);
        
