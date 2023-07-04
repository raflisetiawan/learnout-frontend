<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useCompanyStore } from 'src/stores/company';
import { useUserStore } from 'src/stores/user';
import { onMounted, ref } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs';

interface Application {
  date: [];
  count: [];
}

interface Jobs {
  job_id: number;
  job_title: string;
  application: Application
}

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const companyStore = useCompanyStore();
const loaded = ref(false);
const closedJob = ref(0);
const openJob = ref(0);
const allJobCount = ref(0);
const userStore = useUserStore();
const jobsPerDay = ref<Jobs[]>([]);

const mountData = async () => {
  if (companyStore.$state.companyId !== 0) {
    try {
      const getClosedJob = await api.get(`companies/closed-job-count/${companyStore.$state.companyId}`)
      closedJob.value = getClosedJob.data.closedJobCount;
      const getOpenJob = await api.get(`companies/open-job-count/${companyStore.$state.companyId}`)
      openJob.value = getOpenJob.data.openJobCount;
      const getAllJobCount = await api.get(`companies/all-count/${companyStore.$state.companyId}`)
      allJobCount.value = getAllJobCount.data.allCount;
      const getJobByCompanyId = await api.get(`/companies/get-job-applications-per-day/${companyStore.$state.companyId}`);
      jobsPerDay.value = getJobByCompanyId.data.jobApplications;
      console.log(jobsPerDay.value);
      loaded.value = true
    } catch (error) {
      throw error;
    }
  } else {
    try {
      const getCompany = await api(`/companies/getOneCompanyByUserId/${userStore.$state.userId}`)
      companyStore.$state.companyId = getCompany.data.company.id;
      const getClosedJob = await api.get(`companies/closed-job-count/${companyStore.$state.companyId}`)
      closedJob.value = getClosedJob.data.closedJobCount;
      const getOpenJob = await api.get(`companies/open-job-count/${companyStore.$state.companyId}`)
      openJob.value = getOpenJob.data.openJobCount;
      const getAllJobCount = await api.get(`companies/all-count/${companyStore.$state.companyId}`)
      allJobCount.value = getAllJobCount.data.allCount;
      const getJobByCompanyId = await api.get(`/companies/get-job-applications-per-day/${companyStore.$state.companyId}`);
      jobsPerDay.value = getJobByCompanyId.data.jobApplications;
      loaded.value = true;
      console.log(jobsPerDay.value);
    } catch (error) {
      throw error;
    }
  }
}



const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});



onMounted(async () => {
  await mountData()
})

</script>
<template>
  <section id="dashboard-student">
    <div class="row q-pa-md">
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-xs-6">
            <q-card class="q-pa-md q-mr-md q-ma-md">
              <div class="row q-py-md full-width items-center justify-center">
                <div class="total-sales-box justify-center items-center">
                  <q-icon class="items-center full-height full-width vertical-middle" name="cancel" size="lg"
                    color="red" />
                </div>
              </div>
              <div class="row text-weight-bold text-body1 full-width justify-center">
                Pekerjaan yang di tutup:
              </div>
              <div class="row text-weight-bold text-h4 full-width justify-center">
                {{ closedJob }}
              </div>
            </q-card>
          </div>
          <div class="col-md-6 col-sm-6 col-xs-6">
            <q-card class="q-pa-md q-ma-md">
              <div class="row q-py-md full-width items-center justify-center">
                <div class="total-sales-box justify-center items-center">
                  <q-icon class="items-center full-height full-width vertical-middle" name="fa-solid fa-door-open"
                    size="lg" color="green" />
                </div>
              </div>
              <div class="row text-weight-bold text-body1 full-width justify-center">
                Pekerjaan yang di buka
              </div>
              <div class="row text-weight-bold text-h4 full-width justify-center">
                {{ openJob }}
              </div>
            </q-card>
          </div>
          <div class="col-md-6 col-sm-6 col-xs-6">
            <q-card class="q-pa-md q-ma-md">
              <div class="row q-py-md full-width items-center justify-center">
                <div class="total-sales-box justify-center items-center">
                  <q-icon class="items-center full-height full-width vertical-middle " name="menu_open" size="lg"
                    color="blue" />
                </div>
              </div>
              <div class="row text-weight-bold text-body1 full-width justify-center">
                Jumlah pekerjaan yang di posting
              </div>
              <div class="row text-weight-bold text-h4 full-width justify-center">
                {{ allJobCount }}
              </div>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <q-card v-if="companyStore.$state.data"
          class="q-pa-md q-ma-md float-right full-width right-card-item-2 text-white" style="background-color: #4158D0;
background-image: linear-gradient(43deg, #4158D0 0%, #ff82df 46%, #ffe0ab 100%);
">
          <div class="row col-12 full-width items-center">
            <div class="col-5">
              <q-avatar size="70px">
                <img :src="companyStore.$state.data?.user?.image ?? ''" />
              </q-avatar>
            </div>
          </div>
          <div class="row col-12 q-mt-lg text-capitalize text-weight-bold" style="font-size: 1.5em;">{{
            companyStore.$state.data?.user.name }}
          </div>
          <div class="row col-12 q-mt-xs text-weight-bold">
            Email : {{ companyStore.$state.data?.user.email }}
          </div>
        </q-card>
      </div>
    </div>
    <div class="text-h5 q-ma-md">Daftar Statistik Pekerjaan</div>
    <q-list bordered class="rounded-borders q-ma-md">
      <template v-for="job in jobsPerDay" :key="job.id">
        <q-expansion-item expand-separator :label="job.job_title">
          <q-card>
            <q-card-section>
              <Bar v-if="loaded"
                :data="{ labels: job.application.date, datasets: [{ data: job.application.count, label: 'Jumlah Pelamar', backgroundColor: 'rgb(227,93,106)' }] }"
                :options="chartOptions">
              </Bar>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </template>
    </q-list>
    <div class="row q-pa-md">
      <div class="col-10">
        <div id="chart-container" style="height: 400px;"></div>
      </div>
    </div>
  </section>
</template>
