// ============================
// RACE.JS — Moteur de simulation de course
// ============================

const RACE = {

  // Lance une course
  async run(raceId, carUid) {
    const raceData = DATA.races.find(r => r.id === raceId);
    const ownedCar = GAME.getOwnedCar(carUid);
    if (!raceData || !ownedCar) return;

    const carData = GAME.getCarData(ownedCar.carId);
    const drivers = GAME.getAssignedDrivers(carUid);
    const mechanics = GAME.getAssignedMechanics(carUid);

    // Afficher la modal de course
    UI.showRaceModal(raceData);

    const score = GAME.calcCarScore(carUid, raceData.type);
    const accidentRisk = GAME.calcAccidentRisk(carUid, raceData);

    // Nombre de concurrents IA
    const aiCount = 11;
    const events = [];
    let dnf = false;
    let accidentOccurred = false;
    let finalPosition = 1;

    // ---- SIMULATION D'ÉVÉNEMENTS ----
    const totalMinutes = raceData.durationMin;
    const eventCount = Math.floor(totalMinutes / 4) + 3;

    for (let i = 0; i < eventCount; i++) {
      const minute = Math.round((i / eventCount) * totalMinutes);
      await this.delay(320);

      const roll = Math.random() * 100;
      const phase = i / eventCount;

      // Accident
      if (!dnf && roll < accidentRisk * 0.08) {
        const severity = Math.random();
        if (severity > 0.75) {
          dnf = true;
          accidentOccurred = true;
          events.push({ time: minute, text: `💥 ACCIDENT GRAVE — Abandon forcé ! La voiture est hors course.`, type: "accident" });
          UI.addRaceLog(minute, `💥 ACCIDENT GRAVE — Abandon forcé !`, "event-accident");
          break;
        } else {
          accidentOccurred = true;
          const dmg = Math.round(severity * 30) + 10;
          events.push({ time: minute, text: `⚠️ Accrochage ! Dommages sur la carrosserie (−${dmg}%)`, type: "accident" });
          UI.addRaceLog(minute, `⚠️ Accrochage — Dommages carrosserie (−${dmg}%)`, "event-accident");
          ownedCar.condition.body = Math.max(5, ownedCar.condition.body - dmg);
        }
      }
      // Pneus
      else if (roll < 25 && raceData.type !== "endurance") {
        const wear = Math.round(Math.random() * 15) + 5;
        ownedCar.condition.tires = Math.max(5, ownedCar.condition.tires - wear);
        events.push({ time: minute, text: `🔄 Usure des pneus détectée (−${wear}%)` });
        UI.addRaceLog(minute, `Pneus en dégradation (−${wear}%)`, "");
      }
      // Dépassement
      else if (roll < 45 && score > 50) {
        const bonus = Math.round(Math.random() * 3) + 1;
        events.push({ time: minute, text: `🚀 Dépassement ! Position gagnée.`, type: "overtake" });
        UI.addRaceLog(minute, `Dépassement brillant !`, "event-overtake");
      }
      // Arrêt aux stands (endurance)
      else if (raceData.type === "endurance" && phase > 0.3 && phase < 0.8 && i % 4 === 0) {
        const mecSkill = mechanics.length > 0 ? mechanics[0].stats.speed : 50;
        const pitTime = Math.round(25 - mecSkill * 0.1);
        events.push({ time: minute, text: `🔧 Arrêt aux stands — ${pitTime}s. Pneus et carburant.`, type: "pit" });
        UI.addRaceLog(minute, `Arrêt aux stands (${pitTime}s) — Changement de pilote`, "event-pit");
        ownedCar.condition.tires = Math.min(100, ownedCar.condition.tires + 60);
        ownedCar.condition.brakes = Math.min(100, ownedCar.condition.brakes + 30);
      }
      // Bonne passe
      else if (roll > 85) {
        const drvName = drivers.length > 0 ? drivers[Math.floor(Math.random() * drivers.length)].name : "Le pilote";
        events.push({ time: minute, text: `⭐ ${drvName} réalise un tour parfait !`, type: "good" });
        UI.addRaceLog(minute, `${drvName} : tour parfait !`, "event-good");
      }
      // Usure freins endurance
      else if (raceData.type === "endurance" || raceData.type === "speed") {
        const bWear = Math.round(Math.random() * 8) + 2;
        ownedCar.condition.brakes = Math.max(5, ownedCar.condition.brakes - bWear);
      }
    }

    // ---- CALCUL DU CLASSEMENT FINAL ----
    if (!dnf) {
      const noise = (Math.random() - 0.5) * 30;
      const adjustedScore = score + noise;

      // Score minimum pour finir dans le top
      if (adjustedScore >= 120) finalPosition = Math.floor(Math.random() * 3) + 1;
      else if (adjustedScore >= 90) finalPosition = Math.floor(Math.random() * 4) + 2;
      else if (adjustedScore >= 70) finalPosition = Math.floor(Math.random() * 4) + 4;
      else if (adjustedScore >= 50) finalPosition = Math.floor(Math.random() * 4) + 7;
      else finalPosition = Math.floor(Math.random() * 3) + 9;

      // Bonus spécialité mode
      if (GAME.state.mode === raceData.type) finalPosition = Math.max(1, finalPosition - 1);
    }

    await this.delay(600);

    // ---- RÉCOMPENSES ----
    let prizeEarned = 0;
    let pointsEarned = 0;
    let sponsorBonus = 0;

    if (!dnf) {
      const prizeIdx = Math.min(finalPosition - 1, raceData.prize.length - 1);
      prizeEarned = raceData.prize[prizeIdx] || raceData.prize[raceData.prize.length - 1];
      pointsEarned = raceData.points[prizeIdx] || 0;

      // Sponsors
      GAME.state.sponsors.forEach(sp => {
        const sponData = GAME.getSponsorData(sp.sponsorId);
        if (!sponData) return;
        sp.raceCount = (sp.raceCount || 0) + 1;
        let condOk = false;
        if (sponData.condition.type === "min_position" && finalPosition <= sponData.condition.value) condOk = true;
        if (sponData.condition.type === "no_dnf") condOk = true;
        if (sponData.condition.type === "participate") condOk = true;
        if (sponData.condition.type === "specific_type" && raceData.type === sponData.condition.value) condOk = true;
        if (sponData.condition.type === "finish_rate") condOk = true;
        if (condOk) {
          sponsorBonus += sponData.payPerRace;
          sp.failCount = Math.max(0, (sp.failCount || 0) - 1);
        } else {
          sp.failCount = (sp.failCount || 0) + 1;
        }
      });

      GAME.earn(prizeEarned + sponsorBonus);
      GAME.state.points += pointsEarned;
      if (finalPosition === 1) GAME.state.stats.wins++;
      if (finalPosition <= 3) GAME.state.stats.podiums++;
      GAME.state.stats.races++;
      GAME.state.reputation = Math.min(100, GAME.state.reputation + Math.floor(pointsEarned / 5));
    } else {
      GAME.state.stats.dnf++;
      GAME.state.stats.races++;
      GAME.state.stats.accidents++;
    }

    if (accidentOccurred && !dnf) GAME.state.stats.accidents++;

    // Enregistrer la course
    GAME.state.completedRaces.push(raceId);
    GAME.state.raceHistory.push({
      raceId,
      season: GAME.state.season,
      position: dnf ? "DNF" : finalPosition,
      prize: prizeEarned,
      sponsorBonus,
      dnf,
      accident: accidentOccurred,
      carId: ownedCar.carId,
      driverIds: [...ownedCar.assignedDrivers]
    });

    GAME.save();

    // Usure globale selon durée de course
    const wearFactor = raceData.durationMin / 10;
    ownedCar.condition.tires = Math.max(5, ownedCar.condition.tires - Math.round(wearFactor * 8));
    ownedCar.condition.brakes = Math.max(5, ownedCar.condition.brakes - Math.round(wearFactor * 5));
    ownedCar.condition.chassis = Math.max(10, ownedCar.condition.chassis - Math.round(wearFactor * 3));
    ownedCar.condition.body = Math.max(10, ownedCar.condition.body - Math.round(wearFactor * 4));
    GAME.save();

    // ---- AFFICHAGE RÉSULTATS ----
    await this.delay(400);
    UI.showRaceResult({
      dnf,
      position: dnf ? "DNF" : finalPosition,
      prize: prizeEarned,
      sponsorBonus,
      points: pointsEarned,
      accidentOccurred,
      condition: ownedCar.condition,
      raceName: raceData.name
    });
  },

  delay(ms) { return new Promise(r => setTimeout(r, ms)); },

  // Vérifie si une course est valide pour une voiture
  canEnterRace(raceId, carUid) {
    const raceData = DATA.races.find(r => r.id === raceId);
    const ownedCar = GAME.getOwnedCar(carUid);
    if (!raceData || !ownedCar) return { ok: false, reasons: ["Données invalides."] };

    const carData = GAME.getCarData(ownedCar.carId);
    const drivers = GAME.getAssignedDrivers(carUid);
    const mechanics = GAME.getAssignedMechanics(carUid);
    const reasons = [];

    // Type de voiture compatible
    const typeCompatible = raceData.minCarType.some(t => carData.type.includes(t));
    if (!typeCompatible) reasons.push(`Cette voiture n'est pas homologuée pour le ${raceData.type}.`);

    // Nombre de pilotes
    if (drivers.length < raceData.requirePilots)
      reasons.push(`${raceData.requirePilots} pilote(s) requis (vous en avez ${drivers.length}).`);

    // Nombre de mécaniciens
    if (mechanics.length < raceData.requireMechanics)
      reasons.push(`${raceData.requireMechanics} mécanicien(s) requis (vous en avez ${mechanics.length}).`);

    // Course déjà faite
    if (GAME.state.completedRaces.includes(raceId))
      reasons.push("Vous avez déjà participé à cette course.");

    return { ok: reasons.length === 0, reasons };
  }
};
