<script setup>
import { computed, ref } from 'vue'
import { ELEMENTS, CATEGORY_COLORS, CATEGORY_LABELS } from '../data/elements.js'

const props = defineProps({
  selectedSymbol: { type: String, default: null },
  scattering: { type: Boolean, default: false },
  scatterOrigin: { type: Object, default: null } // { row, col }
})

const emit = defineEmits(['select'])

const hovered = ref(null)

const COLS = 18
const ROWS = 10 // 7 main + gap (row 8 reserved) + lanthanides(9) + actinides(10)

const cellSize = 62 // px
const gap = 4

const tableWidth = COLS * cellSize + (COLS - 1) * gap
const tableHeight = ROWS * cellSize + (ROWS - 1) * gap

// Static per-cell style computed once at module scope (positions, colors —
// nothing reactive). Avoids allocating fresh style objects every render.
const STATIC_STYLE = Object.freeze(
  Object.fromEntries(ELEMENTS.map(el => {
    const c = CATEGORY_COLORS[el.category]
    return [el.symbol, Object.freeze({
      left: `${(el.col - 1) * (cellSize + gap)}px`,
      top: `${(el.row - 1) * (cellSize + gap)}px`,
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      background: `linear-gradient(135deg, ${c}26, ${c}10)`,
      borderColor: `${c}80`,
      color: c
    })]
  }))
)

// Cached, deterministic scatter end-state per element. Recomputed only when
// `scattering` or `scatterOrigin` change — *not* on hover or any other
// reactive update, so the CSS transition target stays stable for its full
// duration. Rotation is seeded by atomic number for stability.
const scatterMap = computed(() => {
  if (!props.scattering || !props.scatterOrigin) return null
  const origin = props.scatterOrigin
  const sel = props.selectedSymbol
  const m = new Map()
  for (const el of ELEMENTS) {
    if (el.symbol === sel) {
      m.set(el.symbol, { tx: 0, ty: 0, rot: 0, scale: 2.6, op: 0, delay: 0 })
      continue
    }
    const dr = el.row - origin.row
    const dc = el.col - origin.col
    const dist = Math.hypot(dr, dc) || 1
    const PUSH = 700
    let vx = (dc / dist) * PUSH
    let vy = (dr / dist) * PUSH
    const swirl = 60
    vx += -dr / dist * swirl
    vy +=  dc / dist * swirl
    // Deterministic rotation from atomic number
    const seed = (el.z * 2654435761) >>> 0
    const rot = ((seed % 240) / 240 - 0.5) * 120
    const delay = Math.min(dist * 12, 180)
    m.set(el.symbol, { tx: vx, ty: vy, rot, scale: 0.6, op: 0, delay })
  }
  return m
})

const REST_TRANSFORM = Object.freeze({
  transform: 'translate3d(0,0,0)',
  opacity: 1,
  transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out'
})

// Combined style map: static layout/color + current scatter transform.
// Rebuilt only when scattering state flips (computed deps), not per render.
const styleMap = computed(() => {
  const sm = scatterMap.value
  const out = new Map()
  for (const el of ELEMENTS) {
    const base = STATIC_STYLE[el.symbol]
    if (!sm) {
      out.set(el.symbol, { ...base, ...REST_TRANSFORM })
    } else {
      const d = sm.get(el.symbol)
      out.set(el.symbol, {
        ...base,
        transform: `translate3d(${d.tx}px, ${d.ty}px, 0) rotate(${d.rot}deg) scale(${d.scale})`,
        opacity: d.op,
        transition: `transform 0.75s cubic-bezier(0.6, -0.05, 0.3, 1.2) ${d.delay}ms, opacity 0.55s ease-out ${d.delay}ms`
      })
    }
  }
  return out
})

const tooltip = computed(() => {
  if (!hovered.value) return null
  const el = hovered.value
  return {
    name: el.name,
    cat: CATEGORY_LABELS[el.category]
  }
})

const legendCats = ['alkali','alkaline','transition','post-transition','metalloid','nonmetal','halogen','noble','lanthanide','actinide']
</script>

<template>
  <div class="periodic-wrap">
    <header class="header">
      <div class="logo-mark">⚛</div>
      <div>
        <h1>3D Periodic Table</h1>
        <p class="sub">Click any element to dive into its atomic structure</p>
      </div>
    </header>

    <div class="table-frame">
      <div
        class="table"
        :style="{ width: `${tableWidth}px`, height: `${tableHeight}px` }"
      >
        <button
          v-for="el in ELEMENTS"
          :key="el.symbol"
          class="cell"
          :class="{ scattering }"
          :style="styleMap.get(el.symbol)"
          @mouseenter="!scattering && (hovered = el)"
          @mouseleave="hovered = null"
          @click="!scattering && emit('select', el)"
        >
          <span class="z">{{ el.z }}</span>
          <span class="sym">{{ el.symbol }}</span>
          <span class="mass">{{ el.mass.toFixed(2) }}</span>
        </button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="tooltip" class="tooltip">
        <strong>{{ tooltip.name }}</strong>
        <span class="cat-dot" :style="{ background: CATEGORY_COLORS[hovered.category] }" />
        <span>{{ tooltip.cat }}</span>
      </div>
    </Transition>

    <div class="legend">
      <span
        v-for="c in legendCats"
        :key="c"
        class="legend-item"
        :style="{ '--c': CATEGORY_COLORS[c] }"
      >
        <i class="dot" />
        {{ CATEGORY_LABELS[c] }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.periodic-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  text-align: left;
}

.logo-mark {
  font-size: 36px;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  color: var(--accent);
  background: linear-gradient(135deg, rgba(47,123,255,0.12), rgba(123,61,245,0.10));
  border: 1px solid var(--border);
}

.header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #1a1d29, #7b3df5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sub {
  margin: 2px 0 0;
  color: var(--text-dim);
  font-size: 13px;
}

.table-frame {
  position: relative;
  padding: 20px;
  border-radius: 24px;
  background: rgba(255,255,255,0.7);
  border: 1px solid var(--border);
  box-shadow: 0 12px 40px rgba(20, 30, 60, 0.06);
  backdrop-filter: blur(8px);
}

.table {
  position: relative;
}

.cell {
  position: absolute;
  border: 1px solid;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 2px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  /* GPU compositor hints. translateZ(0) forces own layer so transform/opacity
     animate without touching layout. `contain` keeps paint inside the cell. */
  transform: translateZ(0);
  backface-visibility: hidden;
  contain: layout style paint;
}

.cell.scattering {
  /* During the scatter animation: promote layers + skip pointer hit-testing
     to stop hover/click work from invalidating the running transition. */
  will-change: transform, opacity;
  pointer-events: none;
}

.cell:hover {
  filter: saturate(1.2) brightness(0.95);
  box-shadow: 0 6px 20px -4px currentColor;
  z-index: 2;
}

.cell .z {
  font-size: 9px;
  opacity: 0.85;
  align-self: flex-start;
  padding-left: 4px;
  line-height: 1;
}

.cell .sym {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-top: 2px;
  color: var(--text);
}

.cell .mass {
  font-size: 8px;
  opacity: 0.75;
  margin-top: 2px;
  font-weight: 400;
}

.tooltip {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 13px;
  color: var(--text);
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 16px rgba(20, 30, 60, 0.08);
}

.tooltip strong { font-weight: 600; }

.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }

.legend {
  margin-top: 20px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 900px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-dim);
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c);
}
</style>
