<script setup lang="ts">
import { ref } from 'vue';

const text = ref();
</script>

<template>
  <div class="hero-container">
    <div class="hero-content">
      <div class="hero-text">
        <h3 class="hero-title">Temukan Peluang Karir Terbaik untuk Mahasiswa</h3>
        <p class="hero-description">Cari pekerjaan yang relevan dengan jurusan Anda dan mulailah membangun pengalaman
          kerja yang berharga. Web app kami menyediakan fitur pencarian yang cerdas dan filter yang membantu Anda
          menemukan pekerjaan yang cocok dengan latar belakang pendidikan dan minat Anda dan filter sesuai tempat kampus
          terdekat anda.</p>
        <div class="row flex-center">
          <div class="col-md-6 col-sm-8">
            <q-input outlined v-model="text" dense class="q-mr-md" label="Cari kerja" />
          </div>
          <div class="col-md-6 col-sm-4">
            <q-btn label="Cari" color="primary" />
          </div>
        </div>
      </div>
      <div class="hero-image">
        <q-img src="../../assets/img/hero.png" alt="Gambar Hero" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100vh;
}

.hero-content {
  display: flex;
  align-items: center;
  width: 90%;
  margin: 0 auto;
}

.hero-text {
  flex: 1;
  padding: 20px;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 20px;
}


@media (min-width: 768px) {
  .hero-content {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }

  .hero-text {
    padding: 20px;
    text-align: left;
  }

  .hero-image {
    margin-top: 0;
    margin-left: 20px;
  }
}

@media (max-width: 767px) {
  .hero-content {
    flex-direction: column;
    align-items: center;
  }

  .hero-text {
    padding: 20px;
    text-align: center;
  }

  .hero-image {
    margin-top: 0;
    margin-bottom: 20px;
  }
}
</style>
