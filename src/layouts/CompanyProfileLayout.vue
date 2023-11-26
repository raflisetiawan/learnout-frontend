<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black">
      <q-toolbar>

        <q-toolbar-title class="text-black q-ml-md">
          <router-link style="text-decoration: none; color: black;" to="/">Learnout</router-link>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.sm" class="q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <q-btn flat dense>Home</q-btn>
          <q-btn-dropdown flat label="Lowongan">
            <q-list>
              <q-item :to="{ name: 'AllJob' }" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Semua Lowongan</q-item-label>
                </q-item-section>
              </q-item>

              <q-item :to="{ name: 'PartTimePage' }" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Part-time</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Full-time</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Magang</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn flat dense :to="{ name: 'AboutUs' }">Tentang Kami</q-btn>
          <q-btn flat dense>Kontak</q-btn>

          <!-- <q-btn color="primary" :to="{ name: 'SignUp' }">Daftar</q-btn> -->
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">

</script>
