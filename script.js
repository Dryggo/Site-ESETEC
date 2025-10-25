// Quand la page est entièrement chargée
window.addEventListener("load", () => {
  // On récupère l'élément HTML où on va ajouter les formes
  const conteneur = document.getElementById("decorations");

  // Vérifie que l'élément existe bien
  if (!conteneur) {
    console.error("❌ L'élément avec id='decorations' est introuvable !");
    return;
  }

  const nbreFormes = 30; // Nombre de formes à générer
  const largeur = window.innerWidth - 80; // Largeur max pour les positions aléatoires
  const hauteur = document.body.scrollHeight - 40; // Hauteur totale de la page (même avec défilement)

  const formes = []; // Tableau où on stocke toutes les formes
  const typesDeFormes = ["demi-cercle", "cercle", "carre", "ovale"]; // Les types de formes possibles

  // Position actuelle de la souris (initialisée à 0)
  let souris = { x: 0, y: 0 };

  // Met à jour la position de la souris lorsqu'elle bouge
  document.addEventListener("mousemove", (e) => {
    souris.x = e.clientX;
    souris.y = e.clientY + window.scrollY; // Ajoute le défilement vertical
  });

  // Boucle pour créer chaque forme
  for (let i = 0; i <= nbreFormes; i++) {
    const forme = document.createElement("div"); // Crée une <div> pour la forme

    // Choisit un type de forme aléatoire
    const formeChoisie =
      typesDeFormes[Math.floor(Math.random() * typesDeFormes.length)];
    forme.classList.add(formeChoisie); // Applique la classe CSS correspondante

    // Position initiale aléatoire
    const x = Math.random() * largeur;
    const y = Math.random() * hauteur;
    forme.style.left = `${x}px`;
    forme.style.top = `${y}px`;

    // Donne une vitesse et direction aléatoire
    const speed = 0.3 + Math.random() * 1.7; // Vitesse entre 0.3 et 2.0
    const angle = Math.random() * 2 * Math.PI; // Angle en radians (0 à 360°)

    // Ajoute cette forme avec ses propriétés dans le tableau
    formes.push({
      element: forme, // Le div HTML
      x, // Position X
      y, // Position Y
      dx: Math.cos(angle) * speed, // Vitesse horizontale
      dy: Math.sin(angle) * speed, // Vitesse verticale
    });

    // Ajoute la forme dans la page
    conteneur.appendChild(forme);
  }

  // Fonction d’animation appelée à chaque image (~60 fois/seconde)
  function animer() {
    formes.forEach((f) => {
      // Met à jour la position de la forme
      f.x += f.dx;
      f.y += f.dy;

      // Rebonds si on touche les bords de la page
      if (f.x < 0 || f.x > largeur) f.dx *= -1;
      if (f.y < 0 || f.y > hauteur) f.dy *= -1;

      // ---- Interaction avec la souris ----

      // Calcule la distance entre la forme et la souris
      const distanceX = f.x - souris.x;
      const distanceY = f.y - souris.y;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      // Si la souris est proche de la forme
      if (distance < 100) {
        // Fuir : calculer l'angle opposé à la souris
        const angleFuite = Math.atan2(distanceY, distanceX);
        const intensite = (100 - distance) / 100; // Plus proche = plus fort

        // Applique une "poussée" loin de la souris
        f.dx += Math.cos(angleFuite) * intensite * 0.5;
        f.dy += Math.sin(angleFuite) * intensite * 0.5;

        // Limite la vitesse maximale pour rester fluide
        const vitesse = Math.sqrt(f.dx ** 2 + f.dy ** 2);
        const vitesseMax = 3;
        if (vitesse > vitesseMax) {
          f.dx = (f.dx / vitesse) * vitesseMax;
          f.dy = (f.dy / vitesse) * vitesseMax;
        }

        // Grossit temporairement
        f.element.style.transform = "scale(1.3)";
        f.element.style.transition = "transform 0.2s";
      } else {
        // Revient à sa taille normale
        f.element.style.transform = "scale(1)";
      }

      // Applique les nouvelles positions à l'élément HTML
      f.element.style.left = `${f.x}px`;
      f.element.style.top = `${f.y}px`;
    });

    // Appelle à nouveau la fonction pour continuer l’animation
    requestAnimationFrame(animer);
  }

  // Démarre l’animation
  animer();
});

// POUR LA VILIDATION ET AFFICHAGE DES AVIS
/* --- Sélection des éléments HTML --- */
const bouton_aimer = document.getElementById("bouton-aimer"); // Bouton "J’aime"
const bouton_aime_pas = document.getElementById("bouton-aime-pas"); // Bouton "J’aime pas"
const envoyerBtn = document.getElementById("envoyerBtn"); // Bouton "Envoyer"
const message = document.getElementById("message"); // Zone de message
const nom = document.getElementById("nom"); //zone de saisie
const commentaire = document.getElementById("commentaire"); // Zone de texte
const listeAvis = document.getElementById("listeAvis"); // Liste où on affiche les avis
const voirAvisBtn = document.getElementById("voirAvisBtn"); //pour voir les avis
const retourBtn = document.getElementById("retourBtn"); //pour retourner au nivau des saisies d'avis
const Voir_Formulaire = document.getElementById("voir-formulaire"); //pour la partie de voir avis
const liste_voir_avis = document.getElementById("liste-voir-avis"); //liste des vue
// const conteneur = document.getElementById("avis");

/* ======== Désactiver le bouton "Envoyer" au départ ======== */
envoyerBtn.disabled = true;
envoyerBtn.style.opacity = "0.6";
envoyerBtn.style.cursor = "not-allowed";

/* ======== Fonction pour activer/désactiver le bouton ======== */
function verifierConditions() {
  const aChoisi =
    bouton_aimer.classList.contains("selected") ||
    bouton_aime_pas.classList.contains("selected");
  const commentaireRempli = commentaire.value.trim() !== "";
  const nomRempli = nom.value.trim() !== "";

  if (aChoisi && commentaireRempli && nomRempli) {
    envoyerBtn.disabled = false;
    envoyerBtn.style.opacity = "1";
    envoyerBtn.style.cursor = "pointer";
  } else {
    envoyerBtn.disabled = true;
    envoyerBtn.style.opacity = "0.6";
    envoyerBtn.style.cursor = "not-allowed";
  }
}

/* --- Fonction pour afficher tous les avis enregistrés --- */
function afficherAvis() {
  const avisList = JSON.parse(localStorage.getItem("avisList") || "[]"); // Récupère la liste depuis le stockage
  listeAvis.innerHTML = ""; // Vide la liste avant de la remplir

  // Si aucun avis n’est enregistré
  if (avisList.length === 0) {
    listeAvis.innerHTML = "<li>Aucun avis pour le moment.</li>";
    return;
  }

  // Parcourt tous les avis à l’envers (le plus récent en haut)
  avisList
    .slice()
    .reverse()
    .forEach((a) => {
      const li = document.createElement("li"); // Crée un nouvel élément <li>
      const emoji =
        a.type === "like" ? "👍" : a.type === "dislike" ? "👎" : "🤔"; // Choisit un emoji selon le type
      // Contenu HTML du commentaire
      li.innerHTML = `<strong style=" color : #00CAFF; margin: 1%; font-size: 1.5em">${
        a.nom
      }</strong><br><span class="emoji" style=" margin-left: 4%; margin-bottom: 2%;">${emoji}</span> 
       <span style="color: #8C00FF; font-size: 1.25em; margin-bottom: 2%;"> ${
         a.commentaire || "(Pas de commentaire)"
       }</span><br>
        <span class="date" style="color: #232D3F; margin-left: 4%;">${
          a.date
        }</span>`;
      listeAvis.appendChild(li); // Ajoute l’élément à la liste
    });
}

/* --- Quand on clique sur le bouton "J’aime" --- */
bouton_aimer.addEventListener("click", () => {
  bouton_aimer.classList.toggle("selected"); // Active ou désactive le style "sélectionné"
  bouton_aime_pas.classList.remove("selected"); // Désactive l’autre bouton
  verifierConditions();
});

/* --- Quand on clique sur le bouton "J’aime pas" --- */
bouton_aime_pas.addEventListener("click", () => {
  bouton_aime_pas.classList.toggle("selected");
  bouton_aimer.classList.remove("selected");
  verifierConditions();
});
/* ======== Détection des changements de texte ======== */
commentaire.addEventListener("input", verifierConditions);

nom.addEventListener("input", verifierConditions);

/* ======== Animation shake si erreur ======== */
function animerErreur() {
  envoyerBtn.classList.add("shake");
  setTimeout(() => {
    envoyerBtn.classList.remove("shake");
  }, 400);
}

/* --- Quand on clique sur le bouton "Envoyer" --- */
envoyerBtn.addEventListener("click", () => {
  const nomVisiteur = nom.value.trim();
  const commentaireTexte = commentaire.value.trim();
  const aChoisiLike = bouton_aimer.classList.contains("selected");
  const aChoisiDislike = bouton_aime_pas.classList.contains("selected");

  // === Vérifications ===

  // verification de la saisie du nom
  if (nomVisiteur === "") {
    message.style.color = "red";
    message.textContent = "Veuillez entrez votre nom avant d’envoyer.";
    return;
  }

  // verification du choix de l'utilisateur
  if (!aChoisiLike && !aChoisiDislike) {
    message.style.color = "red";
    message.textContent = "Veuillez choisir 👍 ou 👎 avant d’envoyer.";
    return;
  }
  // verification de la saisie du commentaire
  if (commentaireTexte === "") {
    message.style.color = "red";
    message.textContent = "Veuillez écrire un commentaire avant d’envoyer.";
    return;
  }

  // Crée un objet "avis" avec le type, le commentaire et la date
  const avis = {
    type: aChoisiLike ? "like" : "dislike",
    nom: nomVisiteur,
    commentaire: commentaireTexte,
    date: new Date().toLocaleString(), // Date et heure locales
  };

  // Récupère la liste existante dans localStorage (ou une liste vide)
  let avisList = JSON.parse(localStorage.getItem("avisList") || "[]");

  // Ajoute le nouvel avis à la liste
  avisList.push(avis);

  // Enregistre à nouveau la liste complète dans localStorage
  localStorage.setItem("avisList", JSON.stringify(avisList));

  // Affiche un message de succès
  message.style.color = "green";
  message.textContent = "Merci pour votre avis ! 😊";

  // Réinitialise le formulaire
  nom.value = "";
  commentaire.value = "";
  bouton_aimer.classList.remove("selected");
  bouton_aime_pas.classList.remove("selected");
});

/* ======== Bouton "Voir les avis" ======== */
voirAvisBtn.addEventListener("click", () => {
  afficherAvis(); // On charge les avis

  // Animation : fait disparaître le formulaire
  Voir_Formulaire.classList.add("animation-disparition");
  setTimeout(() => {
    Voir_Formulaire.style.display = "none";
    Voir_Formulaire.classList.remove("animation-disparition");

    // Affiche la vue des avis avec animation
    liste_voir_avis.style.display = "block";
    liste_voir_avis.classList.add("fadeanimation-apparition");
  }, 400);
});

/* ======== Bouton "Retour" ======== */
retourBtn.addEventListener("click", () => {
  // Animation : fait disparaître la liste
  liste_voir_avis.classList.add("animation-disparition");
  setTimeout(() => {
    liste_voir_avis.style.display = "none";
    liste_voir_avis.classList.remove("animation-disparition");

    // Réaffiche le formulaire avec animation
    Voir_Formulaire.style.display = "block";
    Voir_Formulaire.classList.add("animation-apparition");
  }, 400);
});

/* --- Quand la page se charge, on affiche déjà les anciens avis --- */
afficherAvis();
