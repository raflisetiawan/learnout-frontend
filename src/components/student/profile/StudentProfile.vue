<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStudentStore } from 'stores/student';

defineProps(['universityData', 'studentData'])
const router = useRouter();
const studentStore = useStudentStore();

const redirectToHistoryApplicationPage = (studentId: string) => {
  studentStore.$state.studentId = studentId;
  router.push({ name: 'HistoryApplication' });
}

const redirectToCreateResumeStudentPage = (studentId: string) => {
  studentStore.$state.studentId = studentId;
  router.push({ name: 'CreateResumeStudent' })
}

const redirectToStudentDetailPage = (studentId: string) => {
  studentStore.$state.studentId = studentId;
  router.push({
    name: 'StudentDetailProfile', params: {
      id: studentStore.$state.studentId
    }
  })
}
</script>
<template>
  <div class="text-h5 q-mb-md">Informasi Mahasiswa</div>
  <q-card class="my-card" bordered>
    <q-card-section class=" bg-primary text-white">
      <q-card-section class="q-pt-xs">
        <div class="text-h6">{{ studentData.name }}</div>
        <div class="text-subtitle2">{{ universityData.name }}</div>
        <div class=""></div>
      </q-card-section>
    </q-card-section>
    <q-card-section class="q-pt-xs">
      <div class="text-subtitle2">{{ studentData.student_roles.name }}</div>
      <div class="text-overline">{{ studentData.phone }}</div>
      <div class="text-caption text-grey">
        <div>Alamat: {{ studentData.address }}</div>
      </div>
      <div class="q-ml-sm" v-for="category in studentData.categories" :key="category.id">
        <q-badge color="primary" class="q-mr-md q-mt-md">
          {{ category.name }}
        </q-badge>
      </div>
    </q-card-section>


    <q-separator />

    <q-card-actions>
      <q-btn flat color="positive" :to="{ name: 'EditStudent' }">
        Edit Profile Mahasiswa
      </q-btn>
      <q-btn flat color="info" @click="redirectToHistoryApplicationPage(studentData.id)">
        Lihat History Lamaran
      </q-btn>
      <q-btn flat color="info" @click="redirectToCreateResumeStudentPage(studentData.id)">
        Tambahkan Daftar Riwayat Hidup
      </q-btn>
      <q-btn flat color="info" @click="redirectToStudentDetailPage(studentData.id)">
        Detail
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
