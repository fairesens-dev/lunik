UPDATE configurator_settings 
SET data = '[
  {
    "id": "led-coffre",
    "label": "Éclairage LED sous coffre SOMFY",
    "description": "Éclairage d''ambiance intégré sous le coffre du store, pilotable depuis votre télécommande",
    "price": 859,
    "active": true,
    "highlight": true,
    "icon": "",
    "savingsLabel": "POPULAIRE",
    "imageUrl": "",
    "tip": "« L''éclairage LED a transformé nos soirées d''été » — Marie, Lyon",
    "socialProof": "78% des clients choisissent cette option"
  },
  {
    "id": "led-bras",
    "label": "Éclairage LED sous les bras SOMFY",
    "description": "Éclairage puissant sous les bras pour un rendu spectaculaire et une luminosité optimale",
    "price": 959,
    "active": true,
    "highlight": true,
    "icon": "",
    "savingsLabel": "COUP DE CŒUR",
    "imageUrl": "",
    "tip": "« L''effet est bluffant, tous nos invités nous demandent la référence » — Thomas, Bordeaux",
    "socialProof": "Option la mieux notée par nos clients"
  },
  {
    "id": "capteur-vent",
    "label": "Automatisme Vent SOMFY 3D IO",
    "description": "Capteur vent intégré : votre store se rétracte automatiquement pour se protéger",
    "price": 199,
    "active": true,
    "highlight": true,
    "icon": "",
    "savingsLabel": "RECOMMANDÉ",
    "imageUrl": "",
    "tip": "« Indispensable, ça m''a sauvé le store lors d''une tempête » — Pascal, Nantes",
    "socialProof": "Recommandé par 9 installateurs sur 10"
  },
  {
    "id": "pose-plafond",
    "label": "Pose plafond avec équerre",
    "description": "Kit de fixation complet pour montage au plafond (sous-face, pergola, avancée de toit)",
    "price": 289,
    "active": true,
    "highlight": false,
    "icon": "",
    "savingsLabel": "",
    "imageUrl": "",
    "tip": "Idéal si vous ne disposez pas de façade porteuse",
    "socialProof": ""
  },
  {
    "id": "manoeuvre-manuelle",
    "label": "Manœuvre manuelle treuil + manivelle",
    "description": "Remplace la motorisation SOMFY incluse de série (réduction de 619 €)",
    "price": -619,
    "active": true,
    "highlight": false,
    "icon": "",
    "savingsLabel": "ÉCONOMIE",
    "imageUrl": "",
    "tip": "",
    "socialProof": ""
  },
  {
    "id": "radio-csi",
    "label": "Manœuvre SOMFY RADIO CSI",
    "description": "Commande radio SOMFY CSI avec secours intégré · Pilotage avancé et intégration domotique",
    "price": 199,
    "active": true,
    "highlight": false,
    "icon": "",
    "savingsLabel": "DOMOTIQUE",
    "imageUrl": "",
    "tip": "Compatible TaHoma, Alexa et Google Home",
    "socialProof": "Plébiscitée par les passionnés de maison connectée"
  }
]'::jsonb
WHERE id = 'options';