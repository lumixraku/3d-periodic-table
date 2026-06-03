<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import PeriodicTable from './components/PeriodicTable.vue'
import { CATEGORY_COLORS, CATEGORY_LABELS } from './data/elements.js'
import { COMPOUNDS } from './data/compounds.js'

const AtomScene = defineAsyncComponent(() => import('./components/AtomScene.vue'))
const MoleculeScene = defineAsyncComponent(() => import('./components/MoleculeScene.vue'))

// view: 'table' | 'atom' | 'molecule'
const view = ref('table')
const selected = ref(null)        // element object
const compoundKey = ref(null)     // 'H2O', etc.
const scattering = ref(false)     // periodic table scatter animation
const scatterOrigin = ref(null)   // { row, col }
const sceneVisible = ref(false)   // atom/molecule canvas fade-in
const transitioning = ref(false)

function selectElement(el) {
  if (transitioning.value) return
  transitioning.value = true
  selected.value = el
  scatterOrigin.value = { row: el.row, col: el.col }
  scattering.value = true

  // After scatter, show atom scene
  setTimeout(() => {
    view.value = 'atom'
    // Tiny delay before fade in
    requestAnimationFrame(() => {
      sceneVisible.value = true
    })
    transitioning.value = false
  }, 850)
}

function backToTable() {
  if (transitioning.value) return
  transitioning.value = true
  sceneVisible.value = false
  setTimeout(() => {
    view.value = 'table'
    compoundKey.value = null
    requestAnimationFrame(() => {
      scattering.value = false
      transitioning.value = false
    })
  }, 350)
}

function showCompound(key) {
  compoundKey.value = key
  sceneVisible.value = false
  setTimeout(() => {
    view.value = 'molecule'
    requestAnimationFrame(() => { sceneVisible.value = true })
  }, 200)
}

function backToAtom() {
  sceneVisible.value = false
  setTimeout(() => {
    view.value = 'atom'
    compoundKey.value = null
    requestAnimationFrame(() => { sceneVisible.value = true })
  }, 200)
}

const accentColor = computed(() =>
  selected.value ? CATEGORY_COLORS[selected.value.category] : '#6ec8ff'
)

const compoundList = computed(() => {
  if (!selected.value) return []
  return selected.value.compounds
    .filter(k => COMPOUNDS[k])
    .map(k => ({ key: k, ...COMPOUNDS[k] }))
})

const currentCompound = computed(() =>
  compoundKey.value ? COMPOUNDS[compoundKey.value] : null
)
</script>

<template>
  <div class="root">
    <!-- Periodic Table View -->
    <Transition name="table">
      <PeriodicTable
        v-if="view === 'table'"
        :selected-symbol="selected?.symbol"
        :scattering="scattering"
        :scatter-origin="scatterOrigin"
        @select="selectElement"
      />
    </Transition>

    <!-- Atom / Molecule Scene Layer -->
    <div
      v-if="view !== 'table'"
      class="scene-layer"
      :class="{ visible: sceneVisible }"
    >
      <AtomScene
        v-if="view === 'atom'"
        :key="`atom-${selected.symbol}`"
        :element="selected"
      />
      <MoleculeScene
        v-else-if="view === 'molecule' && currentCompound"
        :key="`mol-${compoundKey}`"
        :compound-key="compoundKey"
      />

      <!-- Overlay HUD -->
      <div class="hud" :style="{ '--accent': accentColor }">
        <button class="back" @click="view === 'molecule' ? backToAtom() : backToTable()">
          <span class="arrow">←</span>
          {{ view === 'molecule' ? 'Back to Atom' : 'Back to Table' }}
        </button>

        <div class="info-card">
          <div class="info-head" :style="{ background: `linear-gradient(135deg, ${accentColor}55, ${accentColor}15)` }">
            <div class="z-num">{{ selected.z }}</div>
            <div class="symbol">{{ selected.symbol }}</div>
            <div class="meta">
              <div class="name">{{ selected.name }}</div>
              <div class="cat">{{ CATEGORY_LABELS[selected.category] }}</div>
            </div>
          </div>

          <div class="rows">
            <div class="row"><span>Atomic mass</span><b>{{ selected.mass.toFixed(3) }}</b></div>
            <div class="row"><span>Protons</span><b>{{ selected.z }}</b></div>
            <div class="row"><span>Neutrons</span><b>{{ Math.max(0, Math.round(selected.mass) - selected.z) }}</b></div>
            <div class="row"><span>Electrons</span><b>{{ selected.z }}</b></div>
            <div class="row"><span>Shells</span><b>{{ selected.shells.join(', ') }}</b></div>
          </div>

          <div v-if="compoundList.length" class="compounds">
            <div class="section-title">Common Compounds</div>
            <button
              v-for="c in compoundList"
              :key="c.key"
              class="compound-btn"
              :class="{ active: compoundKey === c.key }"
              @click="showCompound(c.key)"
            >
              <span class="formula" v-html="c.formula"></span>
              <span class="cname">{{ c.name }}</span>
            </button>
          </div>
          <div v-else class="empty">
            <em>No compound presets for this element yet.</em>
          </div>
        </div>

        <div class="view-tag">
          <span class="dot" />
          {{ view === 'atom' ? 'Atomic Structure' : `${currentCompound?.formula ?? ''} · ${currentCompound?.name ?? ''}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Periodic Table transition */
.table-enter-active, .table-leave-active {
  transition: opacity 0.4s ease;
}
.table-enter-from, .table-leave-to { opacity: 0; }

/* Scene layer fades in */
.scene-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.55s ease;
}
.scene-layer.visible {
  opacity: 1;
}

/* HUD overlay */
.hud {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hud > * { pointer-events: auto; }

.back {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 100px;
  background: rgba(20, 27, 48, 0.7);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text);
  font-size: 14px;
  backdrop-filter: blur(8px);
  transition: background 0.2s, border-color 0.2s;
}
.back:hover {
  background: rgba(30, 40, 70, 0.9);
  border-color: var(--accent);
}
.arrow { font-size: 16px; line-height: 1; }

.info-card {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: rgba(14, 20, 36, 0.78);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.info-head {
  display: grid;
  grid-template-columns: 56px 1fr;
  grid-template-rows: auto auto;
  padding: 18px 16px 14px;
  gap: 4px 12px;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.z-num {
  grid-row: 1 / span 2;
  text-align: center;
  font-size: 12px;
  color: var(--text-dim);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 4px 0 8px;
  background: rgba(255,255,255,0.04);
  font-weight: 600;
}
.symbol {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1;
  color: #fff;
  text-shadow: 0 0 12px var(--accent);
  grid-column: 1;
  margin-top: -6px;
  text-align: center;
}
.meta { grid-column: 2; grid-row: 1 / span 2; }
.name { font-weight: 600; font-size: 18px; color: #fff; }
.cat { font-size: 12px; color: var(--text-dim); margin-top: 2px; }

.rows {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 13px;
}
.row span { color: var(--text-dim); }
.row b { color: var(--text); font-weight: 500; }

.compounds {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-dim);
  margin-bottom: 8px;
}
.compound-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 12px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid transparent;
  font-size: 13px;
  color: var(--text);
  text-align: left;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.compound-btn:hover {
  background: rgba(255,255,255,0.08);
  border-color: var(--accent);
  transform: translateX(2px);
}
.compound-btn.active {
  background: rgba(110, 200, 255, 0.12);
  border-color: var(--accent);
}
.formula { font-weight: 600; }
.cname { color: var(--text-dim); font-size: 12px; }

.empty {
  padding: 12px 16px 16px;
  font-size: 12px;
  color: var(--text-dim);
}

.view-tag {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(20, 27, 48, 0.7);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  font-size: 12px;
  color: var(--text-dim);
  backdrop-filter: blur(8px);
}
.view-tag .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}
</style>
