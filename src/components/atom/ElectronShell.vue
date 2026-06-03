<script setup>
import { computed, ref } from 'vue'
import { useLoop } from '@tresjs/core'
import { Euler, Vector3 } from 'three'

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

const electronAngles = ref(
  Array.from({ length: props.count }, (_, i) => (i / props.count) * Math.PI * 2)
)

const electronPositions = ref(
  electronAngles.value.map(a => new Vector3(Math.cos(a) * props.radius, 0, Math.sin(a) * props.radius))
)

const speed = 0.5 / (props.shellIndex + 1)
const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  for (let i = 0; i < props.count; i++) {
    electronAngles.value[i] += delta * speed
    const a = electronAngles.value[i]
    electronPositions.value[i].set(
      Math.cos(a) * props.radius,
      0,
      Math.sin(a) * props.radius
    )
  }
})
</script>

<template>
  <TresGroup :rotation="orbitTilt">
    <!-- Orbit ring -->
    <TresMesh :rotation="[Math.PI / 2, 0, 0]">
      <TresTorusGeometry :args="[radius, 0.012, 8, 96]" />
      <TresMeshBasicMaterial :color="color" :transparent="true" :opacity="0.35" />
    </TresMesh>
    <!-- Electrons -->
    <TresMesh
      v-for="(p, i) in electronPositions"
      :key="i"
      :position="p"
    >
      <TresSphereGeometry :args="[0.18, 12, 12]" />
      <TresMeshStandardMaterial
        :color="color"
        :emissive="color"
        :emissive-intensity="1.6"
        :roughness="0.2"
      />
    </TresMesh>
  </TresGroup>
</template>
