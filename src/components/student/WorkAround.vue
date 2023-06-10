<script setup lang="ts" async>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { JobWithCompanyWithCategoriesInfo } from 'components/models';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useJobStore } from 'stores/job';
import { useUserStore } from 'stores/user';

const quasar = useQuasar();
const router = useRouter();
const jobStore = useJobStore();
const userStore = useUserStore();
const jobs = ref<JobWithCompanyWithCategoriesInfo[]>([]);

try {
  const responseAroundRegency = await api(`/students/getJobAround/${userStore.$state.userId}`);
  jobs.value = responseAroundRegency.data.jobs;
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
      <div class="text-h4 section-title">Lowongan di sekitar anda</div>

      <div :class="quasar.screen.lt.md ? `row justify-center` : `row`">
        <template v-for="job in jobs" :key="job.id">
          <div class="col-md-4 col-sm-6 col-xs-10 q-mb-md q-pa-md">
            <q-card v-ripple class="my-card cursor-pointer" flat bordered @click="redirectToJobDetail(job)">

              <q-card-section>
                <div class="text-h5 q-mt-sm q-mb-xs">{{ job.title }}</div>
                <div class="text-overline">{{ job.company.name }}</div>
                <p>{{ job.location }} - {{ job.district }} - {{ job.regency }}</p>
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
