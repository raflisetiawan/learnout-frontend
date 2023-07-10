<script setup lang="ts">
import { api, storageBaseUrl } from 'src/boot/axios';
import { useUserStore } from 'src/stores/user';
import { useRoleStore } from 'stores/role';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from 'stores/admin'
const roleStore = useRoleStore();
const userStore = useUserStore();
const router = useRouter();
const adminStore = useAdminStore()


const getData = async () => {
  try {
    const response = await api.get(`/users/${userStore.$state.userId}`);
    adminStore.$state.data.user = response.data.data;
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

const handleErrorImage = () => {
  adminStore.$state.data.user.image = `${storageBaseUrl}/users/images/user.png`;
}

</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" elevated>
      <q-toolbar>
        <q-btn v-if="$q.screen.lt.md" flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" />
        <q-toolbar-title class="text-black q-ml-md">
          <router-link v-if="roleStore.$state.role === 'company'" style="text-decoration: none; color: black;"
            :to="{ name: 'Company' }">Company </router-link>
          <router-link style="text-decoration: none; color: black;" v-if="roleStore.$state.role === 'admin'"
            :to="{ name: 'Admin' }">Admin </router-link>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.sm" class="q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <q-btn flat dense to="/admin">Home</q-btn>
          <q-btn flat dense :to="{ name: 'AllJob' }">Lowongan</q-btn>
          <q-btn flat dense>Kategori</q-btn>
          <q-btn flat dense :to="{ name: 'AboutUs' }">Tentang Kami</q-btn>
          <q-btn flat dense :to="{ name: 'ContactPage' }">Kontak</q-btn>
          <!-- <q-btn color="primary" :to="{ name: 'SignUp' }">Daftar</q-btn> -->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable :to="{ name: 'Admin' }">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'MyProfileAdmin' }">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-user" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Profil Saya</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'Universities' }">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-building-columns" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Manage Universitas</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'Categories' }">
            <q-item-section avatar>
              <q-icon name="category" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Manage Category</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'AdminContact' }">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-address-book" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Manage Contact</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'JobReport' }">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-file-pen" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Laporan Pekerjaan</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'ApplicationReport' }">
            <q-item-section avatar>
              <q-icon name="fact_check" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Laporan Lamaran</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'AboutUs' }">
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Tentang Kami</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'ContactPage' }">
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
            <img class="rounded-borders" :src="adminStore.$state.data?.user?.image ?? ''" @error="handleErrorImage()" />
          </q-avatar>
          <div class="text-weight-bold">{{ adminStore.$state.data?.user?.name }}</div>
          <div>{{ adminStore.$state.data?.user?.email }}</div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

