<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { useStudentStore } from 'stores/student';
import { useRoleStore } from 'stores/role';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user';
import { CompanyInfo } from 'src/components/models';

const router = useRouter();
const userStore = useUserStore();
const roleStore = useRoleStore();
const $q = useQuasar();
const studentStore = useStudentStore();

const companyData = ref<CompanyInfo>({
  id: 0,
  userId: 0,
  name: '',
  description: '',
  location: '',
  website: '',
  email: '',
  phone: '',
  regency: '',
  district: '',
  createdAt: new Date(),
  updatedAt: new Date()
})


const getData = async () => {
  try {
    const response = await api.get(`/users/getUserAndStudentByUserId/${userStore.$state.userId}`);
    studentStore.$state.data.student = response.data.student;
    studentStore.$state.data.user = response.data.user;
    try {
      const response = await api.get(`universities/${studentStore.$state.data.student.university_id}`);
      studentStore.$state.data.university = response.data.data;
      // console.log(response)
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error
  }
}

onMounted(async () => {
  await getData();
})

const signOut = async () => {
  try {
    await api.get('signout');
    localStorage.removeItem('signedIn');
    localStorage.removeItem('token');
    userStore.$state.userId = '';
    router.push({ name: 'SignIn' });
  } catch (error) {
    throw error;
  }
}

const leftDrawerOpen = ref(true);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleImageError = () => {
  userStore.$state.userImage += '/user.png';
}


</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" bordered>
      <q-toolbar>

        <q-btn v-if="$q.screen.lt.md" flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" />

        <q-toolbar-title class="text-black q-ml-md">
          <router-link style="text-decoration: none; color: black;" to="/">Learnout</router-link>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.sm" class="q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <q-btn flat dense>Home</q-btn>
          <q-btn flat dense :to="{ name: 'AllJob' }">Lowongan</q-btn>
          <q-btn flat dense>Kategori</q-btn>
          <q-btn flat dense :to="{ name: 'AboutUs' }">Tentang Kami</q-btn>
          <q-btn flat dense to="/contact">Kontak</q-btn>
          <q-btn-dropdown flat dense rounded>
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-avatar>
                  <img :src="userStore.$state.userImage" @error="handleImageError()">
                </q-avatar>
              </div>
            </template>
            <q-list>
              <q-item clickable v-close-popup :to="{ name: 'MyProfile' }">
                <q-item-section>
                  <q-item-label>My Profile</q-item-label>
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

      <q-drawer v-model="leftDrawerOpen" side="left" bordered>
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item clickable :to="{ name: 'StudentDashboard' }">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dashboard</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'MyProfile' }">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-user" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Profil Saya</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'HistoryApplication' }">
              <q-item-section avatar>
                <q-icon name="list" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Riwayat Lamaran</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'Home' }">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-house" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Home</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'AllJob' }">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-list" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Lowongan</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable target="_blank" rel="noopener" href="http://chat.quasar.dev">
              <q-item-section avatar>
                <q-icon name="category" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Kategori</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable target="_blank" rel="noopener" href="https://forum.quasar.dev">
              <q-item-section avatar>
                <q-icon name="info" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Tentang Kami</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable target="_blank" rel="noopener" href="https://twitter.quasar.dev">
              <q-item-section avatar>
                <q-icon name="contacts" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Kontak Kami</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="signOut">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <div class="absolute-top"
          style="height: 150px ;background: radial-gradient(circle at 7.5% 24%, rgb(237, 161, 193) 0%, rgb(250, 178, 172) 25.5%, rgb(190, 228, 210) 62.3%, rgb(215, 248, 247) 93.8%);">
          <div class="absolute-bottom bg-transparent q-ml-md q-mb-md">
            <q-avatar size="56px" class="q-mb-sm">
              <img class="rounded-borders" :src="userStore.$state.userImage" />
            </q-avatar>
            <div class="text-weight-bold">{{ studentStore.$state.data?.user?.name }}</div>
            <div>{{ studentStore.$state.data?.user?.email }}</div>
          </div>
        </div>
      </q-drawer>

    </q-header>

    <q-page-container>
      <router-view>
      </router-view>
    </q-page-container>
  </q-layout>
</template>
