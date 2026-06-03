<script setup>
import { computed, ref, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import { Euler } from 'three'

const props = defineProps({
  radius: { type: Number, required: true },
  count: { type: Number, required: true },
  shellIndex: { type: Number, required: true },
  color: { type: String, default: '#6ec8ff' }
})

// Each shell has its own tilt. The orbit ring is drawn as a thin torus.
const orbitTilt = computed(() => {
  const i = props.shellIndex
  return new Euler(
    Math.PI * 0.5 + (i % 2) * 0.3 - 0.15,
    i * 0.6,
    i * 0.4
  )
})

const angles = Array.from({ length: props.count }, (_, i) => (i / props.count) * Math.PI * 2)
const electronRefs = ref([])
const speed = 0.4 + 0.6 / (props.shellIndex + 1)

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  const meshes = electronRefs.value
  for (let i = 0; i < props.count; i++) {
    angles[i] += delta * speed
    const a = angles[i]
    const m = meshes[i]
    if (m && m.position) {
      m.position.set(Math.cos(a) * props.radius, 0, Math.sin(a) * props.radius)
    }
  }
})
</script>

<template>
  <TresGroup :rotation="orbitTilt">
    <!-- Orbit ring -->
    <TresMesh :rotation="[Math.PI / 2, 0, 0]">
      <TresTorusGeometry :args="[radius, 0.012, 8, 96]" />
      <TresMeshBasicMaterial :color="'#9f927d'" :transparent="true" :opacity="0.32" />
    </TresMesh>
    <!-- Electrons -->
    <TresMesh
      v-for="i in count"
      :key="i"
      :ref="el => { if (el) electronRefs[i - 1] = el }"
    >
      <TresSphereGeometry :args="[0.18, 16, 16]" />
      <TresMeshStandardMaterial
        :color="color"
        :roughness="0.3"
        :metalness="0.15"
      />
    </TresMesh>
  </TresGroup>
</template>
