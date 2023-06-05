<script setup lang="ts">
import WorkAround from 'components/student/WorkAround.vue';
import FilterJob from 'components/student/FilterJob.vue';
import SearchJob from './SearchJob.vue';
import ProcessSection from 'components/company_profile/ProcessSection.vue';
import SocialProofSection from 'components/company_profile/SocialProofSection.vue';
import FooterSection from 'components/FooterSection.vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import AccordingSkill from 'src/components/student/AccordingSkill.vue';

const router = useRouter();

const onItemClick = () => {
  console.log('ok')
}

const signOut = async () => {
  try {
    await api.get('signout');
    localStorage.removeItem('signedIn');
    localStorage.removeItem('token');
    router.push({ name: 'SignIn' });
  } catch (error) {
    throw error;
  }
}
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
          <q-btn-dropdown flat dense rounded>
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar.png">
                </q-avatar>
              </div>
            </template>
            <q-list>
              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label>Photos</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label>Videos</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="signOut()">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="row justify-center">
        <div class="col-md-6">
          <SearchJob />
        </div>
        <div class="col-md-1">
          <FilterJob />
        </div>
      </div>
      <WorkAround />
      <AccordingSkill />
      <ProcessSection />
      <SocialProofSection />
      <FooterSection />
    </q-page-container>
  </q-layout>
</template>

