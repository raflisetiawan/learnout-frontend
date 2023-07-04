<script setup lang="ts">
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Report } from 'src/components/models';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const bar = ref();

const loadedJobsPerMonth = ref(false);
const jobsPerMonth = ref<Report[]>([]);

const loadedJobListingsCountPerMonth = ref(false);
const openJobListingsCountPerMonth = ref<Report[]>([]);

const loadedCloseJobListingsCountPerMonth = ref(false);
const closeJobListingsCountPerMonth = ref<Report[]>([]);


const chartOptions = ref({
  responsive: true
})

const mountData = async () => {
  try {
    bar.value.start();
    const getJobPerMonth = await api('report/jobListingsPerMonth');
    jobsPerMonth.value = getJobPerMonth.data;
    loadedJobsPerMonth.value = true;

    const getOpenJobListingsCountPerMonth = await api('report/getOpenJobListingsCountPerMonth');
    openJobListingsCountPerMonth.value = getOpenJobListingsCountPerMonth.data;
    loadedJobListingsCountPerMonth.value = true;

    const getCloseJobListingsCountPerMonth = await api('report/getCloseJobListingsCountPerMonth');
    closeJobListingsCountPerMonth.value = getCloseJobListingsCountPerMonth.data;
    loadedCloseJobListingsCountPerMonth.value = true;
  } catch (error) {
    throw error;
  } finally {
    bar.value.stop();
  }
}

onMounted(async () => {
  await mountData();
})
</script>
<template>
  <div class="row q-pa-md">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <template v-for="job in jobsPerMonth" :key="job.month">
      <div class="col-md-8 col-sm-10 col-xs-12 q-mb-md">
        <Bar v-if="loadedJobsPerMonth"
          :data="{ labels: job.month, datasets: [{ data: job.count, label: `Jumlah semua Pekerjaan yang di post per bulan`, backgroundColor: 'rgb(227,93,106)' }] }"
          :options="chartOptions">
        </Bar>
      </div>
    </template>
    <template v-for="job in openJobListingsCountPerMonth" :key="job.month">
      <div class="col-md-8 col-sm-10 col-xs-12 q-mb-md">
        <Bar v-if="loadedJobListingsCountPerMonth"
          :data="{ labels: job.month, datasets: [{ data: job.count, label: `Jumlah Pekerjaan yang di buka per bulan`, backgroundColor: 'teal' }] }"
          :options="chartOptions">
        </Bar>
      </div>
    </template>
    <template v-for="job in closeJobListingsCountPerMonth" :key="job.month">
      <div class="col-md-8 col-sm-10 col-xs-12 q-mb-md">
        <Bar v-if="loadedCloseJobListingsCountPerMonth"
          :data="{ labels: job.month, datasets: [{ data: job.count, label: `Jumlah Pekerjaan yang di tutup per bulan`, backgroundColor: 'grey' }] }"
          :options="chartOptions">
        </Bar>
      </div>
    </template>
  </div>
</template>
