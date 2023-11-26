<script setup lang="ts">
import { api, storageBaseUrl } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user';
import { CompanyInfo } from 'src/components/models';
import { useCompanyStore } from 'src/stores/company';
import { useRoleStore } from 'src/stores/role';

const router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
const companyStore = useCompanyStore();
const roleStore = useRoleStore();

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
    const response = await api.get(`/users/getUserAndCompanyByUserId/${userStore.$state.userId}`);
    companyStore.$state.data.user = response.data.user;
    companyStore.$state.data.company = response.data.company;
    companyData.value = { ...companyData.value, ...response.data.data };
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

const handleImageError = () => {
  userStore.$state.userImage += '/user.png';
}

const leftDrawerOpen = ref(true);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleErrorImage = () => {
  companyStore.$state.data.user.image = `${storageBaseUrl}/users/images/user.png`;
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
          <q-btn flat dense :to="{ name: 'Home' }">Home</q-btn>
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

              <q-item clickable v-close-popup :to="{ name: 'FullTimePage' }">
                <q-item-section>
                  <q-item-label>Full-time</q-item-label>
                </q-item-section>
              </q-item>
              <q-item :to="{ name: 'ApprenticeshipPage' }" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Magang</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn flat dense>Kategori</q-btn>
          <q-btn flat dense :to="{ name: 'AboutUs' }">Tentang Kami</q-btn>
          <q-btn flat dense to="/contact">Kontak</q-btn>
          <q-btn-dropdown flat dense rounded>
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-avatar>
                  <img :src="userStore.$state.userImage" v-if="userStore.$state.userId !== ''" @error="handleImageError">
                </q-avatar>
              </div>
            </template>
            <q-list>
              <q-item clickable v-close-popup v-if="roleStore.$state.role === 'company'"
                :to="{ name: 'MyProfileCompany' }">
                <q-item-section>
                  <q-item-label>My Profile</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-else-if="roleStore.$state.role === 'admin'"
                :to="{ name: 'MyProfileAdmin' }">
                <q-item-section>
                  <q-item-label>My Profile</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-else :to="{ name: 'MyProfile' }">
                <q-item-section>
                  <q-item-label>My Profile</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup v-if="roleStore.$state.role === 'company'" :to="{ name: 'Company' }">
                <q-item-section>
                  <q-item-label>Beranda Company</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="roleStore.$state.role === 'admin'" :to="{ name: 'Admin' }">
                <q-item-section>
                  <q-item-label>Beranda Admin</q-item-label>
                </q-item-section>
              </q-item>
              <!-- <q-item clickable v-close-popup v-if="roleStore.$state.role === 'user'" :to="{name: 'Admin'}">
                <q-item-section>
                  <q-item-label>Beranda Company</q-item-label>
                </q-item-section>
              </q-item> -->

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
            <q-item clickable :to="{ name: 'Company' }">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dashboard</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'MyProfileCompany' }">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-user" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Profil Saya</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'ListJob' }">
              <q-item-section avatar>
                <q-icon name="list_alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>List Pekerjaan</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'HistoryJobCompany' }">
              <q-item-section avatar>
                <q-icon name="work_history" />
              </q-item-section>
              <q-item-section>
                <q-item-label>History Semua Pekerjaan</q-item-label>
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
              <img class="rounded-borders" :src="companyStore.$state.data?.user?.image ?? ''"
                @error="handleErrorImage()" />
            </q-avatar>
            <div class="text-weight-bold">{{ companyStore.$state.data?.user?.name }}</div>
            <div>{{ companyStore.$state.data?.user?.email }}</div>
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
