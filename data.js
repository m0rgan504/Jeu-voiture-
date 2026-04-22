// ============================
// DATA.JS — Toutes les données
// ============================

const DATA = {

  // ========== VOITURES ==========
  cars: [
    {
      id: "car_renault_clio",
      name: "Renault Clio Rally5",
      category: "Compacte",
      price: 35000,
      type: ["rally"],
      image: "🚗",
      color: "#f5c518",
      specs: { speed: 55, handling: 72, reliability: 80, endurance: 65, driftPotential: 50 },
      description: "Voiture d'entrée de gamme idéale pour le rallye. Fiable et maniable."
    },
    {
      id: "car_vw_polo",
      name: "VW Polo GTI R5",
      category: "Compacte",
      price: 55000,
      type: ["rally"],
      image: "🚙",
      color: "#2196f3",
      specs: { speed: 65, handling: 78, reliability: 82, endurance: 70, driftPotential: 55 },
      description: "Référence en WRC2. Excellente traction sur tous types de terrain."
    },
    {
      id: "car_toyota_gr",
      name: "Toyota GR Yaris",
      category: "Sport",
      price: 75000,
      type: ["rally", "speed"],
      image: "🏎️",
      color: "#e63946",
      specs: { speed: 75, handling: 80, reliability: 78, endurance: 72, driftPotential: 65 },
      description: "Polyvalent sport capable en rallye et en course de vitesse."
    },
    {
      id: "car_subaru_impreza",
      name: "Subaru Impreza WRC",
      category: "Légendaire",
      price: 95000,
      type: ["rally"],
      image: "🌀",
      color: "#1565c0",
      specs: { speed: 78, handling: 85, reliability: 74, endurance: 80, driftPotential: 60 },
      description: "Légende du WRC. Transmission intégrale exceptionnelle."
    },
    {
      id: "car_nissan_s15",
      name: "Nissan Silvia S15",
      category: "Drift",
      price: 42000,
      type: ["drift"],
      image: "💨",
      color: "#9c27b0",
      specs: { speed: 60, handling: 75, reliability: 70, endurance: 55, driftPotential: 90 },
      description: "Machine à drift par excellence. Légère et survirant parfaitement."
    },
    {
      id: "car_mazda_rx7",
      name: "Mazda RX-7 FD",
      category: "Drift",
      price: 50000,
      type: ["drift", "speed"],
      image: "🔥",
      color: "#ff6b35",
      specs: { speed: 68, handling: 80, reliability: 62, endurance: 58, driftPotential: 92 },
      description: "Moteur rotatif iconique. Extraordinaire en drift, imprévisible en endurance."
    },
    {
      id: "car_bmw_m4",
      name: "BMW M4 GT4",
      category: "GT",
      price: 120000,
      type: ["speed", "endurance"],
      image: "⚡",
      color: "#1a237e",
      specs: { speed: 85, handling: 82, reliability: 85, endurance: 88, driftPotential: 60 },
      description: "GT performant, excellent en endurance et en vitesse pure."
    },
    {
      id: "car_porsche_911",
      name: "Porsche 911 GT3",
      category: "GT",
      price: 180000,
      type: ["speed", "endurance"],
      image: "🏆",
      color: "#e91e63",
      specs: { speed: 92, handling: 90, reliability: 88, endurance: 85, driftPotential: 55 },
      description: "La référence GT. Performances exceptionnelles en circuit."
    },
    {
      id: "car_ferrari_488",
      name: "Ferrari 488 GTE",
      category: "Prototype",
      price: 280000,
      type: ["speed", "endurance"],
      image: "🔴",
      color: "#c62828",
      specs: { speed: 96, handling: 88, reliability: 80, endurance: 90, driftPotential: 50 },
      description: "Voiture de compétition pure. L'ultime machine pour l'endurance GT."
    },
    {
      id: "car_toyota_ts050",
      name: "Toyota TS050 Prototype",
      category: "LMP1",
      price: 500000,
      type: ["endurance"],
      image: "🛸",
      color: "#e63946",
      specs: { speed: 99, handling: 92, reliability: 85, endurance: 95, driftPotential: 40 },
      description: "Prototype LMP1 hybride. La machine la plus rapide du monde en endurance."
    }
  ],

  // ========== PILOTES ==========
  drivers: [
    {
      id: "drv_marc_lebrun",
      name: "Marc Lebrun",
      nationality: "🇫🇷",
      age: 24,
      salary: 8000,
      stars: 2,
      specialties: ["rally"],
      stats: { speed: 55, consistency: 60, racecraft: 50, stamina: 65, rain: 55 },
      traits: ["Bon sous la pluie"],
      description: "Jeune pilote prometteur, bonnes bases en rallye."
    },
    {
      id: "drv_sofia_reyes",
      name: "Sofia Reyes",
      nationality: "🇪🇸",
      age: 27,
      salary: 14000,
      stars: 3,
      specialties: ["drift", "speed"],
      stats: { speed: 68, consistency: 65, racecraft: 72, stamina: 60, rain: 62 },
      traits: ["Maître du drift", "Agressif"],
      description: "Spécialiste du drift, redoutable en course de vitesse."
    },
    {
      id: "drv_kenji_tanaka",
      name: "Kenji Tanaka",
      nationality: "🇯🇵",
      age: 30,
      salary: 18000,
      stars: 3,
      specialties: ["drift"],
      stats: { speed: 65, consistency: 78, racecraft: 75, stamina: 68, rain: 70 },
      traits: ["Précision extrême", "Calme sous pression"],
      description: "Légende du drift japonais. Technique irréprochable."
    },
    {
      id: "drv_pierre_duval",
      name: "Pierre Duval",
      nationality: "🇫🇷",
      age: 28,
      salary: 22000,
      stars: 4,
      specialties: ["rally", "speed"],
      stats: { speed: 78, consistency: 72, racecraft: 76, stamina: 75, rain: 80 },
      traits: ["Expert rallye", "Bonne gestion des pneus"],
      description: "Pilote expérimenté WRC. Rapide et régulier en toutes conditions."
    },
    {
      id: "drv_anna_kozlov",
      name: "Anna Kozlov",
      nationality: "🇷🇺",
      age: 25,
      salary: 16000,
      stars: 3,
      specialties: ["endurance", "speed"],
      stats: { speed: 70, consistency: 80, racecraft: 70, stamina: 88, rain: 72 },
      traits: ["Endurance exceptionnelle", "Gestion carburant"],
      description: "Spécialiste de l'endurance. Parfaite pour les longues courses."
    },
    {
      id: "drv_carlos_vega",
      name: "Carlos Vega",
      nationality: "🇲🇽",
      age: 32,
      salary: 28000,
      stars: 4,
      specialties: ["speed", "endurance"],
      stats: { speed: 82, consistency: 78, racecraft: 84, stamina: 80, rain: 74 },
      traits: ["Dépassements chirurgicaux", "Grand expérimenté"],
      description: "Vétéran des circuits. Excellent stratège en course."
    },
    {
      id: "drv_lena_bruner",
      name: "Lena Bruner",
      nationality: "🇩🇪",
      age: 29,
      salary: 35000,
      stars: 5,
      specialties: ["speed", "endurance", "rally"],
      stats: { speed: 90, consistency: 88, racecraft: 92, stamina: 85, rain: 88 },
      traits: ["Pilote polyvalent", "Champion potentiel", "Leader"],
      description: "L'une des meilleures du plateau. Performante dans toutes les disciplines."
    },
    {
      id: "drv_riku_moto",
      name: "Riku Moto",
      nationality: "🇯🇵",
      age: 22,
      salary: 5000,
      stars: 1,
      specialties: ["rally"],
      stats: { speed: 42, consistency: 45, racecraft: 38, stamina: 55, rain: 48 },
      traits: ["Débutant enthousiaste"],
      description: "Tout jeune pilote. Beaucoup de potentiel mais peu d'expérience."
    }
  ],

  // ========== MÉCANICIENS ==========
  mechanics: [
    {
      id: "mec_hassan_ali",
      name: "Hassan Ali",
      nationality: "🇲🇦",
      age: 35,
      salary: 3500,
      stars: 2,
      specialties: ["moteur", "frein"],
      stats: { skill: 55, speed: 60, reliability: 65, stress: 55 },
      bonus: { accidentReduction: 3, partWear: 5 },
      description: "Mécanicien fiable. Bonne maîtrise des réparations basiques."
    },
    {
      id: "mec_yuki_sato",
      name: "Yuki Sato",
      nationality: "🇯🇵",
      age: 28,
      salary: 5000,
      stars: 3,
      specialties: ["suspension", "carrosserie"],
      stats: { skill: 68, speed: 72, reliability: 70, stress: 68 },
      bonus: { accidentReduction: 5, partWear: 8 },
      description: "Spécialiste de la suspension. Améliore significativement la maniabilité."
    },
    {
      id: "mec_francois_martin",
      name: "François Martin",
      nationality: "🇫🇷",
      age: 42,
      salary: 7000,
      stars: 4,
      specialties: ["moteur", "stratégie"],
      stats: { skill: 80, speed: 78, reliability: 85, stress: 80 },
      bonus: { accidentReduction: 8, partWear: 12 },
      description: "Vieux routier de la mécanique. Son expérience vaut de l'or."
    },
    {
      id: "mec_petra_holz",
      name: "Petra Holz",
      nationality: "🇩🇪",
      age: 38,
      salary: 10000,
      stars: 5,
      specialties: ["aéro", "moteur", "suspension", "stratégie"],
      stats: { skill: 95, speed: 90, reliability: 92, stress: 90 },
      bonus: { accidentReduction: 15, partWear: 20 },
      description: "Chef mécanicienne d'élite. Ancienne ingénieure F1."
    },
    {
      id: "mec_pablo_gomez",
      name: "Pablo Gomez",
      nationality: "🇧🇷",
      age: 31,
      salary: 4000,
      stars: 2,
      specialties: ["frein", "pneus"],
      stats: { skill: 60, speed: 65, reliability: 58, stress: 62 },
      bonus: { accidentReduction: 4, partWear: 6 },
      description: "Expert en pneumatiques et freinage. Rapide aux arrêts."
    }
  ],

  // ========== PIÈCES (par catégorie) ==========
  parts: {
    tires: [
      { id: "tire_standard", name: "Pneus Standard", price: 0, bonus: {}, wear: 100, description: "Pneus d'origine. Équilibre correct.", equipped: true },
      { id: "tire_sport", name: "Pneus Sport", price: 3000, bonus: { speed: 5, handling: 5 }, wear: 80, description: "Meilleure adhérence, s'usent plus vite." },
      { id: "tire_endurance", name: "Pneus Endurance", price: 4500, bonus: { reliability: 8, endurance: 10 }, wear: 140, description: "Dure longtemps, moins rapides." },
      { id: "tire_slick", name: "Slicks Pro", price: 8000, bonus: { speed: 12, handling: 10 }, wear: 60, description: "Pneus de piste ultra-performants. Fragiles." },
      { id: "tire_rally", name: "Pneus Rallye Terre", price: 5500, bonus: { handling: 15, driftPotential: 8 }, wear: 90, description: "Idéaux sur terre et gravier." }
    ],
    brakes: [
      { id: "brake_standard", name: "Freins Standard", price: 0, bonus: {}, wear: 100, description: "Freins d'origine.", equipped: true },
      { id: "brake_sport", name: "Freins Sport", price: 5000, bonus: { handling: 6, reliability: 5 }, wear: 90, description: "Freinage plus court et plus sûr." },
      { id: "brake_carbon", name: "Freins Carbone", price: 15000, bonus: { handling: 12, speed: 3, reliability: 8 }, wear: 70, description: "Freins carbone-céramique. Performance maximale." },
      { id: "brake_endurance", name: "Freins Endurance", price: 9000, bonus: { reliability: 12, endurance: 8 }, wear: 130, description: "Excellente durabilité sur les longues distances." }
    ],
    chassis: [
      { id: "chassis_standard", name: "Châssis Standard", price: 0, bonus: {}, wear: 100, description: "Châssis d'origine.", equipped: true },
      { id: "chassis_reinforced", name: "Châssis Renforcé", price: 12000, bonus: { reliability: 10, endurance: 8 }, wear: 150, description: "Résiste mieux aux accidents. Plus lourd." },
      { id: "chassis_carbon", name: "Châssis Carbone", price: 35000, bonus: { speed: 8, handling: 8, reliability: 6 }, wear: 120, description: "Ultra-léger. Améliore toutes les performances." },
      { id: "chassis_aero", name: "Châssis Aéro", price: 22000, bonus: { speed: 12, handling: 10 }, wear: 100, description: "Optimisé aérodynamiquement pour les hautes vitesses." }
    ],
    body: [
      { id: "body_standard", name: "Carrosserie Standard", price: 0, bonus: {}, wear: 100, description: "Carrosserie d'origine.", equipped: true },
      { id: "body_wide", name: "Carrosserie Wide-Body", price: 8000, bonus: { handling: 8, driftPotential: 10 }, wear: 90, description: "Extensions d'ailes pour plus de stabilité." },
      { id: "body_aero", name: "Kit Aéro Course", price: 18000, bonus: { speed: 10, handling: 6 }, wear: 100, description: "Aileron, splitter et diffuseur. Downforce maximale." },
      { id: "body_rally", name: "Carrosserie Rallye", price: 11000, bonus: { reliability: 8, handling: 6, endurance: 5 }, wear: 120, description: "Renforcée pour résister aux terrains difficiles." }
    ]
  },

  // ========== SPONSORS ==========
  sponsors: [
    {
      id: "spon_castrol",
      name: "Castrol Motor",
      logo: "🛢️",
      payPerRace: 8000,
      condition: { type: "min_position", value: 10 },
      conditionText: "Finir dans le Top 10 à chaque course",
      color: "#4caf50",
      prestige: 2
    },
    {
      id: "spon_redbull",
      name: "Red Bull Racing",
      logo: "🐂",
      payPerRace: 20000,
      condition: { type: "min_position", value: 5 },
      conditionText: "Finir dans le Top 5 au moins 1 course sur 3",
      every: 3,
      color: "#e63946",
      prestige: 5
    },
    {
      id: "spon_michelin",
      name: "Michelin Motorsport",
      logo: "🔵",
      payPerRace: 12000,
      condition: { type: "no_dnf", value: true },
      conditionText: "Aucun abandon dans les 5 dernières courses",
      color: "#2196f3",
      prestige: 3
    },
    {
      id: "spon_sparco",
      name: "Sparco",
      logo: "🪑",
      payPerRace: 5000,
      condition: { type: "participate", value: 1 },
      conditionText: "Participer à toutes les courses",
      color: "#ff9800",
      prestige: 1
    },
    {
      id: "spon_hankook",
      name: "Hankook Tires",
      logo: "⭕",
      payPerRace: 7000,
      condition: { type: "specific_type", value: "rally" },
      conditionText: "Participer à au moins 2 courses de rallye par saison",
      color: "#9c27b0",
      prestige: 2
    },
    {
      id: "spon_rolex",
      name: "Rolex Endurance",
      logo: "⌚",
      payPerRace: 30000,
      condition: { type: "specific_type", value: "endurance" },
      conditionText: "Participer à toutes les courses d'endurance (exige 3 pilotes)",
      color: "#ffd700",
      prestige: 5
    },
    {
      id: "spon_motul",
      name: "Motul France",
      logo: "🔶",
      payPerRace: 6000,
      condition: { type: "finish_rate", value: 0.66 },
      conditionText: "Finir au moins 2 courses sur 3",
      color: "#ff6b35",
      prestige: 2
    }
  ],

  // ========== COURSES ==========
  races: [
    // RALLYE
    {
      id: "race_r1",
      name: "Rallye de Monte-Carlo",
      type: "rally",
      icon: "🌲",
      location: "Monaco",
      duration: "3 jours",
      durationMin: 10,
      prize: [5000, 12000, 20000, 30000, 45000],
      points: [25, 18, 15, 12, 10],
      difficulty: 65,
      requirePilots: 2,
      requireMechanics: 1,
      description: "Parcours neige et glace en altitude. Nécessite 2 pilotes (pilote + copilote).",
      season: 1,
      minCarType: ["rally"]
    },
    {
      id: "race_r2",
      name: "Rallye de Suède",
      type: "rally",
      icon: "❄️",
      location: "Suède",
      duration: "2 jours",
      durationMin: 8,
      prize: [4000, 9000, 16000, 24000, 36000],
      points: [25, 18, 15, 12, 10],
      difficulty: 60,
      requirePilots: 2,
      requireMechanics: 1,
      description: "Spéciales sur neige. Pneus à clous obligatoires.",
      season: 1,
      minCarType: ["rally"]
    },
    // DRIFT
    {
      id: "race_d1",
      name: "Formula Drift — Paris",
      type: "drift",
      icon: "💨",
      location: "Paris",
      duration: "1 journée",
      durationMin: 6,
      prize: [3000, 8000, 14000, 22000, 35000],
      points: [25, 18, 15, 12, 10],
      difficulty: 55,
      requirePilots: 1,
      requireMechanics: 2,
      description: "Compétition de drift jugée sur style et angle. 1 pilote + 2 mécanos.",
      season: 1,
      minCarType: ["drift"]
    },
    {
      id: "race_d2",
      name: "Drift King Trophy",
      type: "drift",
      icon: "🔥",
      location: "Tokyo",
      duration: "2 journées",
      durationMin: 8,
      prize: [6000, 14000, 24000, 38000, 55000],
      points: [25, 18, 15, 12, 10],
      difficulty: 75,
      requirePilots: 1,
      requireMechanics: 2,
      description: "Le plus prestigieux championnat de drift asiatique.",
      season: 1,
      minCarType: ["drift"]
    },
    // VITESSE
    {
      id: "race_s1",
      name: "GT Open — Spa",
      type: "speed",
      icon: "⚡",
      location: "Belgique",
      duration: "45 min",
      durationMin: 12,
      prize: [8000, 18000, 32000, 50000, 75000],
      points: [25, 18, 15, 12, 10],
      difficulty: 70,
      requirePilots: 1,
      requireMechanics: 2,
      description: "Sprint sur le mythique circuit de Spa-Francorchamps.",
      season: 1,
      minCarType: ["speed", "endurance"]
    },
    {
      id: "race_s2",
      name: "Monza Speed Challenge",
      type: "speed",
      icon: "🏎️",
      location: "Italie",
      duration: "1h",
      durationMin: 15,
      prize: [10000, 22000, 38000, 60000, 90000],
      points: [25, 18, 15, 12, 10],
      difficulty: 72,
      requirePilots: 1,
      requireMechanics: 2,
      description: "La cathédrale de la vitesse. Circuit ultra-rapide.",
      season: 1,
      minCarType: ["speed", "endurance"]
    },
    // ENDURANCE
    {
      id: "race_e1",
      name: "6 Heures de Barcelone",
      type: "endurance",
      icon: "⏱️",
      location: "Espagne",
      duration: "6h",
      durationMin: 25,
      prize: [20000, 45000, 80000, 120000, 180000],
      points: [25, 18, 15, 12, 10],
      difficulty: 78,
      requirePilots: 2,
      requireMechanics: 3,
      description: "Endurance de 6h. Nécessite 2 pilotes et 3 mécanos pour les relais.",
      season: 1,
      minCarType: ["endurance", "speed"]
    },
    {
      id: "race_e2",
      name: "12 Heures de Sebring",
      type: "endurance",
      icon: "🌙",
      location: "USA",
      duration: "12h",
      durationMin: 40,
      prize: [50000, 100000, 180000, 280000, 400000],
      points: [25, 18, 15, 12, 10],
      difficulty: 85,
      requirePilots: 3,
      requireMechanics: 3,
      description: "Course de nuit exigeante. 3 pilotes obligatoires pour les relais.",
      season: 1,
      minCarType: ["endurance"]
    },
    {
      id: "race_e3",
      name: "24 Heures du Mans",
      type: "endurance",
      icon: "🏆",
      location: "France",
      duration: "24h",
      durationMin: 60,
      prize: [100000, 250000, 450000, 700000, 1000000],
      points: [50, 36, 30, 24, 20],
      difficulty: 95,
      requirePilots: 3,
      requireMechanics: 4,
      description: "La course la plus célèbre au monde. 3 pilotes + 4 mécanos minimum.",
      season: 1,
      minCarType: ["endurance"]
    }
  ]

};
