<script setup lang="ts">
import FilterJob from 'components/student/FilterJob.vue';
import SearchJob from './SearchJob.vue';
import AccordingSkill from 'src/components/student/AccordingSkill.vue';
import { defineAsyncComponent } from 'vue';
import WorkAroundSkeleton from 'src/components/skeletons/WorkAroundSkeleton.vue';

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
          <Suspense>
            <FilterJob />
            <template #fallback>
              filter
            </template>
          </Suspense>
        </div>
      </div>
      <Suspense>
        <WorkAround />
        <template #fallback>
          <WorkAroundSkeleton />
        </template>
      </Suspense>
      <Suspense>
        <AccordingSkill />
        <template #fallback>
          <WorkAroundSkeleton />
        </template>
      </Suspense>
    </q-page-container>
  </q-layout>
</template>

