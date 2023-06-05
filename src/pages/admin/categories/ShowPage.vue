<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useRoute } from 'vue-router';
import { onBeforeMount, ref } from 'vue';
import { CategoriesInfo } from 'src/components/models';


const route = useRoute();
const category = ref<CategoriesInfo>();

onBeforeMount(async () => {
  const response = await api.get(`categories/${route.params.id}`)
  category.value = response.data.data;
})

</script>
<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-md-8">
        <q-card dark bordered class="bg-grey my-card">
          <q-card-section>
            <div class="text-h6">{{ category?.name }}</div>
          </q-card-section>
        </q-card>

      </div>
    </div>
  </div>
</template>
