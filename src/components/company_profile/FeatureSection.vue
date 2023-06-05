<template>
  <div class="q-pa-md container justify-center warna-bg-hero">
    <div class="row flex justify-center">
      <template v-for="feature in features" :key="feature.id">
        <div class="col-md-4 col-sm-10 q-mt-lg flex justify-center">
          <q-card class="my-card q-mx-lg">
            <q-img :src="feature.imageUrl" class="feature-image" />

            <q-card-section>
              <div class="text-h6">{{ feature.title }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              {{ feature.description }}
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';

interface Feature {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Kemudahan dalam mencari pekerjaan',
    description: 'Kemudahan dan kecepatan bagi mahasiswa untuk menemukan pekerjaan sesuai kebutuhan dan keinginan',
    imageUrl: '../../assets/img/loop.png'
  },
  {
    id: 2,
    title: 'Fleksibilitas waktu kerja',
    description: 'Mahasiswa dapat memilih jadwal kerja yang fleksibel agar tidak mengganggu kegiatan akademik mereka, dan dapat bekerja pada waktu senggang atau saat libur semester.',
    imageUrl: '../../assets/img/flexible.png'
  },
  {
    id: 3,
    title: 'Daftar pekerjaan di sekitar kampus atau tempat tinggal mahasiswa',
    description: 'Yang dapat memudahkan mahasiswa untuk mencari pekerjaan yang lokasinya dekat dan tidak perlu mengeluarkan biaya transportasi yang besar',
    imageUrl: '../../assets/img/location-person.png'
  }
];

defineComponent({
  data() {
    return {
      features
    };
  }
});
</script>

<style scoped>
.my-card {
  max-width: 300px;
  height: 540px;
}
</style>
