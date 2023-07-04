<script setup lang="ts">
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Report } from 'src/components/models';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const bar = ref();

const loadedApplicationsPerMonth = ref(false);
const applicationsCountPerMonth = ref<Report[]>([]);

const loadedacceptedApplicationsCountPerMonth = ref(false);
const acceptedApplicationsCountPerMonth = ref<Report[]>([]);

const loadedRejectedApplicationsCountPerMonth = ref(false);
const rejectedApplicationsCountPerMonth = ref<Report[]>([]);

const loadedPendingApplicationsCountPerMonth = ref(false);
const pendingApplicationsCountPerMonth = ref<Report[]>([]);

const chartOptions = ref({
  responsive: true
})

const mountData = async () => {
  try {
    bar.value.start();
    const getApplicationsCountPerMonth = await api.get('getApplicationsCountPerMonth');
    applicationsCountPerMonth.value = getApplicationsCountPerMonth.data
    loadedApplicationsPerMonth.value = true;

    const getAcceptedApplicationsCountPerMonth = await api('getAcceptedApplicationsCountPerMonth');
    acceptedApplicationsCountPerMonth.value = getAcceptedApplicationsCountPerMonth.data;
    loadedacceptedApplicationsCountPerMonth.value = true;

    const getRejectedApplicationsCountPerMonth = await api('getRejectedApplicationsCountPerMonth');
    rejectedApplicationsCountPerMonth.value = getRejectedApplicationsCountPerMonth.data;
    loadedRejectedApplicationsCountPerMonth.value = true;

    const getPendingApplicationsCountPerMonth = await api('getPendingApplicationsCountPerMonth');
    pendingApplicationsCountPerMonth.value = getPendingApplicationsCountPerMonth.data;
    loadedPendingApplicationsCountPerMonth.value = true;
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
    <template v-for="application in applicationsCountPerMonth" :key="application.month">
      <div class="col-md-8 col-sm-10 col-xs-12 q-mb-lg">
        <Bar v-if="loadedApplicationsPerMonth"
          :data="{ labels: application.month, datasets: [{ data: application.count, label: `Jumlah Lamaran Per bulannya`, backgroundColor: 'rgb(227,93,106)' }] }"
          :options="chartOptions">
        </Bar>
      </div>
    </template>
    <template v-for="application in acceptedApplicationsCountPerMonth" :key="application.month">
      <div class="col-md-8 col-sm-10 col-xs-12">
        <Bar v-if="loadedacceptedApplicationsCountPerMonth"
          :data="{ labels: application.month, datasets: [{ data: application.count, label: `Jumlah Lamaran yang di terima Per bulannya`, backgroundColor: 'lightblue' }] }"
          :options="chartOptions">
        </Bar>
      </div>
    </template>
    <template v-for="application in rejectedApplicationsCountPerMonth" :key="application.month">
      <div class="col-md-8 col-sm-10 col-xs-12">
        <Bar v-if="loadedRejectedApplicationsCountPerMonth"
          :data="{ labels: application.month, datasets: [{ data: application.count, label: `Jumlah Lamaran yang di tolak Per bulannya`, backgroundColor: 'teal' }] }"
          :options="chartOptions">
        </Bar>
      </div>
    </template>
    <template v-for="application in pendingApplicationsCountPerMonth" :key="application.month">
      <div class="col-md-8 col-sm-10 col-xs-12">
        <Bar v-if="loadedPendingApplicationsCountPerMonth"
          :data="{ labels: application.month, datasets: [{ data: application.count, label: `Jumlah Lamaran yang masih pending / proses Per bulannya`, backgroundColor: 'yellow' }] }"
          :options="chartOptions">
        </Bar>
      </div>
    </template>
  </div>
</template>
