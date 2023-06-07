<script setup lang="ts">
import FilterJob from 'components/student/FilterJob.vue';
import SearchJob from './SearchJob.vue';
import AccordingSkill from 'src/components/student/AccordingSkill.vue';
import { defineAsyncComponent } from 'vue';

const WorkAround = defineAsyncComponent(() =>
  import('components/student/WorkAround.vue')
)

</script>

<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <div class="row justify-center">
        <div class="col-md-6">
          <SearchJob />
        </div>
        <div class="col-md-1">
          <FilterJob />
        </div>
      </div>
      <Suspense>
        <WorkAround />
        <template #fallback>
          <q-linear-progress indeterminate />
        </template>
      </Suspense>
      <AccordingSkill />
    </q-page-container>
  </q-layout>
</template>

