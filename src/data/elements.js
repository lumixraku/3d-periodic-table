// Periodic table data. Each element has its grid coords (row, col 1..18) for layout.
// category: alkali, alkaline, transition, post-transition, metalloid, nonmetal, halogen, noble, lanthanide, actinide
// shells: electron count per shell (Bohr model).
// compounds: list of common compounds we know how to render.

export const CATEGORY_COLORS = {
  alkali: '#ff6b6b',
  alkaline: '#ffa94d',
  transition: '#ffd43b',
  'post-transition': '#a9e34b',
  metalloid: '#63e6be',
  nonmetal: '#4dabf7',
  halogen: '#9775fa',
  noble: '#cc5de8',
  lanthanide: '#f783ac',
  actinide: '#f06595',
  unknown: '#868e96'
}

export const CATEGORY_LABELS = {
  alkali: 'Alkali Metal',
  alkaline: 'Alkaline Earth',
  transition: 'Transition Metal',
  'post-transition': 'Post-Transition',
  metalloid: 'Metalloid',
  nonmetal: 'Nonmetal',
  halogen: 'Halogen',
  noble: 'Noble Gas',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide',
  unknown: 'Unknown'
}

// Common compounds — see /data/compounds.js for atom positions.
export const ELEMENTS = [
  { z: 1,  symbol: 'H',  name: 'Hydrogen',   mass: 1.008,   row: 1, col: 1,  category: 'nonmetal',        shells: [1], compounds: ['H2', 'H2O', 'CH4', 'NH3'] },
  { z: 2,  symbol: 'He', name: 'Helium',     mass: 4.0026,  row: 1, col: 18, category: 'noble',           shells: [2], compounds: [] },

  { z: 3,  symbol: 'Li', name: 'Lithium',    mass: 6.94,    row: 2, col: 1,  category: 'alkali',          shells: [2, 1], compounds: [] },
  { z: 4,  symbol: 'Be', name: 'Beryllium',  mass: 9.0122,  row: 2, col: 2,  category: 'alkaline',        shells: [2, 2], compounds: [] },
  { z: 5,  symbol: 'B',  name: 'Boron',      mass: 10.81,   row: 2, col: 13, category: 'metalloid',       shells: [2, 3], compounds: [] },
  { z: 6,  symbol: 'C',  name: 'Carbon',     mass: 12.011,  row: 2, col: 14, category: 'nonmetal',        shells: [2, 4], compounds: ['CO2', 'CH4', 'CO'] },
  { z: 7,  symbol: 'N',  name: 'Nitrogen',   mass: 14.007,  row: 2, col: 15, category: 'nonmetal',        shells: [2, 5], compounds: ['N2', 'NH3', 'NO2'] },
  { z: 8,  symbol: 'O',  name: 'Oxygen',     mass: 15.999,  row: 2, col: 16, category: 'nonmetal',        shells: [2, 6], compounds: ['O2', 'H2O', 'CO2', 'O3'] },
  { z: 9,  symbol: 'F',  name: 'Fluorine',   mass: 18.998,  row: 2, col: 17, category: 'halogen',         shells: [2, 7], compounds: [] },
  { z: 10, symbol: 'Ne', name: 'Neon',       mass: 20.180,  row: 2, col: 18, category: 'noble',           shells: [2, 8], compounds: [] },

  { z: 11, symbol: 'Na', name: 'Sodium',     mass: 22.990,  row: 3, col: 1,  category: 'alkali',          shells: [2, 8, 1], compounds: ['NaCl'] },
  { z: 12, symbol: 'Mg', name: 'Magnesium',  mass: 24.305,  row: 3, col: 2,  category: 'alkaline',        shells: [2, 8, 2], compounds: [] },
  { z: 13, symbol: 'Al', name: 'Aluminium',  mass: 26.982,  row: 3, col: 13, category: 'post-transition', shells: [2, 8, 3], compounds: [] },
  { z: 14, symbol: 'Si', name: 'Silicon',    mass: 28.085,  row: 3, col: 14, category: 'metalloid',       shells: [2, 8, 4], compounds: ['SiO2'] },
  { z: 15, symbol: 'P',  name: 'Phosphorus', mass: 30.974,  row: 3, col: 15, category: 'nonmetal',        shells: [2, 8, 5], compounds: [] },
  { z: 16, symbol: 'S',  name: 'Sulfur',     mass: 32.06,   row: 3, col: 16, category: 'nonmetal',        shells: [2, 8, 6], compounds: ['SO2', 'SO3', 'H2S', 'S8'] },
  { z: 17, symbol: 'Cl', name: 'Chlorine',   mass: 35.45,   row: 3, col: 17, category: 'halogen',         shells: [2, 8, 7], compounds: ['Cl2', 'NaCl', 'HCl'] },
  { z: 18, symbol: 'Ar', name: 'Argon',      mass: 39.948,  row: 3, col: 18, category: 'noble',           shells: [2, 8, 8], compounds: [] },

  { z: 19, symbol: 'K',  name: 'Potassium',  mass: 39.098,  row: 4, col: 1,  category: 'alkali',          shells: [2, 8, 8, 1], compounds: [] },
  { z: 20, symbol: 'Ca', name: 'Calcium',    mass: 40.078,  row: 4, col: 2,  category: 'alkaline',        shells: [2, 8, 8, 2], compounds: [] },
  { z: 21, symbol: 'Sc', name: 'Scandium',   mass: 44.956,  row: 4, col: 3,  category: 'transition',      shells: [2, 8, 9, 2], compounds: [] },
  { z: 22, symbol: 'Ti', name: 'Titanium',   mass: 47.867,  row: 4, col: 4,  category: 'transition',      shells: [2, 8, 10, 2], compounds: [] },
  { z: 23, symbol: 'V',  name: 'Vanadium',   mass: 50.942,  row: 4, col: 5,  category: 'transition',      shells: [2, 8, 11, 2], compounds: [] },
  { z: 24, symbol: 'Cr', name: 'Chromium',   mass: 51.996,  row: 4, col: 6,  category: 'transition',      shells: [2, 8, 13, 1], compounds: [] },
  { z: 25, symbol: 'Mn', name: 'Manganese',  mass: 54.938,  row: 4, col: 7,  category: 'transition',      shells: [2, 8, 13, 2], compounds: [] },
  { z: 26, symbol: 'Fe', name: 'Iron',       mass: 55.845,  row: 4, col: 8,  category: 'transition',      shells: [2, 8, 14, 2], compounds: [] },
  { z: 27, symbol: 'Co', name: 'Cobalt',     mass: 58.933,  row: 4, col: 9,  category: 'transition',      shells: [2, 8, 15, 2], compounds: [] },
  { z: 28, symbol: 'Ni', name: 'Nickel',     mass: 58.693,  row: 4, col: 10, category: 'transition',      shells: [2, 8, 16, 2], compounds: [] },
  { z: 29, symbol: 'Cu', name: 'Copper',     mass: 63.546,  row: 4, col: 11, category: 'transition',      shells: [2, 8, 18, 1], compounds: [] },
  { z: 30, symbol: 'Zn', name: 'Zinc',       mass: 65.38,   row: 4, col: 12, category: 'transition',      shells: [2, 8, 18, 2], compounds: [] },
  { z: 31, symbol: 'Ga', name: 'Gallium',    mass: 69.723,  row: 4, col: 13, category: 'post-transition', shells: [2, 8, 18, 3], compounds: [] },
  { z: 32, symbol: 'Ge', name: 'Germanium',  mass: 72.630,  row: 4, col: 14, category: 'metalloid',       shells: [2, 8, 18, 4], compounds: [] },
  { z: 33, symbol: 'As', name: 'Arsenic',    mass: 74.922,  row: 4, col: 15, category: 'metalloid',       shells: [2, 8, 18, 5], compounds: [] },
  { z: 34, symbol: 'Se', name: 'Selenium',   mass: 78.971,  row: 4, col: 16, category: 'nonmetal',        shells: [2, 8, 18, 6], compounds: [] },
  { z: 35, symbol: 'Br', name: 'Bromine',    mass: 79.904,  row: 4, col: 17, category: 'halogen',         shells: [2, 8, 18, 7], compounds: [] },
  { z: 36, symbol: 'Kr', name: 'Krypton',    mass: 83.798,  row: 4, col: 18, category: 'noble',           shells: [2, 8, 18, 8], compounds: [] },

  { z: 37, symbol: 'Rb', name: 'Rubidium',   mass: 85.468,  row: 5, col: 1,  category: 'alkali',          shells: [2, 8, 18, 8, 1], compounds: [] },
  { z: 38, symbol: 'Sr', name: 'Strontium',  mass: 87.62,   row: 5, col: 2,  category: 'alkaline',        shells: [2, 8, 18, 8, 2], compounds: [] },
  { z: 39, symbol: 'Y',  name: 'Yttrium',    mass: 88.906,  row: 5, col: 3,  category: 'transition',      shells: [2, 8, 18, 9, 2], compounds: [] },
  { z: 40, symbol: 'Zr', name: 'Zirconium',  mass: 91.224,  row: 5, col: 4,  category: 'transition',      shells: [2, 8, 18, 10, 2], compounds: [] },
  { z: 41, symbol: 'Nb', name: 'Niobium',    mass: 92.906,  row: 5, col: 5,  category: 'transition',      shells: [2, 8, 18, 12, 1], compounds: [] },
  { z: 42, symbol: 'Mo', name: 'Molybdenum', mass: 95.95,   row: 5, col: 6,  category: 'transition',      shells: [2, 8, 18, 13, 1], compounds: [] },
  { z: 43, symbol: 'Tc', name: 'Technetium', mass: 98,      row: 5, col: 7,  category: 'transition',      shells: [2, 8, 18, 13, 2], compounds: [] },
  { z: 44, symbol: 'Ru', name: 'Ruthenium',  mass: 101.07,  row: 5, col: 8,  category: 'transition',      shells: [2, 8, 18, 15, 1], compounds: [] },
  { z: 45, symbol: 'Rh', name: 'Rhodium',    mass: 102.91,  row: 5, col: 9,  category: 'transition',      shells: [2, 8, 18, 16, 1], compounds: [] },
  { z: 46, symbol: 'Pd', name: 'Palladium',  mass: 106.42,  row: 5, col: 10, category: 'transition',      shells: [2, 8, 18, 18], compounds: [] },
  { z: 47, symbol: 'Ag', name: 'Silver',     mass: 107.87,  row: 5, col: 11, category: 'transition',      shells: [2, 8, 18, 18, 1], compounds: [] },
  { z: 48, symbol: 'Cd', name: 'Cadmium',    mass: 112.41,  row: 5, col: 12, category: 'transition',      shells: [2, 8, 18, 18, 2], compounds: [] },
  { z: 49, symbol: 'In', name: 'Indium',     mass: 114.82,  row: 5, col: 13, category: 'post-transition', shells: [2, 8, 18, 18, 3], compounds: [] },
  { z: 50, symbol: 'Sn', name: 'Tin',        mass: 118.71,  row: 5, col: 14, category: 'post-transition', shells: [2, 8, 18, 18, 4], compounds: [] },
  { z: 51, symbol: 'Sb', name: 'Antimony',   mass: 121.76,  row: 5, col: 15, category: 'metalloid',       shells: [2, 8, 18, 18, 5], compounds: [] },
  { z: 52, symbol: 'Te', name: 'Tellurium',  mass: 127.60,  row: 5, col: 16, category: 'metalloid',       shells: [2, 8, 18, 18, 6], compounds: [] },
  { z: 53, symbol: 'I',  name: 'Iodine',     mass: 126.90,  row: 5, col: 17, category: 'halogen',         shells: [2, 8, 18, 18, 7], compounds: [] },
  { z: 54, symbol: 'Xe', name: 'Xenon',      mass: 131.29,  row: 5, col: 18, category: 'noble',           shells: [2, 8, 18, 18, 8], compounds: [] },

  { z: 55, symbol: 'Cs', name: 'Caesium',    mass: 132.91,  row: 6, col: 1,  category: 'alkali',          shells: [2, 8, 18, 18, 8, 1], compounds: [] },
  { z: 56, symbol: 'Ba', name: 'Barium',     mass: 137.33,  row: 6, col: 2,  category: 'alkaline',        shells: [2, 8, 18, 18, 8, 2], compounds: [] },
  { z: 72, symbol: 'Hf', name: 'Hafnium',    mass: 178.49,  row: 6, col: 4,  category: 'transition',      shells: [2, 8, 18, 32, 10, 2], compounds: [] },
  { z: 73, symbol: 'Ta', name: 'Tantalum',   mass: 180.95,  row: 6, col: 5,  category: 'transition',      shells: [2, 8, 18, 32, 11, 2], compounds: [] },
  { z: 74, symbol: 'W',  name: 'Tungsten',   mass: 183.84,  row: 6, col: 6,  category: 'transition',      shells: [2, 8, 18, 32, 12, 2], compounds: [] },
  { z: 75, symbol: 'Re', name: 'Rhenium',    mass: 186.21,  row: 6, col: 7,  category: 'transition',      shells: [2, 8, 18, 32, 13, 2], compounds: [] },
  { z: 76, symbol: 'Os', name: 'Osmium',     mass: 190.23,  row: 6, col: 8,  category: 'transition',      shells: [2, 8, 18, 32, 14, 2], compounds: [] },
  { z: 77, symbol: 'Ir', name: 'Iridium',    mass: 192.22,  row: 6, col: 9,  category: 'transition',      shells: [2, 8, 18, 32, 15, 2], compounds: [] },
  { z: 78, symbol: 'Pt', name: 'Platinum',   mass: 195.08,  row: 6, col: 10, category: 'transition',      shells: [2, 8, 18, 32, 17, 1], compounds: [] },
  { z: 79, symbol: 'Au', name: 'Gold',       mass: 196.97,  row: 6, col: 11, category: 'transition',      shells: [2, 8, 18, 32, 18, 1], compounds: [] },
  { z: 80, symbol: 'Hg', name: 'Mercury',    mass: 200.59,  row: 6, col: 12, category: 'transition',      shells: [2, 8, 18, 32, 18, 2], compounds: [] },
  { z: 81, symbol: 'Tl', name: 'Thallium',   mass: 204.38,  row: 6, col: 13, category: 'post-transition', shells: [2, 8, 18, 32, 18, 3], compounds: [] },
  { z: 82, symbol: 'Pb', name: 'Lead',       mass: 207.2,   row: 6, col: 14, category: 'post-transition', shells: [2, 8, 18, 32, 18, 4], compounds: [] },
  { z: 83, symbol: 'Bi', name: 'Bismuth',    mass: 208.98,  row: 6, col: 15, category: 'post-transition', shells: [2, 8, 18, 32, 18, 5], compounds: [] },
  { z: 84, symbol: 'Po', name: 'Polonium',   mass: 209,     row: 6, col: 16, category: 'post-transition', shells: [2, 8, 18, 32, 18, 6], compounds: [] },
  { z: 85, symbol: 'At', name: 'Astatine',   mass: 210,     row: 6, col: 17, category: 'halogen',         shells: [2, 8, 18, 32, 18, 7], compounds: [] },
  { z: 86, symbol: 'Rn', name: 'Radon',      mass: 222,     row: 6, col: 18, category: 'noble',           shells: [2, 8, 18, 32, 18, 8], compounds: [] },

  { z: 87, symbol: 'Fr', name: 'Francium',   mass: 223,     row: 7, col: 1,  category: 'alkali',          shells: [2, 8, 18, 32, 18, 8, 1], compounds: [] },
  { z: 88, symbol: 'Ra', name: 'Radium',     mass: 226,     row: 7, col: 2,  category: 'alkaline',        shells: [2, 8, 18, 32, 18, 8, 2], compounds: [] },

  // Lanthanides (row 9 to make room visually)
  { z: 57, symbol: 'La', name: 'Lanthanum',  mass: 138.91,  row: 9, col: 4,  category: 'lanthanide',      shells: [2, 8, 18, 18, 9, 2], compounds: [] },
  { z: 58, symbol: 'Ce', name: 'Cerium',     mass: 140.12,  row: 9, col: 5,  category: 'lanthanide',      shells: [2, 8, 18, 19, 9, 2], compounds: [] },
  { z: 59, symbol: 'Pr', name: 'Praseodymium', mass: 140.91, row: 9, col: 6, category: 'lanthanide',      shells: [2, 8, 18, 21, 8, 2], compounds: [] },
  { z: 60, symbol: 'Nd', name: 'Neodymium',  mass: 144.24,  row: 9, col: 7,  category: 'lanthanide',      shells: [2, 8, 18, 22, 8, 2], compounds: [] },
  { z: 61, symbol: 'Pm', name: 'Promethium', mass: 145,     row: 9, col: 8,  category: 'lanthanide',      shells: [2, 8, 18, 23, 8, 2], compounds: [] },
  { z: 62, symbol: 'Sm', name: 'Samarium',   mass: 150.36,  row: 9, col: 9,  category: 'lanthanide',      shells: [2, 8, 18, 24, 8, 2], compounds: [] },
  { z: 63, symbol: 'Eu', name: 'Europium',   mass: 151.96,  row: 9, col: 10, category: 'lanthanide',      shells: [2, 8, 18, 25, 8, 2], compounds: [] },
  { z: 64, symbol: 'Gd', name: 'Gadolinium', mass: 157.25,  row: 9, col: 11, category: 'lanthanide',      shells: [2, 8, 18, 25, 9, 2], compounds: [] },
  { z: 65, symbol: 'Tb', name: 'Terbium',    mass: 158.93,  row: 9, col: 12, category: 'lanthanide',      shells: [2, 8, 18, 27, 8, 2], compounds: [] },
  { z: 66, symbol: 'Dy', name: 'Dysprosium', mass: 162.50,  row: 9, col: 13, category: 'lanthanide',      shells: [2, 8, 18, 28, 8, 2], compounds: [] },
  { z: 67, symbol: 'Ho', name: 'Holmium',    mass: 164.93,  row: 9, col: 14, category: 'lanthanide',      shells: [2, 8, 18, 29, 8, 2], compounds: [] },
  { z: 68, symbol: 'Er', name: 'Erbium',     mass: 167.26,  row: 9, col: 15, category: 'lanthanide',      shells: [2, 8, 18, 30, 8, 2], compounds: [] },
  { z: 69, symbol: 'Tm', name: 'Thulium',    mass: 168.93,  row: 9, col: 16, category: 'lanthanide',      shells: [2, 8, 18, 31, 8, 2], compounds: [] },
  { z: 70, symbol: 'Yb', name: 'Ytterbium',  mass: 173.05,  row: 9, col: 17, category: 'lanthanide',      shells: [2, 8, 18, 32, 8, 2], compounds: [] },
  { z: 71, symbol: 'Lu', name: 'Lutetium',   mass: 174.97,  row: 9, col: 18, category: 'lanthanide',      shells: [2, 8, 18, 32, 9, 2], compounds: [] },

  // Actinides (row 10)
  { z: 89, symbol: 'Ac', name: 'Actinium',   mass: 227,     row: 10, col: 4, category: 'actinide',        shells: [2, 8, 18, 32, 18, 9, 2], compounds: [] },
  { z: 90, symbol: 'Th', name: 'Thorium',    mass: 232.04,  row: 10, col: 5, category: 'actinide',        shells: [2, 8, 18, 32, 18, 10, 2], compounds: [] },
  { z: 91, symbol: 'Pa', name: 'Protactinium', mass: 231.04, row: 10, col: 6, category: 'actinide',       shells: [2, 8, 18, 32, 20, 9, 2], compounds: [] },
  { z: 92, symbol: 'U',  name: 'Uranium',    mass: 238.03,  row: 10, col: 7, category: 'actinide',        shells: [2, 8, 18, 32, 21, 9, 2], compounds: [] },
  { z: 93, symbol: 'Np', name: 'Neptunium',  mass: 237,     row: 10, col: 8, category: 'actinide',        shells: [2, 8, 18, 32, 22, 9, 2], compounds: [] },
  { z: 94, symbol: 'Pu', name: 'Plutonium',  mass: 244,     row: 10, col: 9, category: 'actinide',        shells: [2, 8, 18, 32, 24, 8, 2], compounds: [] }
]

export const ELEMENT_BY_SYMBOL = Object.fromEntries(ELEMENTS.map(e => [e.symbol, e]))
export const ELEMENT_BY_Z = Object.fromEntries(ELEMENTS.map(e => [e.z, e]))

// CPK-ish element colors for molecule rendering — tuned for a light background.
export const ELEMENT_COLORS = {
  H: '#d6dae4',
  C: '#2a2f3a',
  N: '#3361d6',
  O: '#e63946',
  F: '#2cae2c',
  Cl: '#2cae2c',
  Br: '#9b3a3a',
  I:  '#7a2f9c',
  S:  '#e0b020',
  P:  '#f08a1c',
  Na: '#8e4cd6',
  Si: '#b8861f'
}
