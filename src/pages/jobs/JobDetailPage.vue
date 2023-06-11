<script setup lang="ts">
import { api } from 'src/boot/axios';
import { JobWithCompanyWithCategoriesInfo } from 'src/components/models';
import { useJobStore } from 'stores/job';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const jobStore = useJobStore();
const job = ref<JobWithCompanyWithCategoriesInfo>();
const route = useRoute();
const bar = ref(); // Menambahkan ref untuk AJAX bar

if (jobStore.$state.temporaryJob === null) {
  onMounted(async () => {
    bar.value.start(); // Memulai AJAX bar
    try {
      const response = await api(`/jobs/showJobWithCompanyAndCategories/${route.params.id}`);
      job.value = response.data.data;
    } catch (error) {
      throw error;
      // Penanganan error jika diperlukan
    } finally {
      bar.value.stop(); // Menghentikan AJAX bar setelah permintaan selesai
    }
  });
} else {
  job.value = jobStore.$state.temporaryJob;
}
</script>
<template>
  <div class="">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="q-pa-md">
      <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-10">
          <div class="text-h4">{{ job?.title }}</div>
        </div>
        <div class="col-md-4 col-sm-6 col-sm-2">
          <q-btn color="primary" :to="{ name: 'Application' }">Lamar</q-btn>
        </div>
      </div>
      <div class="text-overline">{{ job?.company.name }}</div>
      <div class="text-caption text-grey q-mb-md">Di posting sejak:
        {{ job?.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: id }) : '' }}
      </div>
      <p v-html="job?.description"></p>
    </div>
  </div>
</template>
