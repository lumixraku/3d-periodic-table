// Compound geometries: atom positions + bonds (pairs of atom indices).
// Coordinates are in arbitrary units, centered on origin. Bonds are pairs of atom indices (0-based).

const BOND_LENGTH = 1.5

export const COMPOUNDS = {
  H2: {
    name: 'Hydrogen',
    formula: 'H₂',
    atoms: [
      { el: 'H', pos: [-BOND_LENGTH / 2, 0, 0] },
      { el: 'H', pos: [ BOND_LENGTH / 2, 0, 0] }
    ],
    bonds: [[0, 1]]
  },

  O2: {
    name: 'Oxygen',
    formula: 'O₂',
    atoms: [
      { el: 'O', pos: [-BOND_LENGTH / 2, 0, 0] },
      { el: 'O', pos: [ BOND_LENGTH / 2, 0, 0] }
    ],
    bonds: [[0, 1], [0, 1]] // double bond rendered as 2 cylinders offset
  },

  N2: {
    name: 'Nitrogen',
    formula: 'N₂',
    atoms: [
      { el: 'N', pos: [-BOND_LENGTH / 2, 0, 0] },
      { el: 'N', pos: [ BOND_LENGTH / 2, 0, 0] }
    ],
    bonds: [[0, 1], [0, 1], [0, 1]]
  },

  Cl2: {
    name: 'Chlorine',
    formula: 'Cl₂',
    atoms: [
      { el: 'Cl', pos: [-1, 0, 0] },
      { el: 'Cl', pos: [ 1, 0, 0] }
    ],
    bonds: [[0, 1]]
  },

  H2O: {
    name: 'Water',
    formula: 'H₂O',
    atoms: [
      { el: 'O', pos: [0, 0, 0] },
      { el: 'H', pos: [ Math.cos(Math.PI * 0.41) * BOND_LENGTH, Math.sin(Math.PI * 0.41) * BOND_LENGTH, 0] },
      { el: 'H', pos: [-Math.cos(Math.PI * 0.41) * BOND_LENGTH, Math.sin(Math.PI * 0.41) * BOND_LENGTH, 0] }
    ],
    bonds: [[0, 1], [0, 2]]
  },

  CO2: {
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    atoms: [
      { el: 'C', pos: [0, 0, 0] },
      { el: 'O', pos: [-BOND_LENGTH, 0, 0] },
      { el: 'O', pos: [ BOND_LENGTH, 0, 0] }
    ],
    bonds: [[0, 1], [0, 1], [0, 2], [0, 2]]
  },

  CO: {
    name: 'Carbon Monoxide',
    formula: 'CO',
    atoms: [
      { el: 'C', pos: [-BOND_LENGTH / 2, 0, 0] },
      { el: 'O', pos: [ BOND_LENGTH / 2, 0, 0] }
    ],
    bonds: [[0, 1], [0, 1], [0, 1]]
  },

  CH4: (() => {
    // tetrahedral
    const r = BOND_LENGTH
    return {
      name: 'Methane',
      formula: 'CH₄',
      atoms: [
        { el: 'C', pos: [0, 0, 0] },
        { el: 'H', pos: [ r,  r,  r].map(v => v / Math.sqrt(3)) },
        { el: 'H', pos: [-r, -r,  r].map(v => v / Math.sqrt(3)) },
        { el: 'H', pos: [-r,  r, -r].map(v => v / Math.sqrt(3)) },
        { el: 'H', pos: [ r, -r, -r].map(v => v / Math.sqrt(3)) }
      ],
      bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
    }
  })(),

  NH3: (() => {
    const r = BOND_LENGTH
    const ang = Math.PI * 0.59 // ~107°
    const h = r * Math.cos(ang / 2) - 0.2
    return {
      name: 'Ammonia',
      formula: 'NH₃',
      atoms: [
        { el: 'N', pos: [0, 0, 0] },
        { el: 'H', pos: [ r * 0.9,            -h, 0] },
        { el: 'H', pos: [-r * 0.45, -h,  r * 0.78] },
        { el: 'H', pos: [-r * 0.45, -h, -r * 0.78] }
      ],
      bonds: [[0, 1], [0, 2], [0, 3]]
    }
  })(),

  NO2: {
    name: 'Nitrogen Dioxide',
    formula: 'NO₂',
    atoms: [
      { el: 'N', pos: [0, 0, 0] },
      { el: 'O', pos: [ Math.cos(Math.PI * 0.34) * BOND_LENGTH, Math.sin(Math.PI * 0.34) * BOND_LENGTH, 0] },
      { el: 'O', pos: [-Math.cos(Math.PI * 0.34) * BOND_LENGTH, Math.sin(Math.PI * 0.34) * BOND_LENGTH, 0] }
    ],
    bonds: [[0, 1], [0, 1], [0, 2]]
  },

  SO2: {
    name: 'Sulfur Dioxide',
    formula: 'SO₂',
    atoms: [
      { el: 'S', pos: [0, 0, 0] },
      { el: 'O', pos: [ Math.cos(Math.PI * 0.34) * BOND_LENGTH, Math.sin(Math.PI * 0.34) * BOND_LENGTH, 0] },
      { el: 'O', pos: [-Math.cos(Math.PI * 0.34) * BOND_LENGTH, Math.sin(Math.PI * 0.34) * BOND_LENGTH, 0] }
    ],
    bonds: [[0, 1], [0, 1], [0, 2], [0, 2]]
  },

  SO3: (() => {
    const r = BOND_LENGTH
    return {
      name: 'Sulfur Trioxide',
      formula: 'SO₃',
      atoms: [
        { el: 'S', pos: [0, 0, 0] },
        { el: 'O', pos: [ r, 0, 0] },
        { el: 'O', pos: [-r / 2,  r * Math.sqrt(3) / 2, 0] },
        { el: 'O', pos: [-r / 2, -r * Math.sqrt(3) / 2, 0] }
      ],
      bonds: [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3]]
    }
  })(),

  H2S: {
    name: 'Hydrogen Sulfide',
    formula: 'H₂S',
    atoms: [
      { el: 'S', pos: [0, 0, 0] },
      { el: 'H', pos: [ Math.cos(Math.PI * 0.41) * BOND_LENGTH, Math.sin(Math.PI * 0.41) * BOND_LENGTH, 0] },
      { el: 'H', pos: [-Math.cos(Math.PI * 0.41) * BOND_LENGTH, Math.sin(Math.PI * 0.41) * BOND_LENGTH, 0] }
    ],
    bonds: [[0, 1], [0, 2]]
  },

  S8: (() => {
    // crown-shaped 8-ring with alternating z
    const n = 8
    const r = 2.0
    const atoms = []
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      atoms.push({ el: 'S', pos: [Math.cos(a) * r, (i % 2 === 0 ? 0.45 : -0.45), Math.sin(a) * r] })
    }
    const bonds = []
    for (let i = 0; i < n; i++) bonds.push([i, (i + 1) % n])
    return { name: 'Sulfur (cyclo-S₈)', formula: 'S₈', atoms, bonds }
  })(),

  O3: (() => {
    const r = BOND_LENGTH
    return {
      name: 'Ozone',
      formula: 'O₃',
      atoms: [
        { el: 'O', pos: [0, 0, 0] },
        { el: 'O', pos: [ Math.cos(Math.PI * 0.32) * r, Math.sin(Math.PI * 0.32) * r, 0] },
        { el: 'O', pos: [-Math.cos(Math.PI * 0.32) * r, Math.sin(Math.PI * 0.32) * r, 0] }
      ],
      bonds: [[0, 1], [0, 1], [0, 2]]
    }
  })(),

  NaCl: {
    name: 'Sodium Chloride',
    formula: 'NaCl',
    atoms: [
      { el: 'Na', pos: [-1.4, 0, 0] },
      { el: 'Cl', pos: [ 1.4, 0, 0] }
    ],
    bonds: [[0, 1]]
  },

  HCl: {
    name: 'Hydrogen Chloride',
    formula: 'HCl',
    atoms: [
      { el: 'H',  pos: [-BOND_LENGTH / 2, 0, 0] },
      { el: 'Cl', pos: [ BOND_LENGTH / 2, 0, 0] }
    ],
    bonds: [[0, 1]]
  },

  SiO2: (() => {
    // Linear approximation (O–Si–O) for visualization
    const r = BOND_LENGTH
    return {
      name: 'Silicon Dioxide',
      formula: 'SiO₂',
      atoms: [
        { el: 'Si', pos: [0, 0, 0] },
        { el: 'O',  pos: [ r, 0, 0] },
        { el: 'O',  pos: [-r, 0, 0] }
      ],
      bonds: [[0, 1], [0, 1], [0, 2], [0, 2]]
    }
  })()
}

// Note: fix .map() on plain array of literals — replace numeric arrays with proper math.
;(function fixCH4() {
  const c = COMPOUNDS.CH4
  const r = BOND_LENGTH
  const k = 1 / Math.sqrt(3)
  c.atoms[1].pos = [ r * k,  r * k,  r * k]
  c.atoms[2].pos = [-r * k, -r * k,  r * k]
  c.atoms[3].pos = [-r * k,  r * k, -r * k]
  c.atoms[4].pos = [ r * k, -r * k, -r * k]
})()
