const classificationData = {
  surface_classification: {
    id: 1,
    types: [
      {
        id: 101,
        name: {
          fr: "surface en tissu",
          en: "cloth surface"
        },
        properties: [
          {
            fr: "La surface avec différents motifs de tissu affecte la friction, la résistance à l'usure et le bruit.",
            en: "The surface with different fabric patterns affects friction, wear resistance and noise."
          },
          {
            fr: "L’épaisseur du tissu améliore la résistance à l’usure, la durée de vie et la capacité de charge du courroie.",
            en: "The fabric thickness improves wear resistance, service life, and belt load capacity."
          },
          {
            fr: "L'élasticité du tissu (horizontale et verticale) joue un rôle important dans la performance et la stabilité du fonctionnement.",
            en: "The fabric’s horizontal and vertical elasticity plays an important role in performance and operational stability."
          }
        ]
      },
      {
        id: 102,
        name: {
          fr: "surface lisse",
          en: "smooth surface"
        },
        properties: [
          {
            fr: "Surface lisse (pas de description détaillée sur la page).",
            en: "Smooth surface (no detailed description on the page)."
          }
        ]
      },
      {
        id: 103,
        name: {
          fr: "surface alvéolée",
          en: "pitted surface"
        },
        properties: [
          {
            fr: "Surface criblée ou alvéolée (pas de description détaillée sur la page).",
            en: "Pitted or dimpled surface (no detailed description on the page)."
          }
        ],
         images: [
          "/images/cloth1.jpg",
          "/images/cloth2.jpg",
          "/images/cloth3.jpg",
          "/images/cloth4.jpg"
        ]
      }
    ],
   
  },

  fiber_classification: {
    id: 2,
    types: [
      {
        id: 201,
        name: {
          fr: "Aramide",
          en: "Aramid"
        },
        properties: [
          {
            fr: "Très haute résistance, environ 5 fois celle de l’acier mais beaucoup plus léger.",
            en: "Very high strength, about 5 times that of steel but much lighter."
          },
          {
            fr: "Résistance thermique jusqu'à 370 ℃.",
            en: "Heat resistance up to 370°C."
          },
          {
            fr: "Excellente résistance chimique.",
            en: "Excellent chemical resistance."
          },
          {
            fr: "Auto-extinguible, retardateur de flamme.",
            en: "Self-extinguishing, flame retardant."
          },
          {
            fr: "Bonne isolation électrique.",
            en: "Good electrical insulation."
          },
          {
            fr: "Bonne résistance à l’usure.",
            en: "Good wear resistance."
          },
          {
            fr: "Très bonne résistance à la fatigue.",
            en: "Very good fatigue resistance."
          },
          {
            fr: "Matériau très léger.",
            en: "Very lightweight material."
          }
        ],
        advantages_in_belts: [
          {
            fr: "Augmente la résistance de la courroie",
            en: "Increases belt strength"
          },
          {
            fr: "Réduction du poids",
            en: "Weight reduction"
          },
          {
            fr: "Améliore la résistance à la chaleur",
            en: "Improves heat resistance"
          },
          {
            fr: "Améliore la résistance chimique",
            en: "Improves chemical resistance"
          },
          {
            fr: "Augmente la durabilité",
            en: "Increases durability"
          },
          {
            fr: "Performance retardatrice de flamme",
            en: "Flame-retardant performance"
          },
          {
            fr: "Améliore l’isolation électrique",
            en: "Improves electrical insulation"
          }
        ],
         images: [
          "./aramid/1.jpg",
          "./aramid/2.jpg",
          "./aramid/3.jpg",
         
        ]
      }
    ],
   
  },

  raw_material_classification: {
    id: 3,
    types: [
      {
        id: 301,
        name: {
          fr: "Caoutchouc chloroprène (CR)",
          en: "Chloroprene rubber (CR)"
        },
        properties: [
          {
            fr: "Haute résistance à la traction et à l’usure",
            en: "High tensile and wear resistance"
          },
          {
            fr: "Grande élasticité",
            en: "High elasticity"
          },
          {
            fr: "Surface lisse et confortable",
            en: "Smooth and comfortable surface"
          },
          {
            fr: "Très bonne résistance aux intempéries",
            en: "Very good weather resistance"
          },
          {
            fr: "Facile à nettoyer",
            en: "Easy to clean"
          },
          {
            fr: "Longue durée de vie",
            en: "Long service life"
          }
        ],
           images: [
          "./chloroprene/1.jpg",
          "./chloroprene/2.jpg",
          "./chloroprene/3.jpg",
          "./chloroprene/4.jpg",
          
        ]
      },
      {
        id: 302,
        name: {
          fr: "HNBR",
          en: "HNBR"
        },
        properties: [
          {
            fr: "Résistance à la chaleur",
            en: "Heat resistance"
          },
          {
            fr: "Résistance aux UV, ozone et produits chimiques",
            en: "UV, ozone and chemical resistance"
          },
          {
            fr: "Résistance à l’huile",
            en: "Oil resistance"
          },
          {
            fr: "Excellente résistance à l’usure",
            en: "Excellent wear resistance"
          },
          {
            fr: "Haute élasticité",
            en: "High elasticity"
          },
          {
            fr: "Réduction du bruit",
            en: "Noise reduction"
          },
          {
            fr: "Respectueux de l’environnement",
            en: "Environmentally friendly"
          }
        ],
           images: [
          "/images/cloth1.jpg",
          "/images/cloth2.jpg",
          "/images/cloth3.jpg",
          "/images/cloth4.jpg"
        ]
      },
      {
        id: 303,
        name: {
          fr: "EPDM",
          en: "EPDM"
        },
        properties: [
          {
            fr: "Résistance à la chaleur",
            en: "Heat resistance"
          },
          {
            fr: "Résistance aux UV, ozone et vieillissement",
            en: "UV, ozone and aging resistance"
          },
          {
            fr: "Bonne résistance chimique",
            en: "Good chemical resistance"
          },
          {
            fr: "Bonne isolation électrique",
            en: "Good electrical insulation"
          },
          {
            fr: "Bonne résistance à l’eau",
            en: "Good water resistance"
          },
          {
            fr: "Matériau écologique sans substances nocives",
            en: "Eco-friendly material without harmful substances"
          }
        ],
           images: [
          "/images/cloth1.jpg",
          "/images/cloth2.jpg",
          "/images/cloth3.jpg",
          "/images/cloth4.jpg"
        ]
      }
    ],
 
  }
};

export default classificationData;
