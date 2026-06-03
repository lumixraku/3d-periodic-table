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

function cellStyle(el) {
  const x = (el.col - 1) * (cellSize + gap)
  const y = (el.row - 1) * (cellSize + gap)
  return {
    left: `${x}px`,
    top: `${y}px`,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    background: `linear-gradient(135deg, ${CATEGORY_COLORS[el.category]}30, ${CATEGORY_COLORS[el.category]}10)`,
    borderColor: `${CATEGORY_COLORS[el.category]}60`,
    color: CATEGORY_COLORS[el.category]
  }
}

function scatterDelta(el) {
  if (!props.scattering || !props.scatterOrigin) return { tx: 0, ty: 0, rot: 0, scale: 1, op: 1, delay: 0 }
  // Compute vector from origin cell to this cell
  const dr = el.row - props.scatterOrigin.row
  const dc = el.col - props.scatterOrigin.col
  const dist = Math.hypot(dr, dc)
  if (el.symbol === props.selectedSymbol) {
    // Target element: scale up and fade out
    return { tx: 0, ty: 0, rot: 0, scale: 2.6, op: 0, delay: 0 }
  }
  // Push outward; closer cells get less push, distant cells more
  const PUSH = 700
  let vx = dr === 0 && dc === 0 ? 0 : (dc / (dist || 1)) * PUSH
  let vy = dr === 0 && dc === 0 ? 0 : (dr / (dist || 1)) * PUSH
  // Add a tiny tangential swirl
  const swirl = 60
  vx += -dr / (dist || 1) * swirl
  vy +=  dc / (dist || 1) * swirl
  const rot = (Math.random() - 0.5) * 120
  // Stagger: closer cells leave first
  const delay = Math.min(dist * 12, 180)
  return { tx: vx, ty: vy, rot, scale: 0.6, op: 0, delay }
}

function cellTransform(el) {
  const d = scatterDelta(el)
  return {
    transform: `translate(${d.tx}px, ${d.ty}px) rotate(${d.rot}deg) scale(${d.scale})`,
    opacity: d.op,
    transition: `transform 0.75s cubic-bezier(0.6, -0.05, 0.3, 1.2) ${d.delay}ms, opacity 0.55s ease-out ${d.delay}ms`
  }
}

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
        <h1>Element Explorer</h1>
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
          :class="{ hovered: hovered === el }"
          :style="{ ...cellStyle(el), ...cellTransform(el) }"
          @mouseenter="hovered = el"
          @mouseleave="hovered = null"
          @click="emit('select', el)"
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
  background: linear-gradient(135deg, rgba(110,200,255,0.25), rgba(179,136,255,0.2));
  border: 1px solid rgba(255,255,255,0.08);
}

.header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: var(--text);
  background: linear-gradient(90deg, #fff, #b388ff);
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
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
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
  will-change: transform;
  cursor: pointer;
  user-select: none;
  backdrop-filter: blur(4px);
}

.cell:hover {
  filter: brightness(1.35);
  box-shadow: 0 0 24px currentColor;
  z-index: 2;
}

.cell .z {
  font-size: 9px;
  opacity: 0.8;
  align-self: flex-start;
  padding-left: 4px;
  line-height: 1;
}

.cell .sym {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-top: 2px;
  color: #fff;
  text-shadow: 0 0 8px currentColor;
}

.cell .mass {
  font-size: 8px;
  opacity: 0.7;
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
  background: rgba(20, 27, 48, 0.9);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  font-size: 13px;
  color: var(--text);
  white-space: nowrap;
  pointer-events: none;
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
  box-shadow: 0 0 8px var(--c);
}
</style>
