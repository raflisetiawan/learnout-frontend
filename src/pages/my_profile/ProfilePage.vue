<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const ProfileCard = defineAsyncComponent(() =>
  import('components/student/profile/ProfileCard.vue')
)


</script>

<template>
  <Suspense>
    <ProfileCard />
    <template #fallback>
      <q-linear-progress indeterminate />
    </template>
  </Suspense>
</template>


<style scoped>
.gradient-card-profile {
  background: rgb(238, 174, 196);
  background: radial-gradient(circle, rgba(238, 174, 196, 1) 33%, rgba(148, 187, 233, 1) 100%);
  height: 150px;
}
</style>
