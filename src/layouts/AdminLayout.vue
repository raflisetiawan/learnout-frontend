<script setup lang="ts">
import { useRoleStore } from 'stores/role';
const roleStore = useRoleStore()
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black">
      <q-toolbar>

        <q-toolbar-title class="text-black q-ml-md">
          <router-link v-if="roleStore.$state.role === 'company'" style="text-decoration: none; color: black;"
            :to="{ name: 'Company' }">Company </router-link>
          <router-link style="text-decoration: none; color: black;" v-if="roleStore.$state.role === 'admin'"
            :to="{ name: 'Admin' }">Admin </router-link>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.sm" class="q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <q-btn flat dense to="/">Home</q-btn>
          <!-- <q-btn flat dense>Lowongan</q-btn>
          <q-btn flat dense>Kategori</q-btn>
          <q-btn flat dense>Tentang Kami</q-btn>
          <q-btn flat dense>Kontak</q-btn> -->
          <!-- <q-btn color="primary" :to="{ name: 'SignUp' }">Daftar</q-btn> -->
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

