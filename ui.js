// ============================
// UI.JS — Rendu de l'interface
// ============================

const UI = {

  // ---- TOPBAR ----
  updateTopBar() {
    if (!GAME.state) return;
    const s = GAME.state;
    document.getElementById("chipBudget").textContent = formatMoney(s.budget);
    document.getElementById("chipSeason").textContent = s.season;
    document.getElementById("chipPoints").textContent = s.points;
    document.getElementById("chipRep").textContent = s.reputation + "%";
    document.getElementById("topbarTeamName").textContent = s.teamName;
    document.getElementById("teamColorDot").style.background = s.teamColor;
  },

  // ---- TOAST ----
  toast(msg, type = "info") {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    document.getElementById("toastContainer").appendChild(el);
    setTimeout(() => {
      el.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => el.remove(), 300);
    }, 3500);
  },

  // ---- TABS ----
  showTab(tab) {
    if (!GAME.state) return;
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    const el = document.getElementById("tab-" + tab);
    if (el) el.classList.add("active");
    document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add("active");
    this.renderTab(tab);
  },

  renderTab(tab) {
    if (tab === "garage") this.renderGarage();
    if (tab === "drivers") this.renderDrivers();
    if (tab === "mechanics") this.renderMechanics();
    if (tab === "races") this.renderRaces();
    if (tab === "sponsors") this.renderSponsors();
    if (tab === "stats") this.renderStats();
  },

  // ---- GARAGE ----
  renderGarage() {
    const list = document.getElementById("garageList");
    const cars = GAME.state.cars;
    if (cars.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚗</div><p>Aucune voiture dans le garage.<br>Achetez votre première voiture !</p></div>`;
      return;
    }
    list.innerHTML = cars.map(ownedCar => {
      const carData = GAME.getCarData(ownedCar.carId);
      const drivers = GAME.getAssignedDrivers(ownedCar.uid);
      const mechanics = GAME.getAssignedMechanics(ownedCar.uid);
      const avgCond = Math.round(Object.values(ownedCar.condition).reduce((a, b) => a + b, 0) / 4);
      const repairCost = GAME.getRepairCost(ownedCar);
      const typeTags = carData.type.map(t => `<span class="card-tag tag-${t}">${t.toUpperCase()}</span>`).join("");
      return `
        <div class="card">
          <div class="card-accent-bar" style="background:${carData.color}"></div>
          <div style="font-size:2.2rem;margin-bottom:8px">${carData.image}</div>
          <div class="card-title">${carData.name}</div>
          <div class="card-subtitle">${carData.category} — ${carData.description}</div>
          <div style="margin-bottom:8px">${typeTags}</div>
          <div class="card-stats">
            ${this.statBar("Vitesse", carData.specs.speed)}
            ${this.statBar("Maniabilité", carData.specs.handling)}
            ${this.statBar("Fiabilité", carData.specs.reliability)}
            ${this.statBar("Drift", carData.specs.driftPotential)}
          </div>
          <div class="condition-bar">
            <div class="cond-item"><span class="cond-label">PNEUS</span><span class="cond-val ${condClass(ownedCar.condition.tires)}">${ownedCar.condition.tires}%</span></div>
            <div class="cond-item"><span class="cond-label">FREINS</span><span class="cond-val ${condClass(ownedCar.condition.brakes)}">${ownedCar.condition.brakes}%</span></div>
            <div class="cond-item"><span class="cond-label">CHÂSSIS</span><span class="cond-val ${condClass(ownedCar.condition.chassis)}">${ownedCar.condition.chassis}%</span></div>
            <div class="cond-item"><span class="cond-label">CARROSS.</span><span class="cond-val ${condClass(ownedCar.condition.body)}">${ownedCar.condition.body}%</span></div>
          </div>
          <hr class="divider">
          <div style="font-size:0.78rem;color:var(--text2);margin-bottom:8px">
            👤 Pilotes : ${drivers.length > 0 ? drivers.map(d => d.name).join(", ") : "Aucun"}<br>
            🔧 Mécanos : ${mechanics.length > 0 ? mechanics.map(m => m.name).join(", ") : "Aucun"}
          </div>
          <div class="card-actions">
            <button class="btn-secondary btn-sm" onclick="UI.openCarSetup('${ownedCar.uid}')">⚙️ Setup</button>
            <button class="btn-secondary btn-sm" onclick="UI.openAssign('${ownedCar.uid}')">👤 Assigner</button>
            ${repairCost > 0 ? `<button class="btn-secondary btn-sm" onclick="UI.repairCar('${ownedCar.uid}')">🔧 Réparer (${formatMoney(repairCost)})</button>` : ""}
          </div>
          <div class="card-actions" style="margin-top:6px">
            <button class="btn-danger btn-sm" onclick="UI.confirmSell('${ownedCar.uid}')">Vendre</button>
          </div>
        </div>`;
    }).join("");
  },

  statBar(label, val) {
    return `<div class="stat-bar-wrap">
      <div class="stat-bar-label"><span>${label}</span><span>${val}</span></div>
      <div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${val}%;background:${statColor(val)}"></div></div>
    </div>`;
  },

  // ---- PILOTES ----
  renderDrivers() {
    const list = document.getElementById("driverList");
    const hiredIds = GAME.state.drivers.map(d => d.driverId);
    if (hiredIds.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👤</div><p>Aucun pilote recruté.</p></div>`;
      return;
    }
    list.innerHTML = hiredIds.map(id => {
      const d = GAME.getDriverData(id);
      if (!d) return "";
      const assignedCar = GAME.state.cars.find(c => c.assignedDrivers.includes(id));
      const assignedName = assignedCar ? GAME.getCarData(assignedCar.carId)?.name : "Non assigné";
      const specTags = d.specialties.map(s => `<span class="card-tag tag-${s}">${s.toUpperCase()}</span>`).join("");
      const traitList = d.traits.map(t => `<span class="card-tag" style="background:rgba(255,255,255,0.07);color:var(--text2)">${t}</span>`).join("");
      return `
        <div class="card">
          <div class="card-title">${d.nationality} ${d.name}</div>
          <div class="card-subtitle">${d.age} ans — ${d.description}</div>
          <div class="star-rating">${stars(d.stars)}</div>
          <div style="margin-bottom:8px">${specTags}${traitList}</div>
          <div class="card-stats">
            ${this.statBar("Vitesse", d.stats.speed)}
            ${this.statBar("Régularité", d.stats.consistency)}
            ${this.statBar("Stratégie", d.stats.racecraft)}
            ${this.statBar("Endurance", d.stats.stamina)}
          </div>
          <div style="margin-top:8px;font-size:0.78rem;color:var(--text2)">
            💰 Salaire : <span style="color:var(--gold)">${formatMoney(d.salary)}/mois</span><br>
            🚗 Affecté à : <span>${assignedName}</span>
          </div>
          <div class="card-actions" style="margin-top:10px">
            <button class="btn-danger btn-sm" onclick="UI.confirmFire('driver','${id}','${d.name}')">Licencier</button>
          </div>
        </div>`;
    }).join("");
  },

  // ---- MÉCANICIENS ----
  renderMechanics() {
    const list = document.getElementById("mechanicList");
    const hiredIds = GAME.state.mechanics.map(m => m.mechanicId);
    if (hiredIds.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔧</div><p>Aucun mécanicien recruté.</p></div>`;
      return;
    }
    list.innerHTML = hiredIds.map(id => {
      const m = GAME.getMechanicData(id);
      if (!m) return "";
      const assignedCar = GAME.state.cars.find(c => c.assignedMechanics.includes(id));
      const assignedName = assignedCar ? GAME.getCarData(assignedCar.carId)?.name : "Non assigné";
      const specTags = m.specialties.map(s => `<span class="card-tag" style="background:rgba(33,150,243,0.15);color:#90caf9">${s}</span>`).join("");
      return `
        <div class="card">
          <div class="card-title">${m.nationality} ${m.name}</div>
          <div class="card-subtitle">${m.age} ans — ${m.description}</div>
          <div class="star-rating">${stars(m.stars)}</div>
          <div style="margin-bottom:8px">${specTags}</div>
          <div class="card-stats">
            ${this.statBar("Compétence", m.stats.skill)}
            ${this.statBar("Rapidité", m.stats.speed)}
            ${this.statBar("Fiabilité", m.stats.reliability)}
          </div>
          <div style="margin-top:8px;font-size:0.78rem;color:var(--text2)">
            🛡️ Réduction accident : <span style="color:var(--success)">−${m.bonus.accidentReduction}%</span><br>
            🔩 Réduction usure : <span style="color:var(--info)">−${m.bonus.partWear}%</span><br>
            💰 Salaire : <span style="color:var(--gold)">${formatMoney(m.salary)}/mois</span><br>
            🚗 Affecté à : <span>${assignedName}</span>
          </div>
          <div class="card-actions" style="margin-top:10px">
            <button class="btn-danger btn-sm" onclick="UI.confirmFire('mechanic','${id}','${m.name}')">Licencier</button>
          </div>
        </div>`;
    }).join("");
  },

  // ---- COURSES ----
  renderRaces() {
    const cal = document.getElementById("raceCalendar");
    const typeColors = { rally: "#4caf50", drift: "#2196f3", speed: "#ff9800", endurance: "#9c27b0" };
    const typeLabels = { rally: "RALLYE", drift: "DRIFT", speed: "VITESSE", endurance: "ENDURANCE" };
    cal.innerHTML = DATA.races.map(race => {
      const done = GAME.state.completedRaces.includes(race.id);
      const topPrize = formatMoney(race.prize[0]);
      return `
        <div class="race-card ${done ? "race-done" : ""}">
          <div class="race-type-badge" style="background:${typeColors[race.type]}22;color:${typeColors[race.type]}">
            ${race.icon}
          </div>
          <div class="race-info">
            <div class="race-name">${race.name}</div>
            <div class="race-meta">
              <span>📍 ${race.location}</span>
              <span>⏱️ ${race.duration}</span>
              <span style="color:${typeColors[race.type]};font-weight:600">${typeLabels[race.type]}</span>
              <span>👤×${race.requirePilots} 🔧×${race.requireMechanics}</span>
            </div>
            <div class="race-req">${race.description}</div>
          </div>
          <div class="race-reward">
            <div class="race-prize-label">VICTOIRE</div>
            <div class="race-prize">${topPrize}</div>
            <div style="font-size:0.72rem;color:var(--text3);margin-bottom:8px">+${race.points[0]} pts</div>
            ${!done ? `<button class="btn-primary btn-sm" onclick="UI.openRaceSetup('${race.id}')">S'inscrire</button>` : `<span style="color:var(--success);font-size:0.8rem">✓ Terminée</span>`}
          </div>
        </div>`;
    }).join("");
  },

  // ---- SPONSORS ----
  renderSponsors() {
    const list = document.getElementById("sponsorList");
    const activeIds = GAME.state.sponsors.map(s => s.sponsorId);
    list.innerHTML = DATA.sponsors.map(spon => {
      const active = activeIds.includes(spon.id);
      const stateSpon = GAME.state.sponsors.find(s => s.sponsorId === spon.id);
      return `
        <div class="card sponsor-card">
          <div class="card-accent-bar" style="background:${spon.color}"></div>
          ${active ? '<div class="sponsor-active-badge">ACTIF</div>' : ""}
          <div style="font-size:2rem;margin-bottom:6px">${spon.logo}</div>
          <div class="card-title">${spon.name}</div>
          <div class="card-price">+${formatMoney(spon.payPerRace)} / course</div>
          <div style="font-size:0.78rem;color:var(--text2);margin-bottom:8px">Prestige : ${"★".repeat(spon.prestige)}</div>
          <div class="sponsor-conditions">📋 Condition : ${spon.conditionText}</div>
          ${stateSpon ? `<div style="font-size:0.75rem;color:var(--text3);margin-top:6px">Courses : ${stateSpon.raceCount || 0} | Échecs : ${stateSpon.failCount || 0}</div>` : ""}
          <div class="card-actions" style="margin-top:10px">
            ${!active
              ? `<button class="btn-secondary btn-sm" onclick="UI.signSponsor('${spon.id}')">Signer</button>`
              : `<button class="btn-danger btn-sm" onclick="UI.dropSponsor('${spon.id}')">Rompre le contrat</button>`
            }
          </div>
        </div>`;
    }).join("");
  },

  // ---- STATS ----
  renderStats() {
    const s = GAME.state.stats;
    const history = GAME.state.raceHistory;
    document.getElementById("statsContent").innerHTML = `
      <div class="stats-grid">
        <div class="big-stat"><div class="big-stat-val">${s.races}</div><div class="big-stat-label">COURSES</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.wins}</div><div class="big-stat-label">VICTOIRES</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.podiums}</div><div class="big-stat-label">PODIUMS</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.dnf}</div><div class="big-stat-label">ABANDONS</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.accidents}</div><div class="big-stat-label">ACCIDENTS</div></div>
        <div class="big-stat"><div class="big-stat-val">${formatMoney(s.totalEarned)}</div><div class="big-stat-label">GAINS TOTAUX</div></div>
      </div>
      <div class="section-title">HISTORIQUE DES COURSES</div>
      ${history.length === 0 ? '<div class="empty-state"><p>Aucune course disputée.</p></div>' : `
      <table class="history-table">
        <thead><tr><th>Course</th><th>Saison</th><th>Position</th><th>Gains</th><th>Sponsors</th></tr></thead>
        <tbody>${history.slice().reverse().map(h => {
          const race = DATA.races.find(r => r.id === h.raceId);
          const posClass = h.position === 1 ? "pos-1" : h.position === 2 ? "pos-2" : h.position === 3 ? "pos-3" : "";
          return `<tr>
            <td>${race ? race.name : h.raceId}</td>
            <td>${h.season}</td>
            <td class="${posClass}">${h.dnf ? "❌ DNF" : `P${h.position}`}</td>
            <td class="text-gold">${formatMoney(h.prize)}</td>
            <td class="text-success">${h.sponsorBonus > 0 ? "+" + formatMoney(h.sponsorBonus) : "—"}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>`}`;
  },

  // ---- MODALS ----
  openModal(title, bodyHTML, footerHTML = "") {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").innerHTML = bodyHTML;
    document.getElementById("modalFooter").innerHTML = footerHTML;
    document.getElementById("modalOverlay").classList.remove("hidden");
  },

  closeModal() {
    document.getElementById("modalOverlay").classList.add("hidden");
  },

  // Marché voitures
  openCarMarket() {
    if (!GAME.state) return;
    const owned = GAME.state.cars.map(c => c.carId);
    const html = `
      <div class="info-box">💡 Budget disponible : <strong>${formatMoney(GAME.state.budget)}</strong></div>
      <div class="market-grid">
        ${DATA.cars.map(car => {
          const canAfford = GAME.canAfford(car.price);
          const typeTags = car.type.map(t => `<span class="card-tag tag-${t}">${t.toUpperCase()}</span>`).join("");
          return `
            <div class="market-card" style="${!canAfford ? "opacity:0.5" : ""}">
              <div style="font-size:1.8rem">${car.image}</div>
              <div style="font-weight:600;margin:6px 0 2px">${car.name}</div>
              <div style="font-size:0.75rem;color:var(--text2);margin-bottom:6px">${car.category} — ${car.description}</div>
              <div style="margin-bottom:6px">${typeTags}</div>
              ${this.statBar("Vitesse", car.specs.speed)}
              ${this.statBar("Maniabilité", car.specs.handling)}
              <div class="market-price">${formatMoney(car.price)}</div>
              <button class="btn-primary btn-sm" style="width:100%;margin-top:8px" ${!canAfford ? "disabled" : ""} onclick="UI.buyCar('${car.id}')">
                ${!canAfford ? "Budget insuffisant" : "Acheter"}
              </button>
            </div>`;
        }).join("")}
      </div>`;
    this.openModal("MARCHÉ — VOITURES", html);
  },

  buyCar(carId) {
    const result = GAME.buyCar(carId);
    if (result.ok) {
      this.toast(result.msg, "success");
      this.closeModal();
      this.renderGarage();
      this.updateTopBar();
    } else {
      this.toast(result.msg, "error");
    }
  },

  confirmSell(uid) {
    const ownedCar = GAME.getOwnedCar(uid);
    const carData = GAME.getCarData(ownedCar.carId);
    const sellPrice = Math.floor(carData.price * 0.55);
    this.openModal("VENDRE LA VOITURE",
      `<p>Vendre <strong>${carData.name}</strong> pour <span class="text-gold">${formatMoney(sellPrice)}</span> (55% du prix d'achat) ?</p>`,
      `<button class="btn-danger" onclick="UI.sellCar('${uid}')">Confirmer la vente</button><button class="btn-secondary" onclick="UI.closeModal()">Annuler</button>`
    );
  },

  sellCar(uid) {
    const result = GAME.sellCar(uid);
    if (result.ok) { this.toast(result.msg, "success"); this.closeModal(); this.renderGarage(); this.updateTopBar(); }
  },

  // Setup pièces voiture
  openCarSetup(carUid) {
    const ownedCar = GAME.getOwnedCar(carUid);
    const carData = GAME.getCarData(ownedCar.carId);
    const getPart = (cat, id) => DATA.parts[cat]?.find(p => p.id === id);
    const categories = [
      { key: "tires", label: "🔵 Pneus" },
      { key: "brakes", label: "🔴 Freins" },
      { key: "chassis", label: "⚙️ Châssis" },
      { key: "body", label: "🚘 Carrosserie" }
    ];
    const html = `
      <div class="info-box">Voiture : <strong>${carData.name}</strong> — Budget : <strong>${formatMoney(GAME.state.budget)}</strong></div>
      <div class="setup-grid">
        ${categories.map(cat => {
          const part = getPart(cat.key, ownedCar.setup[cat.key]);
          const bonusStr = part?.bonus ? Object.entries(part.bonus).map(([k, v]) => `+${v} ${k}`).join(", ") : "Aucun bonus";
          return `
            <div class="setup-slot">
              <div class="setup-slot-title">${cat.label}</div>
              <div class="setup-slot-item">${part?.name || "?"}</div>
              <div class="setup-slot-desc">${part?.description || ""}</div>
              <div style="font-size:0.72rem;color:var(--success);margin-top:4px">${bonusStr}</div>
              <span class="setup-change-btn" onclick="UI.openPartSelector('${carUid}','${cat.key}')">→ Changer la pièce</span>
            </div>`;
        }).join("")}
      </div>`;
    this.openModal("SETUP — " + carData.name, html);
  },

  openPartSelector(carUid, category) {
    const parts = DATA.parts[category] || [];
    const ownedCar = GAME.getOwnedCar(carUid);
    const currentPartId = ownedCar.setup[category];
    const catLabels = { tires: "Pneus", brakes: "Freins", chassis: "Châssis", body: "Carrosserie" };
    const html = `
      <div class="info-box">Budget : <strong>${formatMoney(GAME.state.budget)}</strong></div>
      <div class="piece-grid">
        ${parts.map(part => {
          const equipped = part.id === currentPartId;
          const canAfford = part.price === 0 || GAME.canAfford(part.price);
          const bonusStr = Object.entries(part.bonus).map(([k, v]) => `+${v} ${k}`).join(", ") || "Aucun bonus";
          return `
            <div class="piece-card ${equipped ? "equipped" : ""}" style="${!canAfford && !equipped ? "opacity:0.5" : ""}">
              <div class="piece-name">${part.name}</div>
              <div class="piece-price">${part.price === 0 ? "Standard (gratuit)" : formatMoney(part.price)}</div>
              <div style="font-size:0.72rem;color:var(--text2);margin-bo    this.renderTab(tab);
  },

  renderTab(tab) {
    if (tab === "garage") this.renderGarage();
    if (tab === "drivers") this.renderDrivers();
    if (tab === "mechanics") this.renderMechanics();
    if (tab === "races") this.renderRaces();
    if (tab === "sponsors") this.renderSponsors();
    if (tab === "stats") this.renderStats();
  },

  // ---- GARAGE ----
  renderGarage() {
    const list = document.getElementById("garageList");
    const cars = GAME.state.cars;
    if (cars.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚗</div><p>Aucune voiture dans le garage.<br>Achetez votre première voiture !</p></div>`;
      return;
    }
    list.innerHTML = cars.map(ownedCar => {
      const carData = GAME.getCarData(ownedCar.carId);
      const drivers = GAME.getAssignedDrivers(ownedCar.uid);
      const mechanics = GAME.getAssignedMechanics(ownedCar.uid);
      const avgCond = Math.round(Object.values(ownedCar.condition).reduce((a, b) => a + b, 0) / 4);
      const repairCost = GAME.getRepairCost(ownedCar);
      const typeTags = carData.type.map(t => `<span class="card-tag tag-${t}">${t.toUpperCase()}</span>`).join("");
      return `
        <div class="card">
          <div class="card-accent-bar" style="background:${carData.color}"></div>
          <div style="font-size:2.2rem;margin-bottom:8px">${carData.image}</div>
          <div class="card-title">${carData.name}</div>
          <div class="card-subtitle">${carData.category} — ${carData.description}</div>
          <div style="margin-bottom:8px">${typeTags}</div>
          <div class="card-stats">
            ${this.statBar("Vitesse", carData.specs.speed)}
            ${this.statBar("Maniabilité", carData.specs.handling)}
            ${this.statBar("Fiabilité", carData.specs.reliability)}
            ${this.statBar("Drift", carData.specs.driftPotential)}
          </div>
          <div class="condition-bar">
            <div class="cond-item"><span class="cond-label">PNEUS</span><span class="cond-val ${condClass(ownedCar.condition.tires)}">${ownedCar.condition.tires}%</span></div>
            <div class="cond-item"><span class="cond-label">FREINS</span><span class="cond-val ${condClass(ownedCar.condition.brakes)}">${ownedCar.condition.brakes}%</span></div>
            <div class="cond-item"><span class="cond-label">CHÂSSIS</span><span class="cond-val ${condClass(ownedCar.condition.chassis)}">${ownedCar.condition.chassis}%</span></div>
            <div class="cond-item"><span class="cond-label">CARROSS.</span><span class="cond-val ${condClass(ownedCar.condition.body)}">${ownedCar.condition.body}%</span></div>
          </div>
          <hr class="divider">
          <div style="font-size:0.78rem;color:var(--text2);margin-bottom:8px">
            👤 Pilotes : ${drivers.length > 0 ? drivers.map(d => d.name).join(", ") : "Aucun"}<br>
            🔧 Mécanos : ${mechanics.length > 0 ? mechanics.map(m => m.name).join(", ") : "Aucun"}
          </div>
          <div class="card-actions">
            <button class="btn-secondary btn-sm" onclick="UI.openCarSetup('${ownedCar.uid}')">⚙️ Setup</button>
            <button class="btn-secondary btn-sm" onclick="UI.openAssign('${ownedCar.uid}')">👤 Assigner</button>
            ${repairCost > 0 ? `<button class="btn-secondary btn-sm" onclick="UI.repairCar('${ownedCar.uid}')">🔧 Réparer (${formatMoney(repairCost)})</button>` : ""}
          </div>
          <div class="card-actions" style="margin-top:6px">
            <button class="btn-danger btn-sm" onclick="UI.confirmSell('${ownedCar.uid}')">Vendre</button>
          </div>
        </div>`;
    }).join("");
  },

  statBar(label, val) {
    return `<div class="stat-bar-wrap">
      <div class="stat-bar-label"><span>${label}</span><span>${val}</span></div>
      <div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${val}%;background:${statColor(val)}"></div></div>
    </div>`;
  },

  // ---- PILOTES ----
  renderDrivers() {
    const list = document.getElementById("driverList");
    const hiredIds = GAME.state.drivers.map(d => d.driverId);
    if (hiredIds.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👤</div><p>Aucun pilote recruté.</p></div>`;
      return;
    }
    list.innerHTML = hiredIds.map(id => {
      const d = GAME.getDriverData(id);
      if (!d) return "";
      const assignedCar = GAME.state.cars.find(c => c.assignedDrivers.includes(id));
      const assignedName = assignedCar ? GAME.getCarData(assignedCar.carId)?.name : "Non assigné";
      const specTags = d.specialties.map(s => `<span class="card-tag tag-${s}">${s.toUpperCase()}</span>`).join("");
      const traitList = d.traits.map(t => `<span class="card-tag" style="background:rgba(255,255,255,0.07);color:var(--text2)">${t}</span>`).join("");
      return `
        <div class="card">
          <div class="card-title">${d.nationality} ${d.name}</div>
          <div class="card-subtitle">${d.age} ans — ${d.description}</div>
          <div class="star-rating">${stars(d.stars)}</div>
          <div style="margin-bottom:8px">${specTags}${traitList}</div>
          <div class="card-stats">
            ${this.statBar("Vitesse", d.stats.speed)}
            ${this.statBar("Régularité", d.stats.consistency)}
            ${this.statBar("Stratégie", d.stats.racecraft)}
            ${this.statBar("Endurance", d.stats.stamina)}
          </div>
          <div style="margin-top:8px;font-size:0.78rem;color:var(--text2)">
            💰 Salaire : <span style="color:var(--gold)">${formatMoney(d.salary)}/mois</span><br>
            🚗 Affecté à : <span>${assignedName}</span>
          </div>
          <div class="card-actions" style="margin-top:10px">
            <button class="btn-danger btn-sm" onclick="UI.confirmFire('driver','${id}','${d.name}')">Licencier</button>
          </div>
        </div>`;
    }).join("");
  },

  // ---- MÉCANICIENS ----
  renderMechanics() {
    const list = document.getElementById("mechanicList");
    const hiredIds = GAME.state.mechanics.map(m => m.mechanicId);
    if (hiredIds.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔧</div><p>Aucun mécanicien recruté.</p></div>`;
      return;
    }
    list.innerHTML = hiredIds.map(id => {
      const m = GAME.getMechanicData(id);
      if (!m) return "";
      const assignedCar = GAME.state.cars.find(c => c.assignedMechanics.includes(id));
      const assignedName = assignedCar ? GAME.getCarData(assignedCar.carId)?.name : "Non assigné";
      const specTags = m.specialties.map(s => `<span class="card-tag" style="background:rgba(33,150,243,0.15);color:#90caf9">${s}</span>`).join("");
      return `
        <div class="card">
          <div class="card-title">${m.nationality} ${m.name}</div>
          <div class="card-subtitle">${m.age} ans — ${m.description}</div>
          <div class="star-rating">${stars(m.stars)}</div>
          <div style="margin-bottom:8px">${specTags}</div>
          <div class="card-stats">
            ${this.statBar("Compétence", m.stats.skill)}
            ${this.statBar("Rapidité", m.stats.speed)}
            ${this.statBar("Fiabilité", m.stats.reliability)}
          </div>
          <div style="margin-top:8px;font-size:0.78rem;color:var(--text2)">
            🛡️ Réduction accident : <span style="color:var(--success)">−${m.bonus.accidentReduction}%</span><br>
            🔩 Réduction usure : <span style="color:var(--info)">−${m.bonus.partWear}%</span><br>
            💰 Salaire : <span style="color:var(--gold)">${formatMoney(m.salary)}/mois</span><br>
            🚗 Affecté à : <span>${assignedName}</span>
          </div>
          <div class="card-actions" style="margin-top:10px">
            <button class="btn-danger btn-sm" onclick="UI.confirmFire('mechanic','${id}','${m.name}')">Licencier</button>
          </div>
        </div>`;
    }).join("");
  },

  // ---- COURSES ----
  renderRaces() {
    const cal = document.getElementById("raceCalendar");
    const typeColors = { rally: "#4caf50", drift: "#2196f3", speed: "#ff9800", endurance: "#9c27b0" };
    const typeLabels = { rally: "RALLYE", drift: "DRIFT", speed: "VITESSE", endurance: "ENDURANCE" };
    cal.innerHTML = DATA.races.map(race => {
      const done = GAME.state.completedRaces.includes(race.id);
      const topPrize = formatMoney(race.prize[0]);
      return `
        <div class="race-card ${done ? "race-done" : ""}">
          <div class="race-type-badge" style="background:${typeColors[race.type]}22;color:${typeColors[race.type]}">
            ${race.icon}
          </div>
          <div class="race-info">
            <div class="race-name">${race.name}</div>
            <div class="race-meta">
              <span>📍 ${race.location}</span>
              <span>⏱️ ${race.duration}</span>
              <span style="color:${typeColors[race.type]};font-weight:600">${typeLabels[race.type]}</span>
              <span>👤×${race.requirePilots} 🔧×${race.requireMechanics}</span>
            </div>
            <div class="race-req">${race.description}</div>
          </div>
          <div class="race-reward">
            <div class="race-prize-label">VICTOIRE</div>
            <div class="race-prize">${topPrize}</div>
            <div style="font-size:0.72rem;color:var(--text3);margin-bottom:8px">+${race.points[0]} pts</div>
            ${!done ? `<button class="btn-primary btn-sm" onclick="UI.openRaceSetup('${race.id}')">S'inscrire</button>` : `<span style="color:var(--success);font-size:0.8rem">✓ Terminée</span>`}
          </div>
        </div>`;
    }).join("");
  },

  // ---- SPONSORS ----
  renderSponsors() {
    const list = document.getElementById("sponsorList");
    const activeIds = GAME.state.sponsors.map(s => s.sponsorId);
    list.innerHTML = DATA.sponsors.map(spon => {
      const active = activeIds.includes(spon.id);
      const stateSpon = GAME.state.sponsors.find(s => s.sponsorId === spon.id);
      return `
        <div class="card sponsor-card">
          <div class="card-accent-bar" style="background:${spon.color}"></div>
          ${active ? '<div class="sponsor-active-badge">ACTIF</div>' : ""}
          <div style="font-size:2rem;margin-bottom:6px">${spon.logo}</div>
          <div class="card-title">${spon.name}</div>
          <div class="card-price">+${formatMoney(spon.payPerRace)} / course</div>
          <div style="font-size:0.78rem;color:var(--text2);margin-bottom:8px">Prestige : ${"★".repeat(spon.prestige)}</div>
          <div class="sponsor-conditions">📋 Condition : ${spon.conditionText}</div>
          ${stateSpon ? `<div style="font-size:0.75rem;color:var(--text3);margin-top:6px">Courses : ${stateSpon.raceCount || 0} | Échecs : ${stateSpon.failCount || 0}</div>` : ""}
          <div class="card-actions" style="margin-top:10px">
            ${!active
              ? `<button class="btn-secondary btn-sm" onclick="UI.signSponsor('${spon.id}')">Signer</button>`
              : `<button class="btn-danger btn-sm" onclick="UI.dropSponsor('${spon.id}')">Rompre le contrat</button>`
            }
          </div>
        </div>`;
    }).join("");
  },

  // ---- STATS ----
  renderStats() {
    const s = GAME.state.stats;
    const history = GAME.state.raceHistory;
    document.getElementById("statsContent").innerHTML = `
      <div class="stats-grid">
        <div class="big-stat"><div class="big-stat-val">${s.races}</div><div class="big-stat-label">COURSES</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.wins}</div><div class="big-stat-label">VICTOIRES</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.podiums}</div><div class="big-stat-label">PODIUMS</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.dnf}</div><div class="big-stat-label">ABANDONS</div></div>
        <div class="big-stat"><div class="big-stat-val">${s.accidents}</div><div class="big-stat-label">ACCIDENTS</div></div>
        <div class="big-stat"><div class="big-stat-val">${formatMoney(s.totalEarned)}</div><div class="big-stat-label">GAINS TOTAUX</div></div>
      </div>
      <div class="section-title">HISTORIQUE DES COURSES</div>
      ${history.length === 0 ? '<div class="empty-state"><p>Aucune course disputée.</p></div>' : `
      <table class="history-table">
        <thead><tr><th>Course</th><th>Saison</th><th>Position</th><th>Gains</th><th>Sponsors</th></tr></thead>
        <tbody>${history.slice().reverse().map(h => {
          const race = DATA.races.find(r => r.id === h.raceId);
          const posClass = h.position === 1 ? "pos-1" : h.position === 2 ? "pos-2" : h.position === 3 ? "pos-3" : "";
          return `<tr>
            <td>${race ? race.name : h.raceId}</td>
            <td>${h.season}</td>
            <td class="${posClass}">${h.dnf ? "❌ DNF" : `P${h.position}`}</td>
            <td class="text-gold">${formatMoney(h.prize)}</td>
            <td class="text-success">${h.sponsorBonus > 0 ? "+" + formatMoney(h.sponsorBonus) : "—"}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>`}`;
  },

  // ---- MODALS ----
  openModal(title, bodyHTML, footerHTML = "") {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").innerHTML = bodyHTML;
    document.getElementById("modalFooter").innerHTML = footerHTML;
    document.getElementById("modalOverlay").classList.remove("hidden");
  },

  closeModal() {
    document.getElementById("modalOverlay").classList.add("hidden");
  },

  // Marché voitures
  openCarMarket() {
    const owned = GAME.state.cars.map(c => c.carId);
    const html = `
      <div class="info-box">💡 Budget disponible : <strong>${formatMoney(GAME.state.budget)}</strong></div>
      <div class="market-grid">
        ${DATA.cars.map(car => {
          const canAfford = GAME.canAfford(car.price);
          const typeTags = car.type.map(t => `<span class="card-tag tag-${t}">${t.toUpperCase()}</span>`).join("");
          return `
            <div class="market-card" style="${!canAfford ? "opacity:0.5" : ""}">
              <div style="font-size:1.8rem">${car.image}</div>
              <div style="font-weight:600;margin:6px 0 2px">${car.name}</div>
              <div style="font-size:0.75rem;color:var(--text2);margin-bottom:6px">${car.category} — ${car.description}</div>
              <div style="margin-bottom:6px">${typeTags}</div>
              ${this.statBar("Vitesse", car.specs.speed)}
              ${this.statBar("Maniabilité", car.specs.handling)}
              <div class="market-price">${formatMoney(car.price)}</div>
              <button class="btn-primary btn-sm" style="width:100%;margin-top:8px" ${!canAfford ? "disabled" : ""} onclick="UI.buyCar('${car.id}')">
                ${!canAfford ? "Budget insuffisant" : "Acheter"}
              </button>
            </div>`;
        }).join("")}
      </div>`;
    this.openModal("MARCHÉ — VOITURES", html);
  },

  buyCar(carId) {
    const result = GAME.buyCar(carId);
    if (result.ok) {
      this.toast(result.msg, "success");
      this.closeModal();
      this.renderGarage();
      this.updateTopBar();
    } else {
      this.toast(result.msg, "error");
    }
  },

  confirmSell(uid) {
    const ownedCar = GAME.getOwnedCar(uid);
    const carData = GAME.getCarData(ownedCar.carId);
    const sellPrice = Math.floor(carData.price * 0.55);
    this.openModal("VENDRE LA VOITURE",
      `<p>Vendre <strong>${carData.name}</strong> pour <span class="text-gold">${formatMoney(sellPrice)}</span> (55% du prix d'achat) ?</p>`,
      `<button class="btn-danger" onclick="UI.sellCar('${uid}')">Confirmer la vente</button><button class="btn-secondary" onclick="UI.closeModal()">Annuler</button>`
    );
  },

  sellCar(uid) {
    const result = GAME.sellCar(uid);
    if (result.ok) { this.toast(result.msg, "success"); this.closeModal(); this.renderGarage(); this.updateTopBar(); }
  },

  // Setup pièces voiture
  openCarSetup(carUid) {
    const ownedCar = GAME.getOwnedCar(carUid);
    const carData = GAME.getCarData(ownedCar.carId);
    const getPart = (cat, id) => DATA.parts[cat]?.find(p => p.id === id);
    const categories = [
      { key: "tires", label: "🔵 Pneus" },
      { key: "brakes", label: "🔴 Freins" },
      { key: "chassis", label: "⚙️ Châssis" },
      { key: "body", label: "🚘 Carrosserie" }
    ];
    const html = `
      <div class="info-box">Voiture : <strong>${carData.name}</strong> — Budget : <strong>${formatMoney(GAME.state.budget)}</strong></div>
      <div class="setup-grid">
        ${categories.map(cat => {
          const part = getPart(cat.key, ownedCar.setup[cat.key]);
          const bonusStr = part?.bonus ? Object.entries(part.bonus).map(([k, v]) => `+${v} ${k}`).join(", ") : "Aucun bonus";
          return `
            <div class="setup-slot">
              <div class="setup-slot-title">${cat.label}</div>
              <div class="setup-slot-item">${part?.name || "?"}</div>
              <div class="setup-slot-desc">${part?.description || ""}</div>
              <div style="font-size:0.72rem;color:var(--success);margin-top:4px">${bonusStr}</div>
              <span class="setup-change-btn" onclick="UI.openPartSelector('${carUid}','${cat.key}')">→ Changer la pièce</span>
            </div>`;
        }).join("")}
      </div>`;
    this.openModal("SETUP — " + carData.name, html);
  },

  openPartSelector(carUid, category) {
    const parts = DATA.parts[category] || [];
    const ownedCar = GAME.getOwnedCar(carUid);
    const currentPartId = ownedCar.setup[category];
    const catLabels = { tires: "Pneus", brakes: "Freins", chassis: "Châssis", body: "Carrosserie" };
    const html = `
      <div class="info-box">Budget : <strong>${formatMoney(GAME.state.budget)}</strong></div>
      <div class="piece-grid">
        ${parts.map(part => {
          const equipped = part.id === currentPartId;
          const canAfford = part.price === 0 || GAME.canAfford(part.price);
          const bonusStr = Object.entries(part.bonus).map(([k, v]) => `+${v} ${k}`).join(", ") || "Aucun bonus";
          return `
            <div class="piece-card ${equipped ? "equipped" : ""}" style="${!canAfford && !equipped ? "opacity:0.5" : ""}">
              <div class="piece-name">${part.name}</div>
              <div class="piece-price">${part.price === 0 ? "Standard (gratuit)" : formatMoney(part.price)}</div>
              <div style="font-size:0.72rem;color:var(--text2);margin-bottom:6px">${part.description}</div>
              <div style="font-size:0.72rem;color:v
