<script setup lang="ts">
import { api } from 'src/boot/axios';
import { CategoryInfo } from 'src/components/models';
import { useCompanyStore } from 'src/stores/company';
import { useUserStore } from 'src/stores/user';
import formatDate from 'src/utils/formatDate';
import { onMounted, ref } from 'vue';

interface JobsInfo {
  title: string;
  description: string;
  location: string;
  regency: string;
  district: string;
  schedule: string;
  isClosed: boolean;
  start_time: string; //time hour minute
  end_time: string; //time hour minute
  category: CategoryInfo[];
  created_at: Date;
}
const companyStore = useCompanyStore();
const jobs = ref<JobsInfo[]>([]);
const userStore = useUserStore();

onMounted(async () => {
  if (companyStore.$state.companyId !== 0) {
    const response = await api.get(`jobs/getJobByCompanyId/${companyStore.$state.companyId}`);
    jobs.value = response.data.data;
  } else {
    try {
      const response = await api.get(`jobs/getJobByUserId/${userStore.$state.userId}`);
      jobs.value = response.data.data;
    } catch (error) {
      throw error;
    }
  }
})
</script>
<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Nama Pekerjaan</th>
          <th class="text-right">Dibuat pada</th>
          <th class="text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="job in jobs" :key="job.id">
          <tr>
            <td class="text-left">{{ job.title }}</td>
            <td class="text-right">{{ formatDate(new Date(job.created_at)) }}</td>
            <td class="text-right">
              <q-btn color="red" v-if="job.isClosed" class="q-mr-md">Hapus</q-btn>
              <q-btn v-if="job.isClosed" color="green">Posting lagi</q-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
  </div>
</template>
