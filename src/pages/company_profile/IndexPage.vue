<script setup lang="ts">
import HeroSection from 'components/company_profile/HeroSection.vue';
import FeatureSection from 'components/company_profile/FeatureSection.vue';
import ProcessSection from 'components/company_profile/ProcessSection.vue';
import SocialProofSection from 'components/company_profile/SocialProofSection.vue';
import FooterSection from 'components/FooterSection.vue';

</script>


<template>
  <q-layout view="lHh Lpr lFf">


    <q-page-container>
      <HeroSection />
      <q-intersection transition="scale">
        <FeatureSection />
        <ProcessSection />
      </q-intersection>
      <SocialProofSection />
      <FooterSection />
    </q-page-container>
  </q-layout>
</template>

