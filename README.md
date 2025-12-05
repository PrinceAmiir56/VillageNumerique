# Village Numérique Résistant – Jeu NIRD sur Carte

Projet réalisé pour **La Nuit de l’Info 2025** :  
**« Le Village Numérique Résistant : Comment les établissements scolaires peuvent tenir tête aux Big Tech ? »**

Ce mini-jeu Web propose à l’utilisateur d’incarner un **établissement scolaire** (par exemple le *Collège d’Astérix-les-Bits*) et de prendre des décisions numériques à l’échelle d’un village : choix du système d’exploitation, type de cloud, politique de réemploi du matériel, animation de la communauté, etc.

L’objectif est de faire découvrir la démarche **NIRD – Numérique Inclusif, Responsable et Durable** de façon **ludique, visuelle et interactive**, tout en montrant comment un établissement peut **résister à la dépendance aux Big Tech**.

---

## 🎯 Concept du jeu

- Tu joues le rôle du **responsable numérique** de l’établissement.
- Une **carte du village** présente plusieurs lieux clés :
  - 💻 *Salle info* – Choix des systèmes (Windows 11, Linux, mixte…)
  - ☁️ *Nuage du village* – Où vont les données ? Cloud Big Tech vs solutions libres / souveraines
  - 🛠️ *Fablab / Réemploi* – Reconditionnement et réemploi du matériel
  - 🏡 *Maison commune* – Animation de la communauté NIRD (ateliers, comité, etc.)
- À chaque lieu, tu dois choisir une stratégie parmi plusieurs options.
- Tes décisions font évoluer des **indicateurs NIRD** :
  - Inclusion
  - Responsabilité
  - Durabilité
  - Dépendance aux Big Tech (à limiter !)

En fin de partie, le jeu calcule un **score NIRD moyen** et un niveau de **dépendance aux Big Tech** pour afficher un bilan :
- 🌟 *Village Héroïque NIRD* – Exemplarité et forte autonomie
- 🌱 *Village en Transition* – Bon départ, mais des choix encore perfectibles
- ⚠️ *Village en Danger Numérique* – Dépendance forte, appel à rejouer avec d’autres stratégies

---

## 🧩 Fonctionnalités principales

- **Carte interactive du village** avec 4 lieux cliquables.
- **Scènes narratives** pour chaque lieu, inspirées du sujet officiel de la Nuit de l’Info 2025.
- **Système de choix** : chaque option modifie les indicateurs NIRD (inclusion, responsabilité, durabilité, dépendance).
- **Barres de progression** pour visualiser immédiatement l’impact des décisions.
- **Journal du village** retraçant les décisions prises, pour garder une trace du scénario.
- **Écran de fin** avec interprétation pédagogique du résultat (village héroïque, en transition, ou en danger).

---

## 🛠️ Stack technique

- **HTML5** – structure de la page et de la carte du village.
- **CSS3** – design immersif : thème sombre, glow, carte en grille, barres d’indicateurs.
- **JavaScript vanilla** – logique du jeu :
  - Gestion de l’état (`gameState`) : indicateurs, lieux visités, historique.
  - Système de scènes et de choix.
  - Calcul du score final et affichage des endings.

Aucune dépendance externe : le jeu fonctionne avec un simple navigateur Web.

---

## 🚀 Lancer le projet en local

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/<TON_USERNAME>/VillageNumerique.git
   cd VillageNumerique
