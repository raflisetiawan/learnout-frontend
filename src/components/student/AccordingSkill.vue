<script setup lang="ts" async>
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useUserStore } from 'src/stores/user';
import { JobWithCompanyWithCategoriesInfo } from '../models';
import { formatDistanceToNow } from 'date-fns';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { id } from 'date-fns/locale';
import { useJobStore } from 'stores/job';

const quasar = useQuasar();
const router = useRouter();
const userStore = useUserStore();
const jobStore = useJobStore()
const jobs = ref<JobWithCompanyWithCategoriesInfo[]>([]);

try {
  const getJobByStudentInterest = await api(`/jobs/getJobByInterest/${userStore.$state.userId}`)
  jobs.value = getJobByStudentInterest.data.jobs;
} catch (error) {
  throw error;
}

const redirectToJobDetail = (job: JobWithCompanyWithCategoriesInfo) => {
  jobStore.$state.temporaryJob = job;
  router.push({ name: 'JobDetail', params: { id: job.id } });
}
</script>

<template>
  <section class="activity-section">
    <div class="q-pa-md">
      <div class="text-h4 section-title">Pekerjaan sesuai minat anda</div>

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
