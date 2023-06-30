<script setup>
import FooterSection from 'src/components/FooterSection.vue';


</script>
<template>
  <section id="about-us">
    <div class="q-pa-md">
      <div class="row justify-center">
        <div class="col-md-10 col-sm-12 col-xs-12">
          <q-img src="../assets/img/about-us.jpg" spinner-color="white" :ratio="16 / 9" class="text-center" fit="cover"
            height="450px" />
        </div>
      </div>
      <div class="row justify-center q-mt-lg">
        <div class="col-md-4">
          <div class="text-h4 text-center">TENTANG KAMI</div>
          <q-separator color="primary"></q-separator>
        </div>
      </div>
      <div class="row q-ml-lg">
        <div class="col-md-8 col-sm-10 col-xs-12">
          <div class="text-h6"> Selamat datang di Learnout</div>
          <div class="text-body1"> Kami adalah tim yang berdedikasi untuk menyediakan informasi dan peluang pekerjaan
            sambilan yang cocok untuk mahasiswa. Kami percaya bahwa pekerjaan sambilan dapat menjadi pengalaman berharga
            bagi mahasiswa dalam mengembangkan keterampilan, memperluas jaringan, dan mendapatkan penghasilan tambahan.
            Visi kami adalah menyediakan platform yang memudahkan mahasiswa untuk menemukan pekerjaan sambilan yang sesuai
            dengan minat, kemampuan, dan jadwal mereka. Kami berkomitmen untuk menghubungkan mahasiswa dengan peluang
            pekerjaan yang fleksibel dan relevan.


            Kami menghargai umpan balik dan masukan dari pengguna kami. Jika Anda memiliki saran, pertanyaan, atau ingin
            berbagi pengalaman tentang pekerjaan sambilan, jangan ragu untuk menghubungi kami melalui halaman "Kontak".
          </div>
        </div>
      </div>
    </div>
    <q-separator></q-separator>
    <FooterSection />
  </section>
</template>
