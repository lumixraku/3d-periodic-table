<script setup>
import { computed } from 'vue'
import { Vector3 } from 'three'

const props = defineProps({
  protonCount: { type: Number, required: true },
  neutronCount: { type: Number, required: true }
})

// Pack nucleons into a roughly spherical cluster. Generate stable positions
// using a deterministic seeded RNG so re-renders don't jitter.
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = a
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

const nucleons = computed(() => {
  const total = props.protonCount + props.neutronCount
  const rand = mulberry32(props.protonCount * 1000 + props.neutronCount)
  // Pack radius scales with cube root of total (atomic nucleus density)
  const cluster = Math.cbrt(total) * 0.42 + 0.4

  const items = []
  // Make a shuffled order of (isProton) labels
  const labels = []
  for (let i = 0; i < props.protonCount; i++) labels.push(true)
  for (let i = 0; i < props.neutronCount; i++) labels.push(false)
  // Fisher–Yates shuffle
  for (let i = labels.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[labels[i], labels[j]] = [labels[j], labels[i]]
  }

  // Place via spherical fibonacci-ish distribution + small jitter
  for (let i = 0; i < total; i++) {
    const t = (i + 0.5) / total
    const phi = Math.acos(1 - 2 * t)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    // Multi-layer radius
    const layerR = cluster * Math.cbrt(0.2 + rand() * 0.8)
    const x = layerR * Math.sin(phi) * Math.cos(theta) + (rand() - 0.5) * 0.05
    const y = layerR * Math.sin(phi) * Math.sin(theta) + (rand() - 0.5) * 0.05
    const z = layerR * Math.cos(phi) + (rand() - 0.5) * 0.05
    items.push({ pos: new Vector3(x, y, z), isProton: labels[i] })
  }
  return items
})
</script>

<template>
  <TresGroup>
    <template v-for="(n, i) in nucleons" :key="i">
      <TresMesh :position="n.pos">
        <TresSphereGeometry :args="[0.28, 16, 16]" />
        <TresMeshStandardMaterial
          :color="n.isProton ? '#fc736d' : '#889df0'"
          :roughness="0.42"
          :metalness="0.05"
        />
      </TresMesh>
    </template>
  </TresGroup>
</template>
