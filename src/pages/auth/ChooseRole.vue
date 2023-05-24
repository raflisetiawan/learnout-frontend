<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
</script>
<template>
  <div class="container">
    <h4 class="text-center q-mx-md">Pilih posisi anda</h4>
    <div class="row flex justify-center items-center">
      <div
        :class="$q.screen.lt.md ? 'col-md-5 col-sm-12 q-mx-md text-center q-mb-lg' : 'col-md-5 col-sm-12 q-mx-md text-center'">
        <q-img src="../../assets/img/student.png" style="max-width: 400px;" />
        <q-btn class="q-mt-lg" color="primary" :to="{ name: 'StudentRegistration' }">Daftar sebagai Mahasiswa</q-btn>
      </div>
      <div class="col-md-5 col-sm-12 q-mx-md text-center">
        <q-img src="../../assets/img/owner.jpg" spinner-color="pink" style="max-width: 400px;" />
        <q-btn class="q-mt-lg" :to="{ name: 'CompanyRegistration' }" color="primary">Daftar sebagai Pemilik Usaha</q-btn>
      </div>
    </div>
  </div>
</template>

<style>
.mahasiswa {
  max-width: 500px;
  margin: 0 25px;
}

@media (max-width: 576px) {
  .choose-role-container {
    height: auto;
    padding: 20px;
  }

  .mahasiswa {
    display: flex;
    flex-direction: column;
    width: 300px;
    justify-content: center;
    margin: auto;
  }
}
</style>
