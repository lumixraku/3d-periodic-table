<script setup>
import { computed, shallowRef, watch } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { CATEGORY_COLORS } from '../data/elements.js'
import Nucleus from './atom/Nucleus.vue'
import ElectronShell from './atom/ElectronShell.vue'

const props = defineProps({
  element: { type: Object, required: true },
  appearing: { type: Boolean, default: false } // play scale-in on enter
})

const shellRadii = computed(() => {
  // base 2.2, gap 1.2 per shell
  return props.element.shells.map((_, i) => 2.6 + i * 1.6)
})

const accent = computed(() => CATEGORY_COLORS[props.element.category] ?? '#6ec8ff')
</script>

<template>
  <div class="atom-scene">
    <TresCanvas
      clear-color="#000000"
      :alpha="true"
      :antialias="true"
      window-size
    >
      <TresPerspectiveCamera :position="[0, 4, 18]" :fov="50" />
      <OrbitControls
        :enable-pan="false"
        :min-distance="8"
        :max-distance="40"
        :auto-rotate="true"
        :auto-rotate-speed="0.4"
      />

      <TresAmbientLight :intensity="0.5" />
      <TresPointLight :position="[0, 0, 0]" :intensity="1.2" :color="accent" :distance="15" />
      <TresDirectionalLight :position="[10, 10, 10]" :intensity="0.8" />

      <Nucleus
        :proton-count="element.z"
        :neutron-count="Math.max(0, Math.round(element.mass) - element.z)"
      />

      <ElectronShell
        v-for="(count, i) in element.shells"
        :key="`${element.symbol}-${i}`"
        :radius="shellRadii[i]"
        :count="count"
        :shell-index="i"
        :color="accent"
      />
    </TresCanvas>
  </div>
</template>

<style scoped>
.atom-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
