<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useRoute } from 'vue-router';
import { onBeforeMount, ref } from 'vue';
import { UniversitiesInfo } from 'src/components/models';


const route = useRoute();
const university = ref<UniversitiesInfo>();

onBeforeMount(async () => {
  const response = await api.get(`universities/${route.params.id}`)
  university.value = response.data.data;
})

</script>
<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-md-8">
        <q-card dark bordered class="bg-grey my-card">
          <q-card-section>
            <div class="text-h6">{{ university?.name }}</div>
            <div class="text-subtitle2">{{ university?.regency }} | {{ university?.district }}</div>
          </q-card-section>

          <q-separator dark inset />
          <q-card-section>
            {{ university?.location }}
          </q-card-section>
        </q-card>

      </div>
    </div>
  </div>
</template>
