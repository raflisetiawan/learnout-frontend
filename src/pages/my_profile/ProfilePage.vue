<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const ProfileCard = defineAsyncComponent(() =>
  import('components/student/profile/ProfileCard.vue')
)
</script>

<template>
  <div>
    <Suspense>
      <ProfileCard />
      <template #fallback>
        <q-linear-progress indeterminate />
      </template>
    </Suspense>
  </div>
</template>
