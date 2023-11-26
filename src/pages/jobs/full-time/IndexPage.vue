<template>
  <div id="part-time-page">
    <div class="q-pa-md">
      <div class="text-h5">Lowongan Pekerjaan Part-time</div>

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
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { PartTimeJobType } from 'src/models/partTime';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { id } from 'date-fns/locale';
import { JobWithCompanyWithCategoriesInfo } from 'src/components/models';
import { useJobStore } from 'src/stores/job';
import { useRouter } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';

const jobs = ref<PartTimeJobType[]>([]);
const router = useRouter();
const quasar = useQuasar();
const jobStore = useJobStore();

onMounted(async () => {
  try {
    await getJobs()
  } catch (error) {
    throw error;
  }
})

const getJobs = async () => {
  const response = await api.get('full-time-jobs');
  jobs.value = response.data

}

const redirectToJobDetail = (job: JobWithCompanyWithCategoriesInfo) => {
  jobStore.$state.temporaryJob = job;
  router.push({ name: 'JobDetail', params: { id: job.id } });
}

</script>

<style scoped></style>
