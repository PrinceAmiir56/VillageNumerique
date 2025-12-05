// ----- ÉTAT DU JEU -----
const gameState = {
  inclusion: 50,
  responsibility: 50,
  durability: 50,
  dependence: 50,
  currentLocationId: null,
  history: [],
  visitedLocations: {
    salleInfo: false,
    nuage: false,
    fablab: false,
    maisonCommune: false
  }
};

const locations = {
  salleInfo: {
    id: "salleInfo",
    label: "Salle info",
    sceneId: "osChoice"
  },
  nuage: {
    id: "nuage",
    label: "Nuage du village",
    sceneId: "cloudChoice"
  },
  fablab: {
    id: "fablab",
    label: "Fablab / Réemploi",
    sceneId: "hardwareChoice"
  },
  maisonCommune: {
    id: "maisonCommune",
    label: "Maison commune",
    sceneId: "communityChoice"
  }
};

const scenes = {
  osChoice: {
    id: "osChoice",
    title: "La salle info : quel système ?",
    subtitle: "David contre Goliath numérique",
    text: `
La fin du support de Windows 10 approche. La salle info ressemble à un champ de bataille :
machines fatiguées, licences hors de prix, élèves stressés avant leurs examens.

En tant qu’établissement, que décides-tu pour les postes de travail ?
    `,
    choices: [
      {
        text: "Tout passer sur des PC neufs avec Windows 11 et abonnements complets",
        effects: { inclusion: 0, responsibility: -5, durability: -10, dependence: +20 },
        impact: "Confort immédiat, mais forte dépendance et peu de sobriété."
      },
      {
        text: "Installer une distribution Linux libre sur le matériel existant",
        effects: { inclusion: +5, responsibility: +10, durability: +15, dependence: -15 },
        impact: "Réemploi, autonomie technologique et moindre coût."
      },
      {
        text: "Stratégie mixte : quelques licences, quelques postes Linux",
        effects: { inclusion: +3, responsibility: +3, durability: +5, dependence: +5 },
        impact: "Transition plus douce, mais dépendance encore présente."
      }
    ]
  },

  cloudChoice: {
    id: "cloudChoice",
    title: "Le nuage du village",
    subtitle: "Où vont les données ?",
    text: `
Les enseignants veulent un espace de travail partagé. Les élèves réclament un nuage
pour déposer leurs devoirs et projets.

En tant qu’établissement, vers quel type de solution te tournes-tu ?
    `,
    choices: [
      {
        text: "Tout confier à une grande plateforme américaine très connue",
        effects: { inclusion: +5, responsibility: -10, durability: -5, dependence: +20 },
        impact: "Simple à déployer, mais très dépendant et peu souverain."
      },
      {
        text: "Mettre en place une solution libre auto-hébergée",
        effects: { inclusion: +5, responsibility: +15, durability: +5, dependence: -10 },
        impact: "Plus de maîtrise des données, mais demande un effort d’administration."
      },
      {
        text: "Utiliser un cloud éducatif / collectivités déjà souverain",
        effects: { inclusion: +5, responsibility: +10, durability: +5, dependence: -5 },
        impact: "Compromis solide pour la souveraineté et la simplicité."
      }
    ]
  },

  hardwareChoice: {
    id: "hardwareChoice",
    title: "Fablab / Réemploi",
    subtitle: "Obsolescence ou intelligence collective",
    text: `
Une pièce du collège est remplie de vieux PC, tablettes et écrans. Les éco-délégués protestent :
« On ne peut pas juste tout jeter ! ».

Quelles solutions mets-tu en place ?
    `,
    choices: [
      {
        text: "Tout jeter et racheter du matériel flambant neuf",
        effects: { durability: -20, responsibility: -10, dependence: +10 },
        impact: "Rapide, mais désastreux pour l’écologie et le budget."
      },
      {
        text: "Créer un atelier de reconditionnement avec les élèves et un fablab local",
        effects: { inclusion: +10, responsibility: +10, durability: +20, dependence: -5 },
        impact: "Pédagogique, écologique et très NIRD."
      },
      {
        text: "Conserver une partie, donner le reste à une association de réemploi",
        effects: { inclusion: +5, responsibility: +10, durability: +10 },
        impact: "Réemploi solidaire et bonne image pour l’établissement."
      }
    ]
  },

  communityChoice: {
    id: "communityChoice",
    title: "Maison commune NIRD",
    subtitle: "Une démarche portée par tout le village",
    text: `
La démarche NIRD ne fonctionne que si tout le monde s’implique :
élèves, enseignants, familles, mairie, associations...

Comment fais-tu vivre cette communauté NIRD ?
    `,
    choices: [
      {
        text: "Organiser des ateliers \"Linux & numérique responsable\" avec les élèves",
        effects: { inclusion: +15, responsibility: +10, dependence: -5 },
        impact: "Autonomie, culture numérique et empowerment des jeunes."
      },
      {
        text: "Créer un simple site vitrine pour communiquer (sans vraie participation)",
        effects: { inclusion: +3, responsibility: 0, durability: 0 },
        impact: "Communication basique, mais peu d’impact réel."
      },
      {
        text: "Monter un comité NIRD avec mairie, parents, associations et élèves",
        effects: { inclusion: +10, responsibility: +15, durability: +5, dependence: -5 },
        impact: "Co-construction locale forte, démarche partagée."
      }
    ]
  }
};

const sceneTitleEl = document.getElementById("sceneTitle");
const sceneSubtitleEl = document.getElementById("sceneSubtitle");
const sceneTextEl = document.getElementById("sceneText");
const choicesEl = document.getElementById("choices");
const logEl = document.getElementById("log");
const restartBtn = document.getElementById("restartBtn");

const mapTiles = document.querySelectorAll(".map-tile");

const statElements = {
  inclusion: {
    valueEl: document.getElementById("stat-inclusion-value"),
    barEl: document.getElementById("stat-inclusion-bar")
  },
  responsibility: {
    valueEl: document.getElementById("stat-responsibility-value"),
    barEl: document.getElementById("stat-responsibility-bar")
  },
  durability: {
    valueEl: document.getElementById("stat-durability-value"),
    barEl: document.getElementById("stat-durability-bar")
  },
  dependence: {
    valueEl: document.getElementById("stat-dependence-value"),
    barEl: document.getElementById("stat-dependence-bar")
  }
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function applyEffects(effects) {
  Object.keys(effects).forEach(key => {
    if (key in gameState) {
      gameState[key] = clamp(gameState[key] + effects[key]);
    }
  });
  updateStatsUI();
}

function updateStatsUI() {
  statElements.inclusion.valueEl.textContent = gameState.inclusion;
  statElements.responsibility.valueEl.textContent = gameState.responsibility;
  statElements.durability.valueEl.textContent = gameState.durability;
  statElements.dependence.valueEl.textContent = gameState.dependence;

  statElements.inclusion.barEl.style.width = gameState.inclusion + "%";
  statElements.responsibility.barEl.style.width = gameState.responsibility + "%";
  statElements.durability.barEl.style.width = gameState.durability + "%";
  statElements.dependence.barEl.style.width = gameState.dependence + "%";
}

function addLogEntry(locationId, scene, choice) {
  const entry = document.createElement("div");
  entry.className = "log-entry";

  const locationLabel = locations[locationId]?.label || "Lieu";

  const title = document.createElement("div");
  title.className = "log-entry-title";
  title.textContent = `${locationLabel} — ${scene.title}`;

  const chosen = document.createElement("div");
  chosen.className = "log-entry-choice";
  chosen.textContent = "→ " + choice.text;

  entry.appendChild(title);
  entry.appendChild(chosen);

  if (choice.impact) {
    const impact = document.createElement("div");
    impact.className = "log-entry-impact";
    impact.textContent = "⚙ " + choice.impact;
    entry.appendChild(impact);
  }

  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

function setActiveLocation(locationId) {
  gameState.currentLocationId = locationId;
  mapTiles.forEach(tile => {
    const id = tile.getAttribute("data-location-id");
    tile.classList.toggle("active", id === locationId);
  });
}

function updateMapStatuses() {
  Object.keys(locations).forEach(id => {
    const visited = gameState.visitedLocations[id];
    const statusEl = document.getElementById(`status-${id}`);
    const tile = document.querySelector(`.map-tile[data-location-id="${id}"]`);
    if (!statusEl || !tile) return;

    if (visited) {
      statusEl.textContent = "✅";
      tile.classList.add("visited");
    } else {
      statusEl.textContent = "⚪";
      tile.classList.remove("visited");
    }
  });
}

function allLocationsVisited() {
  return Object.values(gameState.visitedLocations).every(v => v === true);
}

function renderSceneFromLocation(locationId) {
  const location = locations[locationId];
  if (!location) return;

  const scene = scenes[location.sceneId];
  if (!scene) return;

  setActiveLocation(locationId);

  sceneTitleEl.textContent = scene.title;
  sceneSubtitleEl.textContent = scene.subtitle || "";
  sceneTextEl.innerHTML = scene.text;

  choicesEl.innerHTML = "";

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "btn btn-primary";

    const label = document.createElement("span");
    label.textContent = choice.text;
    btn.appendChild(label);

    if (choice.impact) {
      const impactSpan = document.createElement("span");
      impactSpan.className = "choice-impact";
      impactSpan.textContent = "ℹ " + choice.impact;
      btn.appendChild(impactSpan);
    }

    btn.addEventListener("click", () => {
      handleChoice(locationId, scene, choice);
    });

    choicesEl.appendChild(btn);
  });
}

function handleChoice(locationId, scene, choice) {
  applyEffects(choice.effects || {});
  addLogEntry(locationId, scene, choice);

  gameState.history.push({
    locationId,
    sceneId: scene.id,
    choiceText: choice.text
  });

  gameState.visitedLocations[locationId] = true;
  updateMapStatuses();

  if (allLocationsVisited()) {
    showEnding();
  } else {
    showMapPromptAfterDecision(locationId);
  }
}

function showMapPromptAfterDecision(locationId) {
  const label = locations[locationId]?.label || "Lieu";
  sceneTitleEl.textContent = "Retour à la carte du village";
  sceneSubtitleEl.textContent = "Tes décisions commencent à transformer le village.";
  sceneTextEl.innerHTML = `
Tu as pris une décision importante pour <strong>${label}</strong>.<br>
Les indicateurs NIRD de ton établissement ont été mis à jour.

Sélectionne un autre lieu de la carte pour continuer la démarche NIRD.
  `;
  choicesEl.innerHTML = "";
  setActiveLocation(null);
}

function showEnding() {
  const nirdScore = Math.round(
    (gameState.inclusion + gameState.responsibility + gameState.durability) / 3
  );
  const dep = gameState.dependence;

  let title, subtitle, message;

  if (nirdScore >= 70 && dep <= 40) {
    title = "Village Héroïque NIRD 💪";
    subtitle = "Ton établissement inspire tout le territoire.";
    message = `
Bravo ! Tu as construit une véritable culture de <strong>Numérique Inclusif, Responsable et Durable</strong>.
Le village résiste à l’obsolescence programmée, valorise le réemploi, la participation et les logiciels libres.

Les élèves, les enseignants, la mairie et les familles avancent ensemble,
en autonomie, sans être prisonniers des géants du numérique.
    `;
  } else if (nirdScore >= 50) {
    title = "Village en Transition 🌱";
    subtitle = "Le chemin NIRD est bien engagé, mais il reste des défis.";
    message = `
Tu as posé de bonnes bases pour le NIRD, mais certains choix maintiennent encore une dépendance
aux Big Tech, ou limitent l’impact écologique et social.

Avec quelques décisions plus audacieuses (logiciels libres, réemploi massif, données plus souveraines),
le village pourrait devenir une référence de résistance numérique.
    `;
  } else {
    title = "Village en Danger Numérique ⚠️";
    subtitle = "L’Empire des Big Tech domine encore.";
    message = `
Les choix faits ont renforcé la dépendance à des plateformes fermées,
aux licences coûteuses et à l’obsolescence du matériel.

Bonne nouvelle : il n’est jamais trop tard pour lancer ou renforcer une démarche NIRD.
Tu peux rejouer la partie et explorer d’autres stratégies !
    `;
  }

  sceneTitleEl.textContent = title;
  sceneSubtitleEl.textContent = subtitle;
  sceneTextEl.innerHTML = `
<p><strong>Score NIRD moyen :</strong> ${nirdScore} / 100</p>
<p><strong>Dépendance aux Big Tech :</strong> ${dep} / 100</p>
<br>
<p>${message}</p>
`;

  choicesEl.innerHTML = "";
  restartBtn.classList.remove("hidden");
  setActiveLocation(null);
}


function resetGame() {
  gameState.inclusion = 50;
  gameState.responsibility = 50;
  gameState.durability = 50;
  gameState.dependence = 50;
  gameState.currentLocationId = null;
  gameState.history = [];
  gameState.visitedLocations = {
    salleInfo: false,
    nuage: false,
    fablab: false,
    maisonCommune: false
  };

  logEl.innerHTML = "";
  updateStatsUI();
  updateMapStatuses();
  showIntro();
}


function showIntro() {
  sceneTitleEl.textContent = "Bienvenue à Astérix-les-Bits";
  sceneSubtitleEl.textContent = "Petit village éducatif face à l’empire des Big Tech.";
  sceneTextEl.innerHTML = `
Tu viens d’être nommé·e <strong>responsable numérique</strong> du collège d’Astérix-les-Bits.
Ton objectif : guider l’établissement vers un <strong>Numérique Inclusif, Responsable et Durable (NIRD)</strong>
sans tomber dans la dépendance totale aux Big Tech.

Clique sur un des lieux de la <strong>carte du village</strong> pour commencer à prendre des décisions.
  `;
  choicesEl.innerHTML = "";
}


restartBtn.addEventListener("click", resetGame);

mapTiles.forEach(tile => {
  tile.addEventListener("click", () => {
    const locationId = tile.getAttribute("data-location-id");
    renderSceneFromLocation(locationId);
  });
});

updateStatsUI();
updateMapStatuses();
showIntro();
