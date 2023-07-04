<script setup lang="ts">
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface ApplicationsPerDay {
  month: string;
  date: string[];
  count: number[];
}

const loadedApplicationsPerDay = ref(false);
const bar = ref();
const totalStudents = ref(0);
const totalCompanies = ref(0);
const totalClosedJob = ref(0);
const totalOpenedJob = ref(0);
const totalGetApplication = ref(0);
const applicationsPerDay = ref<ApplicationsPerDay[]>([]);
const chartOptions = ref({
  responsive: true
})

const mountData = async () => {
  try {
    bar.value.start();
    const getTotalStudents = await api.get('students/count/total');
    totalStudents.value = getTotalStudents.data.total_students;

    const getTotalCompanies = await api.get('companies/count/total');
    totalCompanies.value = getTotalCompanies.data.totalCompanies;

    const getIsClosedJob = await api.get('/jobs/count/is-closed-count');
    totalClosedJob.value = getIsClosedJob.data.closedCount;
    totalOpenedJob.value = getIsClosedJob.data.openCount;

    const getApplicationCount = await api.get('getApplicationCount');
    totalGetApplication.value = getApplicationCount.data.count;

    const getApplicationsPerDay = await api.get('getApplicationsCountPerDay');
    applicationsPerDay.value = getApplicationsPerDay.data;
    loadedApplicationsPerDay.value = true;

    const getApplicationsCountPerMonth = await api.get('getApplicationsCountPerMonth');
    console.log(getApplicationsCountPerMonth.data);
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
  <section id="dashboard-admin">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="row q-pa-md">
      <div class="col-md-3 col-sm-6 col-xs-6">
        <q-card class="q-pa-md q-mr-md q-ma-md">
          <div class="row q-py-md full-width items-center justify-center">
            <div class="total-sales-box justify-center items-center">
              <q-icon class="items-center full-height full-width vertical-middle" name="rate_review" size="lg"
                color="orange" />
            </div>
          </div>
          <div class="row text-weight-bold text-body1 full-width justify-center">
            Total pendaftar sebagai mahasiswa
          </div>
          <div class="row text-weight-bold text-h4 full-width justify-center">
            {{ totalStudents }}
          </div>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-6">
        <q-card class="q-pa-md q-ma-md">
          <div class="row q-py-md full-width items-center justify-center">
            <div class="total-sales-box justify-center items-center">
              <q-icon class="items-center full-height full-width vertical-middle" name="approval" size="lg"
                color="green" />
            </div>
          </div>
          <div class="row text-weight-bold text-body1 full-width justify-center">
            Total Pendaftar sebagai perusahaan
          </div>
          <div class="row text-weight-bold text-h4 full-width justify-center">
            {{ totalCompanies }}
          </div>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-6">
        <q-card class="q-pa-md q-ma-md">
          <div class="row q-py-md full-width items-center justify-center">
            <div class="total-sales-box justify-center items-center">
              <q-icon class="items-center full-height full-width vertical-middle " name="disabled_by_default" size="lg"
                color="red" />
            </div>
          </div>
          <div class="row text-weight-bold text-body1 full-width justify-center">
            Total Lowongan yang di buka
          </div>
          <div class="row text-weight-bold text-h4 full-width justify-center">
            {{ totalOpenedJob }}
          </div>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-6">
        <q-card class="q-pa-md q-ma-md">
          <div class="row q-py-md full-width items-center justify-center">
            <div class="total-sales-box justify-center items-center">
              <q-icon class="items-center full-height full-width vertical-middle " name="disabled_by_default" size="lg"
                color="red" />
            </div>
          </div>
          <div class="row text-weight-bold text-body1 full-width justify-center">
            Total Lowongan yang di tutup
          </div>
          <div class="row text-weight-bold text-h4 full-width justify-center">
            {{ totalClosedJob }}
          </div>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-6">
        <q-card class="q-pa-md q-ma-md">
          <div class="row q-py-md full-width items-center justify-center">
            <div class="total-sales-box justify-center items-center">
              <q-icon class="items-center full-height full-width vertical-middle " name="disabled_by_default" size="lg"
                color="red" />
            </div>
          </div>
          <div class="row text-weight-bold text-body1 full-width justify-center">
            Total Semua lamaran
          </div>
          <div class="row text-weight-bold text-h4 full-width justify-center">
            {{ totalGetApplication }}
          </div>
        </q-card>
      </div>
    </div>
    <div class="row q-pa-md">
      <template v-for="application in applicationsPerDay" :key="application.month">
        <div class="col-md-12">
          <Bar v-if="loadedApplicationsPerDay"
            :data="{ labels: application.date, datasets: [{ data: application.count, label: `Jumlah Pelamar Pada bulan ${application.month}`, backgroundColor: 'rgb(227,93,106)' }] }"
            :options="chartOptions">
          </Bar>
        </div>
      </template>
    </div>


    <!-- <div class="col-md-3">
        <q-card v-if="studentStore.$state.data"
          class="q-pa-md q-ma-md float-right full-width right-card-item-2 text-white" style="background-color: #4158D0;
background-image: linear-gradient(43deg, #4158D0 0%, #ff82df 44%, #ffe0ab 100%);
">
          <div class="row col-12 full-width items-center">
            <div class="col-5">
              <q-avatar size="70px">
                <img :src="studentStore.$state.data?.user?.image ?? ''" />
              </q-avatar>
            </div>
          </div>
          <div class="row col-12 q-mt-lg text-weight-bold">Name : {{ studentStore.$state.data?.student.name }}</div>
          <div class="row col-12 q-mt-xs text-weight-bold">
            Email : {{ studentStore.$state.data?.user.email }}
          </div>
          <div class="row col-12 q-mt-xs text-weight-bold">
            <span>Instansi : {{ studentStore.$state.data?.university.name }}</span>
          </div>
        </q-card>
      </div> -->
  </section>
</template>
