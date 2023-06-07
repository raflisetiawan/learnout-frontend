<script setup lang="ts" async>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import getUser from 'src/utils/getUser';
import { JobInfo } from 'components/models';
import { CategoryInfo } from 'components/models';

interface JobWithCategories extends JobInfo {
  categories: CategoryInfo[];
}

const jobs = ref<JobWithCategories[]>([]);

try {
  const user = await getUser(localStorage.getItem('token'));
  const student = await api(`/students/getOneStudentByUserId/${user.data.id}`);
  const responseAroundRegency = await api(`joblistings/searchByRegency/${student.data.student.regency}`);
  const responseCompany = await api(``)
  const jobIdArray = responseAroundRegency.data.map((job: JobInfo) => job.id);
  const responseCategoriesArray = await Promise.all(jobIdArray.map((jobId: string) => api(`jobs/getCategoriesByJobId/${jobId}`)));
  const jobWithCategoriesArray: JobWithCategories[] = responseAroundRegency.data.map((job: JobInfo, index: number) => ({
    ...job,
    categories: responseCategoriesArray[index].data
  }));
  jobs.value.push(...jobWithCategoriesArray);
  console.log(jobs.value);
} catch (error) {
  throw error;
}
</script>

<template>
  <section class="activity-section">
    <div class="q-pa-md">
      <div class="text-h4 section-title">Lowongan di sekitar anda</div>

      <q-list bordered separator>
        <q-item clickable v-ripple v-for="job in jobs" :key="job.description">
          <q-item-section>
            <q-item-label class="text-h6">{{ job.title }}</q-item-label>
            <q-item-label>{{ job. }}</q-item-label>
            <!-- <q-item-label caption>{{ activity.date }}</q-item-label> -->
          </q-item-section>

          <q-item-section side>
            <q-avatar>
              <!-- <img :src="activity.userAvatar" alt="User Avatar"> -->
            </q-avatar>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </section>
</template>
