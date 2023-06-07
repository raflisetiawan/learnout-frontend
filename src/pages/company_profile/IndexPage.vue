<script setup lang="ts">
import HeroSection from 'components/company_profile/HeroSection.vue';
import FeatureSection from 'components/company_profile/FeatureSection.vue';
import ProcessSection from 'components/company_profile/ProcessSection.vue';
import SocialProofSection from 'components/company_profile/SocialProofSection.vue';
import FooterSection from 'components/FooterSection.vue';

</script>


<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black">
      <q-toolbar>

        <q-toolbar-title class="text-black q-ml-md">
          <router-link style="text-decoration: none; color: black;" to="/">Learnout</router-link>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.sm" class="q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <q-btn flat dense>Home</q-btn>
          <q-btn flat dense>Lowongan</q-btn>
          <q-btn flat dense>Kategori</q-btn>
          <q-btn flat dense>Tentang Kami</q-btn>
          <q-btn flat dense>Kontak</q-btn>
          <q-btn :to="{ name: 'SignUp' }" color="primary">Daftar</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <HeroSection />
      <FeatureSection />
      <ProcessSection />
      <SocialProofSection />
      <FooterSection />
    </q-page-container>
  </q-layout>
</template>

