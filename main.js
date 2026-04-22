// ============================
// MAIN.JS — Point d'entrée
// ============================

// ---- CHARGEMENT ----
window.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("loadingBar");
  const txt = document.getElementById("loadingText");
  const steps = [
    [20, "Chargement des véhicules..."],
    [45, "Initialisation des pilotes..."],
    [65, "Préparation du calendrier..."],
    [85, "Vérification de la sauvegarde..."],
    [100, "Prêt !"]
  ];
  let i = 0;
  const interval = setInterval(() => {
    if (i < steps.length) {
      bar.style.width = steps[i][0] + "%";
      txt.textContent = steps[i][1];
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        showScreen("menu");
        if (GAME.hasSave()) {
          document.getElementById("btnContinue").disabled = false;
        } else {
          document.getElementById("btnContinue").disabled = true;
        }
      }, 400);
    }
  }, 350);
});

// ---- NAVIGATION ENTRE ÉCRANS ----
function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById("screen-" + name);
  if (el) el.classList.add("active");
}

// ---- MENU PRINCIPAL ----
document.getElementById("btnNewGame").addEventListener("click", () => {
  showScreen("create");
});

document.getElementById("btnContinue").addEventListener("click", () => {
  if (GAME.load()) {
    launchGame();
  }
});

document.getElementById("btnCredits").addEventListener("click", () => {
  UI.openModal("CRÉDITS",
    `<p style="line-height:2;color:var(--text2)">
      <strong style="color:var(--text)">APEX MOTORSPORT</strong><br>
      Jeu de gestion de course automobile<br><br>
      🏎️ Rallye, Drift, Vitesse, Endurance<br>
      🧩 10 voitures, 8 pilotes, 5 mécaniciens<br>
      🏆 9 courses, 7 sponsors<br><br>
      <span style="color:var(--text3);font-size:0.8rem">Version 1.0.0</span>
    </p>`,
    `<button class="btn-secondary" onclick="UI.closeModal()">Fermer</button>`
  );
});

// ---- CRÉATION D'ÉQUIPE ----
let selectedColor = "#e63946";
let selectedMode = "mixed";
let selectedBudget = 500000;

document.querySelectorAll(".color-opt").forEach(opt => {
  opt.addEventListener("click", () => {
    document.querySelectorAll(".color-opt").forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    selectedColor = opt.dataset.color;
  });
});

document.querySelectorAll(".mode-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".mode-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedMode = card.dataset.mode;
  });
});

document.querySelectorAll(".diff-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".diff-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedBudget = parseInt(card.dataset.budget);
  });
});

document.getElementById("btnStartGame").addEventListener("click", () => {
  const name = document.getElementById("teamName").value.trim();
  if (!name) {
    document.getElementById("teamName").focus();
    UI.toast("Donnez un nom à votre équipe !", "warning");
    return;
  }
  GAME.newGame(name, selectedColor, selectedMode, selectedBudget);
  launchGame();
});

// ---- LANCEMENT DU JEU ----
function launchGame() {
  showScreen("game");
  UI.updateTopBar();
  UI.showTab("garage");
  bindGameEvents();
}

// ---- ÉVÉNEMENTS DU JEU ----
function bindGameEvents() {
  // Navigation tabs
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      UI.showTab(item.dataset.tab);
    });
  });

  // Boutons marché
  const btnBuyCar = document.getElementById("btnBuyCar");
  if (btnBuyCar && !btnBuyCar._bound) {
    btnBuyCar.addEventListener("click", () => UI.openCarMarket());
    btnBuyCar._bound = true;
  }
  const btnHireDriver = document.getElementById("btnHireDriver");
  if (btnHireDriver && !btnHireDriver._bound) {
    btnHireDriver.addEventListener("click", () => UI.openDriverMarket());
    btnHireDriver._bound = true;
  }
  const btnHireMechanic = document.getElementById("btnHireMechanic");
  if (btnHireMechanic && !btnHireMechanic._bound) {
    btnHireMechanic.addEventListener("click", () => UI.openMechanicMarket());
    btnHireMechanic._bound = true;
  }

  // Fermeture modals
  document.getElementById("modalClose").addEventListener("click", () => UI.closeModal());
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay")) UI.closeModal();
  });

  // Bouton fin de course
  document.getElementById("btnRaceClose").addEventListener("click", () => {
    document.getElementById("raceOverlay").classList.add("hidden");
    UI.updateTopBar();
    UI.showTab("races");
  });

  // Bouton nouvelle saison (fin de toutes les courses)
  checkSeasonEnd();
}

// ---- FIN DE SAISON ----
function checkSeasonEnd() {
  const totalRaces = DATA.races.length;
  const doneRaces = GAME.state.completedRaces.length;
  if (doneRaces >= totalRaces && totalRaces > 0) {
    setTimeout(() => {
      showSeasonEndModal();
    }, 1000);
  }
}

function showSeasonEndModal() {
  const s = GAME.state;
  const wages = s.drivers.reduce((acc, d) => {
    const drv = DATA.drivers.find(x => x.id === d.driverId);
    return acc + (drv ? drv.salary : 0);
  }, 0) + s.mechanics.reduce((acc, m) => {
    const mec = DATA.mechanics.find(x => x.id === m.mechanicId);
    return acc + (mec ? mec.salary : 0);
  }, 0);

  UI.openModal("🏆 FIN DE SAISON " + s.season,
    `<div style="text-align:center;padding:16px 0">
      <div style="font-size:3rem;margin-bottom:12px">🏁</div>
      <p style="font-size:1.1rem;font-weight:600;margin-bottom:20px">Saison ${s.season} terminée !</p>
      <div class="stats-grid" style="margin-bottom:20px">
        <div class="big-stat"><div class="big-stat-val">${s.stats.wins}</div><div class="big-stat-label">VICTOIRES</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.stats.podiums}</div><div class="big-stat-label">PODIUMS</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.points}</div><div class="big-stat-label">POINTS TOTAUX</div></div>
      </div>
      <div class="warn-box">
        💸 Salaires de la saison à venir : <strong>${formatMoney(wages)}/mois</strong>
      </div>
      <p style="font-size:0.85rem;color:var(--text2)">Passez à la saison ${s.season + 1} pour de nouvelles courses !</p>
    </div>`,
    `<button class="btn-primary" onclick="UI.closeModal(); nextSeason()">→ Saison ${s.season + 1}</button>`
  );
}

function nextSeason() {
  GAME.newSeason();
  UI.updateTopBar();
  UI.showTab("races");
  UI.toast("Saison " + GAME.state.season + " commencée !", "success");
}

// Exposer nextSeason globalement
window.nextSeason = nextSeason;
