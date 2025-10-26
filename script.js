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
const bouton_aimer = document.getElementById("bouton-aimer");
const bouton_aime_pas = document.getElementById("bouton-aime-pas");
const envoyerBtn = document.getElementById("envoyerBtn");
const message = document.getElementById("message");
const nom = document.getElementById("nom");
const commentaire = document.getElementById("commentaire");
const listeAvis = document.getElementById("listeAvis");
const voirAvisBtn = document.getElementById("voirAvisBtn");
const retourBtn = document.getElementById("retourBtn");
const Voir_Formulaire = document.getElementById("voir-formulaire");
const liste_voir_avis = document.getElementById("liste-voir-avis");
const form = document.getElementById("form-identification");

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
  const avisList = JSON.parse(localStorage.getItem("avisList") || "[]");
  listeAvis.innerHTML = "";

  if (avisList.length === 0) {
    listeAvis.innerHTML = "<li>Aucun avis pour le moment.</li>";
    return;
  }

  avisList
    .slice()
    .reverse()
    .forEach((a) => {
      const li = document.createElement("li");
      const emoji =
        a.type === "like" ? "👍" : a.type === "dislike" ? "👎" : "🤔";
      li.innerHTML = `<strong style=" color : #00CAFF; margin: 1%; font-size: 1.5em">${
        a.nom
      }</strong><br><span class="emoji" style=" margin-left: 4%; margin-bottom: 2%;">${emoji}</span> 
       <span style="color: #8C00FF; font-size: 1.25em; margin-bottom: 2%;">${
         a.commentaire || "(Pas de commentaire)"
       }</span><br>
        <span class="date" style="color: #232D3F; margin-left: 4%;">${
          a.date
        }</span>`;
      listeAvis.appendChild(li);
    });
}

/* --- Sélection des boutons --- */
bouton_aimer.addEventListener("click", (e) => {
  e.preventDefault(); // empêche le clic de soumettre le formulaire
  bouton_aimer.classList.toggle("selected");
  bouton_aime_pas.classList.remove("selected");
  verifierConditions();
});

bouton_aime_pas.addEventListener("click", (e) => {
  e.preventDefault();
  bouton_aime_pas.classList.toggle("selected");
  bouton_aimer.classList.remove("selected");
  verifierConditions();
});

commentaire.addEventListener("input", verifierConditions);
nom.addEventListener("input", verifierConditions);

/* --- Quand on soumet le formulaire --- */
form.addEventListener("submit", (e) => {
  e.preventDefault(); // On empêche l’envoi auto le temps de vérifier

  const nomVisiteur = nom.value.trim();
  const commentaireTexte = commentaire.value.trim();
  const aChoisiLike = bouton_aimer.classList.contains("selected");
  const aChoisiDislike = bouton_aime_pas.classList.contains("selected");

  // Vérifications
  if (nomVisiteur === "") {
    message.style.color = "red";
    message.textContent = "Veuillez entrer votre nom avant d’envoyer.";
    return;
  }

  if (!aChoisiLike && !aChoisiDislike) {
    message.style.color = "red";
    message.textContent = "Veuillez choisir 👍 ou 👎 avant d’envoyer.";
    return;
  }

  if (commentaireTexte === "") {
    message.style.color = "red";
    message.textContent = "Veuillez écrire un commentaire avant d’envoyer.";
    return;
  }

  // Création de l’avis
  const avis = {
    type: aChoisiLike ? "like" : "dislike",
    nom: nomVisiteur,
    commentaire: commentaireTexte,
    date: new Date().toLocaleString(),
  };

  // Sauvegarde locale
  let avisList = JSON.parse(localStorage.getItem("avisList") || "[]");
  avisList.push(avis);
  localStorage.setItem("avisList", JSON.stringify(avisList));

  // Ajout d’un champ caché pour le type de vote (envoyé à Web3Forms)
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "avis_type";
  hiddenInput.value = aChoisiLike ? "👍 J'aime" : "👎 J'aime pas";
  form.appendChild(hiddenInput);

  // ✅ Envoi du formulaire vers Web3Forms
  form.submit();

  // Message de confirmation
  message.style.color = "green";
  message.textContent = "Merci pour votre avis ! 😊";

  // Réinitialisation
  nom.value = "";
  commentaire.value = "";
  bouton_aimer.classList.remove("selected");
  bouton_aime_pas.classList.remove("selected");
  verifierConditions();
});

/* --- Voir les avis --- */
voirAvisBtn.addEventListener("click", () => {
  afficherAvis();
  Voir_Formulaire.classList.add("animation-disparition");
  setTimeout(() => {
    Voir_Formulaire.style.display = "none";
    Voir_Formulaire.classList.remove("animation-disparition");
    liste_voir_avis.style.display = "block";
    liste_voir_avis.classList.add("fadeanimation-apparition");
  }, 400);
});

/* --- Retour --- */
retourBtn.addEventListener("click", () => {
  liste_voir_avis.classList.add("animation-disparition");
  setTimeout(() => {
    liste_voir_avis.style.display = "none";
    liste_voir_avis.classList.remove("animation-disparition");
    Voir_Formulaire.style.display = "block";
    Voir_Formulaire.classList.add("animation-apparition");
  }, 400);
});

/* --- Chargement initial --- */
afficherAvis();


