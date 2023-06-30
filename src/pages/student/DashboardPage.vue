<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useStudentStore } from 'src/stores/student';
import { ref, watchEffect } from 'vue';
import * as echarts from 'echarts'; // Import ECharts library
import { useRootUrlStore } from 'src/stores/rootUrl';

const studentStore = useStudentStore();
const studentCountApply = ref(0);
const studentRejectCount = ref(0);
const studentPendingCount = ref(0);
const rootUrl = useRootUrlStore();

const getData = async () => {
  try {
    const responseApplyCount = await api.get(`applications/count/${studentStore.$state.data?.student.id}`);
    studentCountApply.value = responseApplyCount.data?.count;
    studentPendingCount.value = responseApplyCount.data?.pendingCount;
    studentRejectCount.value = responseApplyCount.data?.applicationRejectCount;

    // Update the chart with new data
    updateChart(responseApplyCount.data?.applicationsPerDay);
  } catch (error) {
    throw error;
  }
}

watchEffect(async () => {
  if (studentStore.$state.data) {
    await getData();
  }
});

// Create a chart and update it with new data
const updateChart = (applicationsPerDay: any) => {
  const chartContainer = document.getElementById('chart-container');
  if (chartContainer && applicationsPerDay) {
    const chart = echarts.init(chartContainer);

    // Sort the applicationsPerDay object based on the order of week days
    const sortedData = Object.entries(applicationsPerDay)
      .sort(([day1], [day2]) => getDayIndex(day1) - getDayIndex(day2));

    const [weekDays, data] = zip(...sortedData);

    const option = {
      title: {
        text: 'Daftar pekerjaan yang dilamar dalam 1 minggu',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 16,
        },
      },
      xAxis: {
        type: 'category',
        data: weekDays, // Use the sorted week days
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data, // Use the sorted data
          type: 'bar',
        },
      ],
    };

    chart.setOption(option);
  }
};

// Helper function to get the index of the day in a week
const getDayIndex = (day: any) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekDays.indexOf(day);
};

// Helper function to zip arrays
const zip = (...arrays: any[]): any[] => {
  const length = Math.min(...arrays.map((arr: any[]) => arr.length));
  const zippedArray = [];

  for (let i = 0; i < length; i++) {
    const item = arrays.map((arr) => arr[i]);
    zippedArray.push(item);
  }

  return zippedArray;
};

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
                  <q-icon class="items-center full-height full-width vertical-middle" name="rate_review" size="lg"
                    color="orange" />
                </div>
              </div>
              <div class="row text-weight-bold text-body1 full-width justify-center">
                Pekerjaan yang belum di review:
              </div>
              <div class="row text-weight-bold text-h4 full-width justify-center">
                {{ studentPendingCount }}
              </div>
            </q-card>
          </div>
          <div class="col-md-6 col-sm-6 col-xs-6">
            <q-card class="q-pa-md q-ma-md">
              <div class="row q-py-md full-width items-center justify-center">
                <div class="total-sales-box justify-center items-center">
                  <q-icon class="items-center full-height full-width vertical-middle" name="approval" size="lg"
                    color="green" />
                </div>
              </div>
              <div class="row text-weight-bold text-body1 full-width justify-center">
                Jumlah lamaran yang dikirimkan
              </div>
              <div class="row text-weight-bold text-h4 full-width justify-center">
                {{ studentCountApply }}
              </div>
            </q-card>
          </div>
          <div class="col-md-6 col-sm-6 col-xs-6">
            <q-card class="q-pa-md q-ma-md">
              <div class="row q-py-md full-width items-center justify-center">
                <div class="total-sales-box justify-center items-center">
                  <q-icon class="items-center full-height full-width vertical-middle " name="disabled_by_default"
                    size="lg" color="red" />
                </div>
              </div>
              <div class="row text-weight-bold text-body1 full-width justify-center">
                Jumlah lamaran yang di tolak
              </div>
              <div class="row text-weight-bold text-h4 full-width justify-center">
                {{ studentRejectCount }}
              </div>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <q-card v-if="studentStore.$state.data"
          class="q-pa-md q-ma-md float-right full-width right-card-item-2 text-white" style="background-color: #4158D0;
background-image: linear-gradient(43deg, #4158D0 0%, #ff82df 46%, #ffe0ab 100%);
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
      </div>
    </div>
    <div class="row q-pa-md">
      <div class="col-10">
        <div id="chart-container" style="height: 400px;"></div>
      </div>
    </div>
  </section>
</template>
