/* ==========================================================================
   D R AROMA — AUTHENTIC PRODUCT CATALOG DATA
   Tripolia Bazar, Jaipur • Est. 1960
   ========================================================================== */

export const products = [
  {
    id: 'rooh-gulab-1960',
    name: 'Rooh Gulab 1960',
    title: 'Rooh Gulab 1960 • Pure Damask Rose',
    subtitle: 'Hydro-distilled Chaitra Damask Rose on Traditional Sandalwood Base',
    category: 'attar',
    categoryName: 'Royal Attar',
    family: 'Floral',
    familyName: 'Noble Floral',
    isBestseller: true,
    featured: true,
    alcoholFree: true,
    distillationMethod: 'Time-honored slow floral distillation',
    harvestSeason: 'Chaitra (March - April)',
    origin: 'Kannauj & Pushkar Rose Gardens',
    image: '/images/rooh-gulab.jpg',
    basePrice: 1850,
    sizes: [
      { id: '3ml', label: '3ml Pure Tola Vial', priceMultiplier: 1.0, isDefault: true },
      { id: '6ml', label: '6ml Royal Crystal Flacon', priceMultiplier: 1.85 },
      { id: '12ml', label: '12ml Heirloom Carved Tola', priceMultiplier: 3.4 },
      { id: '50ml', label: '50ml Fine French Atomizer (Extrait 30%)', priceMultiplier: 2.8 }
    ],
    carrierBases: [
      { id: 'sandalwood', label: 'Traditional Sandalwood Oil Base (Alcohol-Free)', priceAdd: 0, isDefault: true },
      { id: 'jojoba', label: 'Cold-Pressed Organic Jojoba (Silky & Light)', priceAdd: 0 },
      { id: 'extrait-spirit', label: 'Aged Grain Spirits (Atomizer Extrait Spray)', priceAdd: 150 }
    ],
    pyramid: {
      top: {
        title: 'Top Notes (First 30 Mins)',
        notes: 'Dewy Morning Damask Rose, Green Rose Leaves, Mild Cardamom Whisper',
        duration: 'Initial Bloom'
      },
      heart: {
        title: 'Heart Notes (1 to 4 Hours)',
        notes: 'Heirloom Crimson Rose Absolute, Turkish Rose Petals, Saffron Thread',
        duration: 'Full Floral Majesty'
      },
      base: {
        title: 'Base Notes (6 to 24+ Hours)',
        notes: 'Aged Sandalwood, Warm Earth Resin, Velvet Amber',
        duration: 'Enduring Warmth'
      }
    },
    story: 'Conceived in 1960 by our founding perfumer in Tripolia Bazar, Rooh Gulab is the crown jewel of D R Aroma. Hand-plucked wild Rosa Damascena petals are gently slow-steamed at dawn according to age-old artisanal traditions. The rising floral essence infuses into aged sandalwood oil, condensing drops of liquid poetry that blossom with body warmth over 24 hours.'
  },
  {
    id: 'tripolia-royal-oudh',
    name: 'Tripolia Royal Oudh',
    title: 'Tripolia Royal Oudh • Reserve Agarwood',
    subtitle: 'Wild Assam Agarwood Distilled onto Amber Resin & Kashmiri Saffron',
    category: 'attar',
    categoryName: 'Royal Attar',
    family: 'Oudh & Woody',
    familyName: 'Noble Woody Oudh',
    isBestseller: true,
    featured: true,
    alcoholFree: true,
    distillationMethod: 'Traditional slow-matured distillation',
    harvestSeason: 'Winter Maturation',
    origin: 'Upper Assam Forest Reserves',
    image: '/images/tripolia-royal-oudh.jpg',
    basePrice: 2450,
    sizes: [
      { id: '3ml', label: '3ml Pure Tola Vial', priceMultiplier: 1.0, isDefault: true },
      { id: '6ml', label: '6ml Royal Crystal Flacon', priceMultiplier: 1.85 },
      { id: '12ml', label: '12ml Heirloom Carved Tola', priceMultiplier: 3.5 },
      { id: '50ml', label: '50ml Fine French Atomizer (Extrait 30%)', priceMultiplier: 2.9 }
    ],
    carrierBases: [
      { id: 'sandalwood', label: 'Traditional Sandalwood Oil Base (Alcohol-Free)', priceAdd: 0, isDefault: true },
      { id: 'jojoba', label: 'Cold-Pressed Organic Jojoba (Silky & Light)', priceAdd: 0 },
      { id: 'extrait-spirit', label: 'Aged Grain Spirits (Atomizer Extrait Spray)', priceAdd: 150 }
    ],
    pyramid: {
      top: {
        title: 'Top Notes (First 30 Mins)',
        notes: 'Smoky Taif Nuances, Kashmiri Mogra Saffron, Sweet Nutmeg',
        duration: 'Regal Entrance'
      },
      heart: {
        title: 'Heart Notes (1 to 5 Hours)',
        notes: 'Aged Assam Oud (Aquilaria Agallocha), Cedarwood, Honeyed Labdanum',
        duration: 'Deep Resin Core'
      },
      base: {
        title: 'Base Notes (8 to 36 Hours)',
        notes: 'Dark Ambergris Accord, Aged Sandalwood, Earthy Patchouli, Dark Leather',
        duration: 'Eternal Sillage'
      }
    },
    story: 'Crafted in the royal tradition of Rajasthan, Tripolia Royal Oudh blends wild resinous agarwood heartwood with traditional sandalwood. Never overpowering or synthetic, it matures into an intimate, warm aura that speaks of royal darbars, carved teak jalis, and timeless nobility.'
  },
  {
    id: 'mitti-attar-petrichor',
    name: 'Mitti Attar (Petrichor of Thar)',
    title: 'Mitti Attar • The Petrichor of Thar',
    subtitle: 'Baked Rajasthan Terracotta Distilled onto Traditional Sandalwood',
    category: 'attar',
    categoryName: 'Heritage Attar',
    family: 'Earthy',
    familyName: 'Earthy Petrichor',
    isBestseller: true,
    featured: true,
    alcoholFree: true,
    distillationMethod: 'Time-honored hydro-distillation of terracotta clay',
    harvestSeason: 'Pre-Monsoon Jyeshtha',
    origin: 'Bikaner & Jaipur Earthen Kilns',
    image: '/images/mitti-attar.jpg',
    basePrice: 1550,
    sizes: [
      { id: '3ml', label: '3ml Pure Tola Vial', priceMultiplier: 1.0, isDefault: true },
      { id: '6ml', label: '6ml Royal Crystal Flacon', priceMultiplier: 1.8 },
      { id: '12ml', label: '12ml Heirloom Carved Tola', priceMultiplier: 3.3 },
      { id: '50ml', label: '50ml Fine French Atomizer (Extrait 30%)', priceMultiplier: 2.6 }
    ],
    carrierBases: [
      { id: 'sandalwood', label: 'Traditional Sandalwood Oil Base (Alcohol-Free)', priceAdd: 0, isDefault: true },
      { id: 'jojoba', label: 'Cold-Pressed Organic Jojoba (Silky & Light)', priceAdd: 0 },
      { id: 'extrait-spirit', label: 'Aged Grain Spirits (Atomizer Extrait Spray)', priceAdd: 150 }
    ],
    pyramid: {
      top: {
        title: 'Top Notes (First 30 Mins)',
        notes: 'Dry Clay Dust, Sun-baked Terracotta, Clean Ozone',
        duration: 'Rainfall Awakening'
      },
      heart: {
        title: 'Heart Notes (1 to 4 Hours)',
        notes: 'Freshly Soaked Earth, Petrichor (Geosmin Accord), River Sand',
        duration: 'The Soul of Rain'
      },
      base: {
        title: 'Base Notes (6 to 20 Hours)',
        notes: 'Creamy Sandalwood, Khus Vetiver Roots, Warm Dry Amber',
        duration: 'Calming Grounding Comfort'
      }
    },
    story: 'There is no scent more sacred to Rajasthan than the first drops of monsoon rain striking parched summer earth. Mitti Attar captures this pure petrichor. Clean earthen pots made from clay baked in traditional kilns are gently distilled, infusing aged sandalwood with the intoxicating soul of mother earth.'
  },
  {
    id: 'kasturi-shamama-royal',
    name: 'Kasturi Shamama Royal',
    title: 'Kasturi Shamama Royal • The Heritage Botanical Elixir',
    subtitle: 'Aged Botanical & Resin Blend with Saffron, Amber & Warm Spices',
    category: 'attar',
    categoryName: 'Royal Attar',
    family: 'Amber & Spice',
    familyName: 'Spicy Amber Resin',
    isBestseller: true,
    featured: true,
    alcoholFree: true,
    distillationMethod: 'Multi-stage botanical co-distillation & slow maturation',
    harvestSeason: 'Autumn Harvest',
    origin: 'Kannauj & Jaipur Haveli Vaults',
    image: '/images/kasturi-shamama.jpg',
    basePrice: 2150,
    sizes: [
      { id: '3ml', label: '3ml Pure Tola Vial', priceMultiplier: 1.0, isDefault: true },
      { id: '6ml', label: '6ml Royal Crystal Flacon', priceMultiplier: 1.85 },
      { id: '12ml', label: '12ml Heirloom Carved Tola', priceMultiplier: 3.4 },
      { id: '50ml', label: '50ml Fine French Atomizer (Extrait 30%)', priceMultiplier: 2.8 }
    ],
    carrierBases: [
      { id: 'sandalwood', label: 'Traditional Sandalwood Oil Base (Alcohol-Free)', priceAdd: 0, isDefault: true },
      { id: 'jojoba', label: 'Cold-Pressed Organic Jojoba (Silky & Light)', priceAdd: 0 },
      { id: 'extrait-spirit', label: 'Aged Grain Spirits (Atomizer Extrait Spray)', priceAdd: 150 }
    ],
    pyramid: {
      top: {
        title: 'Top Notes (First 30 Mins)',
        notes: 'Cinnamon Bark, Green Cardamom, Star Anise, Saffron Stigmas',
        duration: 'Warm Spice Prelude'
      },
      heart: {
        title: 'Heart Notes (1 to 5 Hours)',
        notes: 'Botanical Kasturi Musk Accord, Clove Bud, Frankincense tears, Nutmeg',
        duration: 'Opulent Exotic Depth'
      },
      base: {
        title: 'Base Notes (8 to 30 Hours)',
        notes: 'Liquid Amber Resin, Aged Sandalwood, Warm Benzoin, Labdanum',
        duration: 'Rich Golden Trail'
      }
    },
    story: 'Shamama is among the most revered and intricate fragrance formulations in Indian perfumery. Handcrafted through patient, multi-stage distillation of rich aromatic herbs, roots, woods, and resins, this formulation matures into a deeply layered elixir. It exudes a warm, commanding aura prized for chilly desert evenings.'
  },
  {
    id: 'bespoke-atelier-blend',
    name: 'Bespoke Atelier Formulation',
    title: 'Bespoke Atelier Formulation • Personalized to Skin Chemistry',
    subtitle: 'Hand-blended by Master Perfumer according to your personal olfactory profile',
    category: 'bespoke',
    categoryName: 'Custom Blends',
    family: 'Custom',
    familyName: 'Bespoke Tailored Formulation',
    isBestseller: false,
    featured: true,
    alcoholFree: true,
    distillationMethod: 'Bespoke Hand-Compounding in Jaipur Atelier',
    harvestSeason: 'Made Fresh to Order',
    origin: 'Tripolia Bazar Atelier, Jaipur',
    image: '/images/bespoke-atelier.jpg',
    basePrice: 2800,
    sizes: [
      { id: '3ml', label: '3ml Pure Tola Vial', priceMultiplier: 1.0, isDefault: true },
      { id: '6ml', label: '6ml Royal Crystal Flacon', priceMultiplier: 1.85 },
      { id: '12ml', label: '12ml Heirloom Carved Tola', priceMultiplier: 3.4 },
      { id: '50ml', label: '50ml Fine French Atomizer (Extrait 30%)', priceMultiplier: 2.8 }
    ],
    carrierBases: [
      { id: 'sandalwood', label: 'Traditional Sandalwood Oil Base (Alcohol-Free)', priceAdd: 0, isDefault: true },
      { id: 'jojoba', label: 'Cold-Pressed Organic Jojoba (Silky & Light)', priceAdd: 0 },
      { id: 'extrait-spirit', label: 'Aged Grain Spirits (Atomizer Extrait Spray)', priceAdd: 150 }
    ],
    pyramid: {
      top: {
        title: 'Top Notes (First 30 Mins)',
        notes: 'Formulated to your custom preference (Citrus, Rose, or Warm Spices)',
        duration: 'Your Signature Opening'
      },
      heart: {
        title: 'Heart Notes (1 to 5 Hours)',
        notes: 'Bespoke floral, resinous, or woody core matched to skin temperature',
        duration: 'Intimate Heart'
      },
      base: {
        title: 'Base Notes (8 to 24+ Hours)',
        notes: 'Hand-selected Sandalwood, Aged Oudh, or Amber foundation',
        duration: 'Unique Personal Legacy'
      }
    },
    story: 'No two individuals have the exact same skin chemistry, lipid balance, or pulse warmth. In our Tripolia Bazar atelier, our master perfumer hand-composes a unique formulation tailored specifically for you. Each bottle comes with your custom monogram engraved on an antique brass tag and your personal formulation recorded in our master ledger.'
  }
];

export const fragranceFamilies = [
  { id: 'all', label: 'All Fragrance Families' },
  { id: 'Floral', label: 'Floral & Gulab' },
  { id: 'Oudh & Woody', label: 'Oudh & Rare Woods' },
  { id: 'Earthy', label: 'Earthy & Petrichor (Mitti)' },
  { id: 'Amber & Spice', label: 'Amber & Warm Spices' },
  { id: 'Custom', label: 'Bespoke Custom Formulations' }
];

export const fragranceCategories = [
  { id: 'all', label: 'All Formats' },
  { id: 'attar', label: 'Royal Attars (100% Oil)' },
  { id: 'bespoke', label: 'Custom Blends (Made-to-Order)' }
];
