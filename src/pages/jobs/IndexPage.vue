<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { JobWithCompanyWithCategoriesInfo } from 'components/models';
import { useJobStore } from 'src/stores/job';
import { useFilterSearchStore } from 'src/stores/filterSearch';

const jobStore = useJobStore();
const bar = ref();
const jobs = ref<JobWithCompanyWithCategoriesInfo[]>([]);
const route = useRoute();
const router = useRouter();
const quasar = useQuasar();
const isSearched = route.query.keyword !== undefined;
const filterSearch = useFilterSearchStore();

onMounted(async () => {

  const params = {};
  if (filterSearch.$state.isFilter) {
    if (filterSearch.$state.categories.length > 0) {
      params['category'] = filterSearch.$state.categories;
    }

    if (filterSearch.$state.regency !== '') {
      // filterSearch.$state.regency = locationStore.$state.regency?.name;
      params['regency'] = filterSearch.$state.regency;
    }
    try {
      bar.value.start();
      const response = await api.get('jobs', { params });
      jobs.value = response.data.data.data;
      console.log(jobs.value);
    } catch (error) {
      throw error;
    } finally {
      bar.value.stop()
    }
  } else {
    if (isSearched) {
      const response = await api.get(`jobs?keyword=${route.query.keyword}`);
      jobs.value = response.data.data.data;
    } else {
      try {
        bar.value.start();
        const response = await api.get('jobs');
        jobs.value = response.data.data.data;
      } catch (error) {
        throw error;
      } finally {
        bar.value.stop();
      }
    }
  }

})

const redirectToJobDetail = (job: JobWithCompanyWithCategoriesInfo) => {
  jobStore.$state.temporaryJob = job;
  router.push({ name: 'JobDetail', params: { id: job.id } });
}
</script>

<template>
  <section class="all-job-section">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="q-pa-md">
      <div class="text-h4 section-title" v-if="filterSearch.$state.isFilter">Hasil Filter</div>
      <div class="text-h4 section-title" v-else-if="isSearched">Hasil pencarian Pekerjaan</div>
      <div class="text-h4 section-title" v-else>Semua Pekerjaan</div>

      <div :class="quasar.screen.lt.md ? `row justify-center` : `row`">
        <template v-for="job in jobs" :key="job.id">
          <div class="col-md-4 col-sm-6 col-xs-10 q-mb-md q-pa-md">
            <q-card v-ripple class="my-card cursor-pointer" flat bordered @click="redirectToJobDetail(job)">

              <q-card-section>
                <div class="text-h5 q-mt-sm q-mb-xs">{{ job.title }}</div>
                <div class="text-overline">{{ job.company.name }}</div>
                <div>{{ job.location }} - {{ job.district }} - {{ job.regency }}</div>
                <template v-for="category in job.categories" :key="category.id">
                  <q-badge color="primary" class="q-mr-sm">
                    {{ category.name }}
                  </q-badge>
                </template>
                <div class="text-caption text-grey">
                  {{ formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: id }) }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
