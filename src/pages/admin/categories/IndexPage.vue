<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const TableCategories = defineAsyncComponent(() =>
  import('components/categories/TableCategories.vue')
)
</script>

<template>
  <Suspense>
    <TableCategories />
    <template #fallback>
      <q-linear-progress indeterminate />
    </template>
  </Suspense>
</template>
