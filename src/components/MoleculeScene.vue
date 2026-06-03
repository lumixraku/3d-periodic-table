<script setup>
import { computed } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { Vector3, Quaternion } from 'three'
import { COMPOUNDS } from '../data/compounds.js'
import { ELEMENT_COLORS } from '../data/elements.js'

const props = defineProps({
  compoundKey: { type: String, required: true }
})

const compound = computed(() => COMPOUNDS[props.compoundKey])

const atomList = computed(() => {
  if (!compound.value) return []
  return compound.value.atoms.map((a, i) => ({
    idx: i,
    el: a.el,
    pos: new Vector3(...a.pos),
    color: ELEMENT_COLORS[a.el] ?? '#aaaaaa',
    // Radius approximation: H smallest, halogens / heavy bigger
    radius: a.el === 'H' ? 0.32 : a.el === 'C' ? 0.46 : a.el === 'O' ? 0.5 : a.el === 'N' ? 0.5 : a.el === 'S' ? 0.65 : a.el === 'Cl' ? 0.62 : a.el === 'Si' ? 0.72 : a.el === 'Na' ? 0.78 : 0.5
  }))
})

// Convert each bond to a cylinder with proper orientation. Multi-bonds get
// parallel cylinders offset perpendicular to the bond axis.
const bondGroups = computed(() => {
  if (!compound.value) return []
  // Count bonds between same pair
  const groups = new Map()
  for (const [a, b] of compound.value.bonds) {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    if (!groups.has(key)) groups.set(key, { a: Math.min(a, b), b: Math.max(a, b), count: 0 })
    groups.get(key).count++
  }
  return [...groups.values()]
})

const bondInstances = computed(() => {
  if (!compound.value) return []
  const atoms = atomList.value
  const out = []
  for (const g of bondGroups.value) {
    const pa = atoms[g.a].pos
    const pb = atoms[g.b].pos
    const mid = pa.clone().add(pb).multiplyScalar(0.5)
    const dir = pb.clone().sub(pa)
    const length = dir.length()
    // Quaternion from default cylinder axis Y to dir
    const up = new Vector3(0, 1, 0)
    const quat = new Quaternion().setFromUnitVectors(up, dir.clone().normalize())
    const rot = [0, 0, 0]
    // We instead use quaternion via TresJS prop array — convert to euler:
    // Easier: pass quaternion directly as :quaternion=""
    // Choose perpendicular axis for multi-bond offset
    const perp = new Vector3(1, 0, 0)
    if (Math.abs(dir.clone().normalize().dot(perp)) > 0.95) perp.set(0, 1, 0)
    const offsetDir = perp.cross(dir).normalize()
    const offsetMag = 0.18
    for (let i = 0; i < g.count; i++) {
      // For 1: no offset; for 2: ±0.5*offset; for 3: -1, 0, +1 * offset
      let off
      if (g.count === 1) off = 0
      else if (g.count === 2) off = (i === 0 ? -1 : 1) * offsetMag * 0.7
      else off = (i - 1) * offsetMag
      const pos = mid.clone().add(offsetDir.clone().multiplyScalar(off))
      out.push({
        position: pos,
        quaternion: quat,
        length
      })
    }
  }
  return out
})

const cameraDistance = computed(() => {
  // fit roughly to molecule size
  let maxR = 1
  for (const a of atomList.value) maxR = Math.max(maxR, a.pos.length())
  return Math.max(6, maxR * 3.2)
})
</script>

<template>
  <div class="molecule-scene">
    <TresCanvas
      clear-color="#ffffff"
      :antialias="true"
      window-size
    >
      <TresPerspectiveCamera :position="[0, 1, cameraDistance]" :fov="45" />
      <OrbitControls
        :enable-pan="false"
        :min-distance="3"
        :max-distance="30"
        :auto-rotate="true"
        :auto-rotate-speed="0.6"
      />

      <TresAmbientLight :intensity="0.85" />
      <TresDirectionalLight :position="[8, 10, 6]" :intensity="0.9" />
      <TresDirectionalLight :position="[-6, -4, -6]" :intensity="0.35" />

      <!-- Atoms -->
      <TresMesh
        v-for="a in atomList"
        :key="a.idx"
        :position="a.pos"
      >
        <TresSphereGeometry :args="[a.radius, 32, 32]" />
        <TresMeshStandardMaterial
          :color="a.color"
          :roughness="0.35"
          :metalness="0.1"
        />
      </TresMesh>

      <!-- Bonds -->
      <TresMesh
        v-for="(b, i) in bondInstances"
        :key="`b-${i}`"
        :position="b.position"
        :quaternion="b.quaternion"
      >
        <TresCylinderGeometry :args="[0.085, 0.085, b.length, 16]" />
        <TresMeshStandardMaterial
          color="#6e7488"
          :roughness="0.55"
          :metalness="0.15"
        />
      </TresMesh>
    </TresCanvas>
  </div>
</template>

<style scoped>
.molecule-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
