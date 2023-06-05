<template>
  <div class="q-pa-md container">
    <h2 class="text-h5 q-mb-md text-center">Proses Penggunaan</h2>
    <div class="row justify-center">
      <div class="col-md-4 flex justify-center" v-for="step in steps" :key="step.id">
        <q-card class="my-card" style="width: 300px">
          <q-img :src="step.image" />

          <q-card-section>
            <div class="text-h6">{{ step.title }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="step-description">{{ step.description }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const steps = ref([
  {
    id: 1,
    title: 'Mendaftar',
    description: 'Buat akun pengguna untuk mengakses fitur pencarian kerja sampingan dan isi informasi profil Anda, termasuk latar belakang pendidikan dan minat pekerjaan..',
    image: 'assets/img/daftar.png'
  },
  {
    id: 2,
    title: 'Cari pekerjaan',
    description: 'Gunakan fitur pencarian untuk menemukan pekerjaan yang cocok dengan latar belakang pendidikan dan minat Anda.',
    image: 'assets/img/search-job.png'
  },
  {
    id: 3,
    title: 'Lamar pekerjaan',
    description: 'Kirim lamaran Anda untuk pekerjaan yang diminati dan sesuai dengan kriteria Anda, jika diterima, terima penawaran pekerjaan dan mulailah membangun pengalaman kerja yang berharga.',
    image: 'assets/img/apply-job.png'
  },
]);
</script>

<style scoped>
.my-card {
  margin-bottom: 20px;
}

.step-description {
  margin-top: 10px;
}
</style>
