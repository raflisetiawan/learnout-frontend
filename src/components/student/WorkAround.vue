<script setup lang="ts">
import { ref } from 'vue';

const activities = ref([
  {
    id: 1,
    title: 'Pekerjaan Baru Ditambahkan',
    date: '20 Mei 2023',
    userAvatar: '/path/to/user-avatar.png'
  },
  {
    id: 2,
    title: 'Postingan Terbaru',
    date: '18 Mei 2023',
    userAvatar: '/path/to/user-avatar.png'
  },
  // Tambahkan aktivitas lainnya sesuai kebutuhan Anda
])
</script>

<template>
  <section class="activity-section">
    <div class="q-pa-md">
      <div class="text-h4 section-title">Lowongan di sekitar anda</div>

      <q-list bordered separator>
        <q-item clickable v-ripple v-for="activity in activities" :key="activity.id">
          <q-item-section>
            <q-item-label class="text-h6">{{ activity.title }}</q-item-label>
            <q-item-label>{{ activity.title }}</q-item-label>
            <q-item-label caption>{{ activity.date }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-avatar>
              <img :src="activity.userAvatar" alt="User Avatar">
            </q-avatar>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </section>
</template>
