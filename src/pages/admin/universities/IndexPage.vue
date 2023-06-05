<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const TableSection = defineAsyncComponent(() =>
  import('components/universities/TableSection.vue')
)
</script>

<template>
  <Suspense>
    <TableSection />
    <template #fallback>
      <q-linear-progress indeterminate />
    </template>
  </Suspense>
</template>
