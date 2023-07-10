<script setup lang="ts">
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';

interface JoblistingPerMonth {
  month: string;
  title: string;
  company_name: string;
  status: string;
}

const joblistingPerMonth = ref<JoblistingPerMonth[]>([]);
const bar = ref();

const mountData = async () => {
  try {
    bar.value.start();
    const getJoblistingPerMonth = await api.get('report/getJoblistingPerMonth');
    joblistingPerMonth.value = getJoblistingPerMonth.data;

  } catch (error) {
    throw error;
  } finally {
    bar.value.stop();
  }
}

onMounted(async () => {
  mountData();
})
</script>
<template>
  <div class="q-pa-md">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <q-markup-table>
      <thead>
        <tr class="bg-primary text-white">
          <th class="text-left">Judul Pekerjaan</th>
          <th class="text-right">Nama Perusahaan</th>
          <th class="text-right">Bulan</th>
          <th class="text-right">Status</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="job in joblistingPerMonth" :key="job.title">
          <tr>
            <td class="text-left"> {{ job.title }}</td>
            <td class="text-right">{{ job.company_name }}</td>
            <td class="text-right">{{ job.month }}</td>
            <td class="text-right"><q-chip class="text-white" :color="job.status === 'Closed' ? `red` : `green`">{{
              job.status }}</q-chip>
            </td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
  </div>
</template>
