<script setup lang="ts">
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';

interface ApplicationsPerMonth {
  month: string;
  title: string;
  company_name: string;
  status: string;
  student_name: string;
}

const applicationsPerMonth = ref<ApplicationsPerMonth[]>([]);
const bar = ref();

const mountData = async () => {
  try {
    bar.value.start();
    const getApplicationsPerMonth = await api.get('report/getApplicationsPerMonth');
    console.log(getApplicationsPerMonth)
    applicationsPerMonth.value = getApplicationsPerMonth.data;

  } catch (error) {
    throw error;
  } finally {
    bar.value.stop();
  }
}

onMounted(async () => {
  mountData();
})

const chipColor = (status: string) => {
  if (status === 'reject') {
    return 'red'
  } else if (status === 'accept') {
    return 'green'
  } else {
    return 'yellow'
  }
}
</script>
<template>
  <div class="q-pa-md">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <q-markup-table>
      <thead>
        <tr class="bg-primary text-white">
          <th class="text-left">Nama mahasiswa</th>
          <th class="text-left">Judul Pekerjaan</th>
          <th class="text-right">Nama Perusahaan</th>
          <th class="text-right">Bulan</th>
          <th class="text-right">Status</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="job in applicationsPerMonth" :key="job.title">
          <tr>
            <td class="text-left"> {{ job.student_name }}</td>
            <td class="text-left"> {{ job.title }}</td>
            <td class="text-right">{{ job.company_name }}</td>
            <td class="text-right">{{ job.month }}</td>
            <td class="text-right"><q-chip class="text-white" :color="chipColor(job.status)">{{
              job.status }}</q-chip>
            </td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
  </div>
</template>
