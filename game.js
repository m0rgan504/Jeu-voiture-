// ============================
// GAME.JS — État & logique du jeu
// ============================

const GAME = {
  state: null,

  // ---- Initialisation d'une nouvelle partie ----
  newGame(teamName, teamColor, mode, budget) {
    this.state = {
      teamName: teamName || "Mon Équipe",
      teamColor: teamColor || "#e63946",
      mode: mode || "mixed",
      budget: (budget !== undefined && budget !== null) ? budget : 500000,
      season: 1,
      points: 0,
      reputation: 0,
      cars: [],          // voitures achetées {carId, setup, condition, assignedDrivers, assignedMechanics}
      drivers: [],       // pilotes recrutés {driverId, assignedCarId}
      mechanics: [],     // mécaniciens recrutés {mechanicId, assignedCarId}
      sponsors: [],      // sponsors actifs {sponsorId, racesParticipated, conditionMet}
      raceHistory: [],   // résultats des courses
      completedRaces: [],// IDs courses terminées cette saison
      stats: { wins: 0, podiums: 0, races: 0, accidents: 0, dnf: 0, totalEarned: 0 }
    };
    this.save();
  },

  // ---- Sauvegarde localStorage ----
  save() {
    try { localStorage.setItem("apex_save", JSON.stringify(this.state)); } catch(e) {}
  },

  load() {
    try {
      const d = localStorage.getItem("apex_save");
      if (d) { this.state = JSON.parse(d); return true; }
    } catch(e) {}
    return false;
  },

  hasSave() {
    return !!localStorage.getItem("apex_save");
  },

  deleteSave() {
    localStorage.removeItem("apex_save");
    this.state = null;
  },

  // ---- BUDGET ----
  canAfford(amount) { return this.state.budget >= amount; },

  spend(amount) {
    if (!this.canAfford(amount)) return false;
    this.state.budget -= amount;
    this.save();
    return true;
  },

  earn(amount) {
    this.state.budget += amount;
    this.state.stats.totalEarned += amount;
    this.save();
  },

  // ---- VOITURES ----
  buyCar(carId) {
    const carData = DATA.cars.find(c => c.id === carId);
    if (!carData) return { ok: false, msg: "Voiture introuvable." };
    if (!this.canAfford(carData.price)) return { ok: false, msg: "Budget insuffisant !" };
    this.spend(carData.price);
    const entry = {
      uid: "owned_" + Date.now(),
      carId: carId,
      setup: {
        tires: "tire_standard",
        brakes: "brake_standard",
        chassis: "chassis_standard",
        body: "body_standard"
      },
      condition: { tires: 100, brakes: 100, chassis: 100, body: 100 },
      assignedDrivers: [],
      assignedMechanics: []
    };
    this.state.cars.push(entry);
    this.save();
    return { ok: true, msg: `${carData.name} achetée !` };
  },

  sellCar(uid) {
    const idx = this.state.cars.findIndex(c => c.uid === uid);
    if (idx === -1) return { ok: false, msg: "Voiture introuvable." };
    const carData = DATA.cars.find(c => c.id === this.state.cars[idx].carId);
    const sellPrice = Math.floor(carData.price * 0.55);
    this.state.cars.splice(idx, 1);
    this.earn(sellPrice);
    this.save();
    return { ok: true, msg: `Vendue pour ${formatMoney(sellPrice)}`, amount: sellPrice };
  },

  // ---- SETUP VOITURE ----
  equipPart(carUid, category, partId) {
    const car = this.state.cars.find(c => c.uid === carUid);
    if (!car) return { ok: false, msg: "Voiture introuvable." };
    const part = DATA.parts[category]?.find(p => p.id === partId);
    if (!part) return { ok: false, msg: "Pièce introuvable." };
    if (part.price > 0 && !this.canAfford(part.price)) return { ok: false, msg: "Budget insuffisant !" };
    if (part.price > 0) this.spend(part.price);
    car.setup[category] = partId;
    car.condition[category] = 100;
    this.save();
    return { ok: true };
  },

  repairCar(carUid) {
    const car = this.state.cars.find(c => c.uid === carUid);
    if (!car) return { ok: false };
    const cost = this.getRepairCost(car);
    if (!this.canAfford(cost)) return { ok: false, msg: "Budget insuffisant pour réparer !" };
    this.spend(cost);
    car.condition = { tires: 100, brakes: 100, chassis: 100, body: 100 };
    this.save();
    return { ok: true, cost };
  },

  getRepairCost(car) {
    let total = 0;
    for (const [key, val] of Object.entries(car.condition)) {
      const damage = 100 - val;
      total += damage * 80;
    }
    return Math.round(total);
  },

  // ---- PILOTES ----
  hireDriver(driverId) {
    const drv = DATA.drivers.find(d => d.id === driverId);
    if (!drv) return { ok: false, msg: "Pilote introuvable." };
    if (this.state.drivers.find(d => d.driverId === driverId))
      return { ok: false, msg: "Ce pilote est déjà dans l'équipe." };
    const cost = drv.salary * 3; // 3 mois d'avance
    if (!this.canAfford(cost)) return { ok: false, msg: `Avance de recrutement requise : ${formatMoney(cost)}` };
    this.spend(cost);
    this.state.drivers.push({ driverId, assignedCarUid: null });
    this.save();
    return { ok: true, msg: `${drv.name} recruté !` };
  },

  fireDriver(driverId) {
    const idx = this.state.drivers.findIndex(d => d.driverId === driverId);
    if (idx === -1) return { ok: false };
    this.state.drivers.splice(idx, 1);
    // désassigner de toutes les voitures
    this.state.cars.forEach(c => {
      c.assignedDrivers = c.assignedDrivers.filter(id => id !== driverId);
    });
    this.save();
    return { ok: true };
  },

  assignDriver(driverId, carUid) {
    const car = this.state.cars.find(c => c.uid === carUid);
    if (!car) return { ok: false };
    // retirer le pilote de l'ancienne voiture
    this.state.cars.forEach(c => {
      c.assignedDrivers = c.assignedDrivers.filter(id => id !== driverId);
    });
    if (carUid && !car.assignedDrivers.includes(driverId)) {
      car.assignedDrivers.push(driverId);
    }
    this.save();
    return { ok: true };
  },

  // ---- MÉCANICIENS ----
  hireMechanic(mechanicId) {
    const mec = DATA.mechanics.find(m => m.id === mechanicId);
    if (!mec) return { ok: false, msg: "Mécanicien introuvable." };
    if (this.state.mechanics.find(m => m.mechanicId === mechanicId))
      return { ok: false, msg: "Ce mécanicien est déjà dans l'équipe." };
    const cost = mec.salary * 2;
    if (!this.canAfford(cost)) return { ok: false, msg: `Avance requise : ${formatMoney(cost)}` };
    this.spend(cost);
    this.state.mechanics.push({ mechanicId, assignedCarUid: null });
    this.save();
    return { ok: true, msg: `${mec.name} recruté !` };
  },

  fireMechanic(mechanicId) {
    const idx = this.state.mechanics.findIndex(m => m.mechanicId === mechanicId);
    if (idx === -1) return { ok: false };
    this.state.mechanics.splice(idx, 1);
    this.state.cars.forEach(c => {
      c.assignedMechanics = c.assignedMechanics.filter(id => id !== mechanicId);
    });
    this.save();
    return { ok: true };
  },

  assignMechanic(mechanicId, carUid) {
    this.state.cars.forEach(c => {
      c.assignedMechanics = c.assignedMechanics.filter(id => id !== mechanicId);
    });
    const car = this.state.cars.find(c => c.uid === carUid);
    if (car && !car.assignedMechanics.includes(mechanicId)) {
      car.assignedMechanics.push(mechanicId);
    }
    this.save();
    return { ok: true };
  },

  // ---- SPONSORS ----
  signSponsor(sponsorId) {
    const spon = DATA.sponsors.find(s => s.id === sponsorId);
    if (!spon) return { ok: false };
    if (this.state.sponsors.find(s => s.sponsorId === sponsorId))
      return { ok: false, msg: "Sponsor déjà signé." };
    this.state.sponsors.push({ sponsorId, active: true, failCount: 0, raceCount: 0 });
    this.save();
    return { ok: true, msg: `Sponsor ${spon.name} signé !` };
  },

  dropSponsor(sponsorId) {
    const idx = this.state.sponsors.findIndex(s => s.sponsorId === sponsorId);
    if (idx !== -1) { this.state.sponsors.splice(idx, 1); this.save(); }
  },

  // ---- UTILITAIRES ----
  getOwnedCar(uid) { return this.state.cars.find(c => c.uid === uid); },
  getCarData(carId) { return DATA.cars.find(c => c.id === carId); },
  getDriverData(driverId) { return DATA.drivers.find(d => d.id === driverId); },
  getMechanicData(mechanicId) { return DATA.mechanics.find(m => m.id === mechanicId); },
  getSponsorData(sponsorId) { return DATA.sponsors.find(s => s.id === sponsorId); },

  getAssignedDrivers(carUid) {
    const car = this.getOwnedCar(carUid);
    if (!car) return [];
    return car.assignedDrivers.map(id => DATA.drivers.find(d => d.id === id)).filter(Boolean);
  },

  getAssignedMechanics(carUid) {
    const car = this.getOwnedCar(carUid);
    if (!car) return [];
    return car.assignedMechanics.map(id => DATA.mechanics.find(m => m.id === id)).filter(Boolean);
  },

  // Calcule le score total d'une voiture (setup + condition + pilotes + mécaniciens)
  calcCarScore(carUid, raceType) {
    const ownedCar = this.getOwnedCar(carUid);
    if (!ownedCar) return 0;
    const carData = this.getCarData(ownedCar.carId);
    let score = 0;

    // Stats de base de la voiture
    const specs = carData.specs;
    if (raceType === "rally")    score += specs.speed * 0.3 + specs.handling * 0.4 + specs.reliability * 0.2 + specs.endurance * 0.1;
    else if (raceType === "drift") score += specs.driftPotential * 0.5 + specs.handling * 0.3 + specs.speed * 0.2;
    else if (raceType === "speed") score += specs.speed * 0.5 + specs.handling * 0.3 + specs.reliability * 0.2;
    else if (raceType === "endurance") score += specs.endurance * 0.35 + specs.speed * 0.25 + specs.reliability * 0.3 + specs.handling * 0.1;
    else score += (specs.speed + specs.handling + specs.reliability + specs.endurance) / 4;

    // Bonus pièces
    const allParts = [...DATA.parts.tires, ...DATA.parts.brakes, ...DATA.parts.chassis, ...DATA.parts.body];
    for (const partId of Object.values(ownedCar.setup)) {
      const part = allParts.find(p => p.id === partId);
      if (part?.bonus) {
        for (const val of Object.values(part.bonus)) score += val * 0.3;
      }
    }

    // Condition de la voiture (usure)
    const avgCond = Object.values(ownedCar.condition).reduce((a, b) => a + b, 0) / 4;
    score *= (avgCond / 100);

    // Bonus pilotes
    const drivers = this.getAssignedDrivers(carUid);
    if (drivers.length > 0) {
      const drvScore = drivers.reduce((acc, d) => {
        let ds = 0;
        if (raceType === "rally")      ds = d.stats.speed * 0.3 + d.stats.consistency * 0.3 + d.stats.racecraft * 0.2 + d.stats.rain * 0.2;
        else if (raceType === "drift") ds = d.stats.racecraft * 0.5 + d.stats.speed * 0.3 + d.stats.consistency * 0.2;
        else if (raceType === "speed") ds = d.stats.speed * 0.45 + d.stats.racecraft * 0.35 + d.stats.consistency * 0.2;
        else ds = d.stats.stamina * 0.4 + d.stats.consistency * 0.35 + d.stats.speed * 0.25;
        // Bonus spécialité
        if (d.specialties.includes(raceType)) ds *= 1.1;
        return acc + ds;
      }, 0) / drivers.length;
      score += drvScore * 0.4;
    } else {
      score *= 0.5; // Pas de pilote = pénalité sévère
    }

    // Bonus mécaniciens
    const mechanics = this.getAssignedMechanics(carUid);
    if (mechanics.length > 0) {
      const mecBonus = mechanics.reduce((acc, m) => acc + m.stats.skill, 0) / mechanics.length;
      score += mecBonus * 0.1;
    }

    return Math.round(score);
  },

  // Calcule le risque d'accident
  calcAccidentRisk(carUid, raceData) {
    const ownedCar = this.getOwnedCar(carUid);
    if (!ownedCar) return 50;
    let risk = raceData.difficulty * 0.3;
    const avgCond = Object.values(ownedCar.condition).reduce((a, b) => a + b, 0) / 4;
    risk += (100 - avgCond) * 0.3;

    const mechanics = this.getAssignedMechanics(carUid);
    mechanics.forEach(m => { risk -= (m.bonus.accidentReduction || 0); });

    const drivers = this.getAssignedDrivers(carUid);
    drivers.forEach(d => { risk -= d.stats.consistency * 0.15; });

    return Math.max(5, Math.min(80, risk));
  },

  // Salaires mensuels (fin de saison)
  payWages() {
    let total = 0;
    this.state.drivers.forEach(d => {
      const drv = DATA.drivers.find(x => x.id === d.driverId);
      if (drv) total += drv.salary;
    });
    this.state.mechanics.forEach(m => {
      const mec = DATA.mechanics.find(x => x.id === m.mechanicId);
      if (mec) total += mec.salary;
    });
    this.state.budget -= total;
    this.save();
    return total;
  },

  // Nouvelle saison
  newSeason() {
    this.state.season++;
    this.state.completedRaces = [];
    DATA.races.forEach(r => { r.season = this.state.season; });
    this.payWages();
    this.save();
  }
};

// ---- UTILITAIRE FORMATAGE ----
function formatMoney(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function statColor(v) {
  if (v >= 80) return "#4caf50";
  if (v >= 60) return "#ff9800";
  return "#f44336";
}

function condClass(v) {
  if (v >= 70) return "cond-good";
  if (v >= 40) return "cond-ok";
  return "cond-bad";
      } 4;
    score *= (avgCond / 100);

    // Bonus pilotes
    const drivers = this.getAssignedDrivers(carUid);
    if (drivers.length > 0) {
      const drvScore = drivers.reduce((acc, d) => {
        let ds = 0;
        if (raceType === "rally")      ds = d.stats.speed * 0.3 + d.stats.consistency * 0.3 + d.stats.racecraft * 0.2 + d.stats.rain * 0.2;
        else if (raceType === "drift") ds = d.stats.racecraft * 0.5 + d.stats.speed * 0.3 + d.stats.consistency * 0.2;
        else if (raceType === "speed") ds = d.stats.speed * 0.45 + d.stats.racecraft * 0.35 + d.stats.consistency * 0.2;
        else ds = d.stats.stamina * 0.4 + d.stats.consistency * 0.35 + d.stats.speed * 0.25;
        // Bonus spécialité
        if (d.specialties.includes(raceType)) ds *= 1.1;
        return acc + ds;
      }, 0) / drivers.length;
      score += drvScore * 0.4;
    } else {
      score *= 0.5; // Pas de pilote = pénalité sévère
    }

    // Bonus mécaniciens
    const mechanics = this.getAssignedMechanics(carUid);
    if (mechanics.length > 0) {
      const mecBonus = mechanics.reduce((acc, m) => acc + m.stats.skill, 0) / mechanics.length;
      score += mecBonus * 0.1;
    }

    return Math.round(score);
  },

  // Calcule le risque d'accident
  calcAccidentRisk(carUid, raceData) {
    const ownedCar = this.getOwnedCar(carUid);
    if (!ownedCar) return 50;
    let risk = raceData.difficulty * 0.3;
    const avgCond = Object.values(ownedCar.condition).reduce((a, b) => a + b, 0) / 4;
    risk += (100 - avgCond) * 0.3;

    const mechanics = this.getAssignedMechanics(carUid);
    mechanics.forEach(m => { risk -= (m.bonus.accidentReduction || 0); });

    const drivers = this.getAssignedDrivers(carUid);
    drivers.forEach(d => { risk -= d.stats.consistency * 0.15; });

    return Math.max(5, Math.min(80, risk));
  },

  // Salaires mensuels (fin de saison)
  payWages() {
    let total = 0;
    this.state.drivers.forEach(d => {
      const drv = DATA.drivers.find(x => x.id === d.driverId);
      if (drv) total += drv.salary;
    });
    this.state.mechanics.forEach(m => {
      const mec = DATA.mechanics.find(x => x.id === m.mechanicId);
      if (mec) total += mec.salary;
    });
    this.state.budget -= total;
    this.save();
    return total;
  },

  // Nouvelle saison
  newSeason() {
    this.state.season++;
    this.state.completedRaces = [];
    DATA.races.forEach(r => { r.season = this.state.season; });
    this.payWages();
    this.save();
  }
};

// ---- UTILITAIRE FORMATAGE ----
function formatMoney(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function statColor(v) {
  if (v >= 80) return "#4caf50";
  if (v >= 60) return "#ff9800";
  return "#f44336";
}

function condClass(v) {
  if (v >= 70) return "cond-good";
  if (v >= 40) return "cond-ok";
  return "cond-bad";
                 }
