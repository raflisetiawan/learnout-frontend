<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { useRoleStore } from 'stores/role';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user';
import isAuthenticated from 'src/utils/isAuthenticated';

const router = useRouter();
const userStore = useUserStore();
const roleStore = useRoleStore();
const $q = useQuasar();

const onItemClick = () => {
  console.log('ok')
}

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

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleImageError = () => {
  userStore.$state.userImage += '/user.png';
}


</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" bordered v-if="isAuthenticated()">
      <q-toolbar>

        <q-btn v-if="$q.screen.lt.md" flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" />

        <q-toolbar-title class="text-black q-ml-md">
          <router-link style="text-decoration: none; color: black;" to="/">Learnout</router-link>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.sm" class="q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <q-btn flat dense>Home</q-btn>
          <q-btn flat dense :to="{ name: 'AllJob' }">Lowongan</q-btn>
          <q-btn flat dense>Kategori</q-btn>
          <q-btn flat dense>Tentang Kami</q-btn>
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
              <q-item clickable v-close-popup :to="{ name: 'MyProfile' }">
                <q-item-section>
                  <q-item-label>My Profile</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onItemClick" v-if="roleStore.$state.role === 'company'"
                :to="{ name: 'Company' }">
                <q-item-section>
                  <q-item-label>Beranda Company</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onItemClick" v-if="roleStore.$state.role === 'admin'"
                :to="{ name: 'Admin' }">
                <q-item-section>
                  <q-item-label>Beranda Admin</q-item-label>
                </q-item-section>
              </q-item>
              <!-- <q-item clickable v-close-popup @click="onItemClick" v-if="roleStore.$state.role === 'user'" :to="{name: 'Admin'}">
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

      <q-drawer v-model="leftDrawerOpen" bordered>
        <q-list>
          <q-item-label header>Learnout</q-item-label>
          <q-item clickable :to="{ name: 'Home' }">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-house" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Home</q-item-label>
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
          <q-item clickable :to="{ name: 'Company' }" v-if="roleStore.$state.role === 'company'">
            <q-item-section avatar>
              <q-icon name="apartment" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Beranda Perusahaan</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :to="{ name: 'Admin' }" v-if="roleStore.$state.role === 'admin'">
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Beranda Admin</q-item-label>
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
      </q-drawer>

    </q-header>
    <q-header class="bg-white text-black" v-else bordered>
      <q-toolbar>

        <q-toolbar-title class="text-black q-ml-md">
          <router-link style="text-decoration: none; color: black;" to="/">Learnout</router-link>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.sm" class="q-ml-xs q-gutter-md text-body2 text-weight-bold row items-center no-wrap">
          <q-btn flat dense>Home</q-btn>
          <q-btn flat dense>Lowongan</q-btn>
          <q-btn flat dense>Kategori</q-btn>
          <q-btn flat dense>Tentang Kami</q-btn>
          <q-btn flat dense :to="{ name: 'ContactPage' }">Kontak</q-btn>
          <q-btn :to="{ name: 'SignUp' }" color="primary">Daftar</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view>
      </router-view>
      <!-- <div class="row justify-center">
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
      <FooterSection /> -->
    </q-page-container>
  </q-layout>
</template>

