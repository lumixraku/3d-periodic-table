<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import PeriodicTable from './components/PeriodicTable.vue'
import { CATEGORY_COLORS, CATEGORY_LABELS } from './data/elements.js'
import { COMPOUNDS } from './data/compounds.js'

// Lazy-load 3D scenes so they don't bloat the initial bundle, but eagerly
// kick off the chunk download right after mount. By the time the user clicks
// an element ~seconds later, the chunks + their TresJS / Three.js deps are
// already parsed, so the scatter animation doesn't compete with module init.
const AtomScene = defineAsyncComponent(() => import('./components/AtomScene.vue'))
const MoleculeScene = defineAsyncComponent(() => import('./components/MoleculeScene.vue'))

function preloadScenes() {
  // requestIdleCallback (fallback: setTimeout) keeps preloading off the
  // critical path of the initial paint.
  const run = () => {
    import('./components/AtomScene.vue').catch(() => {})
    import('./components/MoleculeScene.vue').catch(() => {})
  }
  if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 800 })
  else setTimeout(run, 200)
}
onMounted(preloadScenes)

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
  top: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  height: 45px;
  border-radius: var(--r-pill);
  background: var(--focus-yellow);
  border: 2.5px solid #fff;
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: var(--shadow-press);
  transition: all var(--t-spring);
}
.back:hover {
  background: #ffd633;
  box-shadow: var(--shadow-press-hover);
  transform: translateY(-1px);
}
.back:active {
  box-shadow: var(--shadow-press-active);
  transform: translateY(2px);
}
.arrow { font-size: 16px; line-height: 1; }

.info-card {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 310px;
  background: var(--bg-1);
  border: 3px solid var(--border);
  /* Organic blob radius */
  border-radius: 32px 28px 36px 30px / 30px 36px 28px 32px;
  overflow: hidden;
  box-shadow: var(--shadow-card), 0 6px 0 0 rgba(189, 174, 160, 0.5);
}

.info-head {
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-template-rows: auto auto;
  padding: 20px 18px 16px;
  gap: 4px 14px;
  align-items: center;
  border-bottom: 2.5px dashed var(--border);
}

.z-num {
  grid-row: 1 / span 2;
  text-align: center;
  font-size: 12px;
  color: var(--text-head);
  border: 2px solid var(--border);
  border-radius: 14px;
  padding: 6px 0 10px;
  background: #fffdf5;
  font-weight: 800;
  box-shadow: 0 2px 0 0 #d4c9b4;
}
.symbol {
  font-size: 38px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
  color: var(--accent);
  grid-column: 1;
  margin-top: -4px;
  text-align: center;
  font-family: 'Zen Maru Gothic', 'Nunito', sans-serif;
}
.meta { grid-column: 2; grid-row: 1 / span 2; }
.name {
  font-weight: 800;
  font-size: 19px;
  color: var(--text-head);
  font-family: 'Zen Maru Gothic', 'Nunito', sans-serif;
}
.cat { font-size: 12px; color: var(--text-dim); margin-top: 2px; font-weight: 600; }

.rows {
  padding: 14px 18px;
  border-bottom: 2.5px dashed var(--border);
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 13px;
  font-weight: 600;
}
.row span { color: var(--text-dim); }
.row b { color: var(--text-head); font-weight: 800; }

.compounds {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-dim);
  font-weight: 800;
  margin-bottom: 6px;
}
.compound-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-radius: var(--r-pill);
  background: #fffdf5;
  border: 2px solid var(--border);
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  text-align: left;
  box-shadow: 0 3px 0 0 #d4c9b4;
  transition: all var(--t-spring);
}
.compound-btn:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  box-shadow: 0 4px 0 0 #11a89b;
  transform: translateY(-1px);
}
.compound-btn:active {
  box-shadow: 0 1px 0 0 #11a89b;
  transform: translateY(2px);
}
.compound-btn.active {
  background: var(--accent);
  border-color: var(--accent-active);
  color: #fff;
  box-shadow: 0 3px 0 0 var(--accent-active);
}
.compound-btn.active .cname { color: rgba(255, 255, 255, 0.85); }
.formula { font-weight: 800; }
.cname { color: var(--text-dim); font-size: 12px; font-weight: 600; }

.empty {
  padding: 12px 18px 18px;
  font-size: 12px;
  color: var(--text-dim);
  font-weight: 600;
  font-style: italic;
}

.view-tag {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  background: var(--bg-1);
  border: 2.5px solid var(--border);
  border-radius: var(--r-pill);
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-press);
}
.view-tag .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 2px rgba(111, 186, 44, 0.25);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.35); }
}
</style>
