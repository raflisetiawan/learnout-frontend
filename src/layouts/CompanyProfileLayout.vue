<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black">
      <q-toolbar>

        <q-toolbar-title class="text-black q-ml-md">
          <router-link style="text-decoration: none; color: black;" to="/">Learnout</router-link>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.sm" class="q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <q-btn flat dense>Home</q-btn>
          <q-btn flat dense :to="{ name: 'AllJob' }">Lowongan</q-btn>
          <q-btn flat dense>Kategori</q-btn>
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
