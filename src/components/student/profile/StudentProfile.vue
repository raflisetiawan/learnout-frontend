<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStudentStore } from 'stores/student';

defineProps(['universityData', 'studentData']);
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
  <q-card class="my-card" flat bordered>
    <q-card-section horizontal>
      <q-card-section class="q-pt-xs">
        <div class="text-overline">{{ studentData.name }}</div>
        <p>{{ universityData.name }}</p>
        <p>{{ studentData.phone }}</p>
        <div class="text-caption text-grey">
          <div>Alamat</div>
          {{ studentData.address }}
        </div>
      </q-card-section>

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
        Tambahkan Daftar Riwayat Hidup
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
