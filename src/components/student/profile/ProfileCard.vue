<script setup async lang="ts">
import { ref } from 'vue';
import { UserInfo, CompanyInfo, StudentInfo } from 'components/models';
import formatDate from '../../../utils/formatDate';
import { api } from 'src/boot/axios';
import { useRoleStore } from 'src/stores/role';
import { UniversitiesInfo } from 'components/models';
import { useUserStore } from 'src/stores/user';


const userStore = useUserStore();
const roleStore = useRoleStore();
const userData = ref<UserInfo>({
  id: 0,
  createdAt: new Date(),
  email: '',
  emailVerifiedAt: '',
  name: '',
  password: '',
  rememberToken: '',
  role: '',
  updatedAt: new Date(),
  image: ''
});

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

const studentData = ref<StudentInfo>({
  id: 0,
  userId: 0,
  address: '',
  created_at: new Date(),
  district: '',
  name: '',
  phone: '',
  regency: '',
  university_id: 0,
  updated_at: new Date()
})

const universityData = ref<UniversitiesInfo>({
  id: 0,
  district: '',
  location: '',
  name: '',
  regency: ''
})

try {
  const response = await api(`users/${userStore.$state.userId}`);
  userData.value = { ...userData.value, ...response.data.data };
} catch (error) {
  throw (error);
}

if (roleStore.$state.role === 'company') {
  try {
    const response = await api.get(`companies/${userData.value.id}`);
    companyData.value = { ...companyData.value, ...response.data.data };
  } catch (error) {
    throw error
  }
} else if (roleStore.$state.role === 'user') {
  try {
    const response = await api.get(`students/${userData.value.id}`);
    studentData.value = { ...studentData.value, ...response.data.data };
    try {
      const response = await api.get(`universities/${studentData.value.university_id}`);
      universityData.value = { ...universityData.value, ...response.data.data };
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error
  }
}


</script>
<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-md-5">
        <div class="text-h5 q-mb-md">Informasi User</div>
        <q-card class="my-card" flat bordered>
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-overline" v-if="userData.role === 'company'">Company</div>
              <div class="text-overline" v-if="userData.role === 'user'">Mahasiswa</div>
              <div class="text-overline" v-if="userData.role === 'admin'">Admin</div>
              <div class="text-h5 q-mt-sm q-mb-xs">{{ userData.name }}</div>
              <p>{{ userData.email }}</p>
              <div class="text-caption text-grey">
                Dibuat tanggal {{ formatDate(userData.createdAt) }}
              </div>
            </q-card-section>

            <q-card-section class="col-5 flex flex-center">
              <!-- v-if="userData.image" -->
              <q-avatar size="100px">
                <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />
              </q-avatar>
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat color="positive">
              Edit Profile User
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-5 q-ml-md" v-if="roleStore.$state.role === 'company'">
        <div class="text-h5 q-mb-md">Informasi Perusahaan</div>
        <q-card class="my-card" flat bordered>
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-overline">{{ companyData.email }}</div>
              <div class="text-h5 q-mt-sm q-mb-xs">{{ companyData.name }}</div>
              <p>{{ companyData.location }}</p>
              <p>{{ companyData.website }}</p>
              <p>{{ companyData.phone }}</p>
              <div class="text-caption text-grey">
                <div>Deskripsi</div>
                {{ companyData.description }}
              </div>
            </q-card-section>

          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat color="positive">
              Edit Profile Perusahaan
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-5 q-ml-md" v-if="roleStore.$state.role === 'user'">
        <div class="text-h5 q-mb-md">Informasi Mahasiswa</div>
        <q-card class="my-card" flat bordered>
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-overline">{{ studentData.name }}</div>
              <p>{{ universityData.name }}</p>
              <p>{{ studentData.phone }}</p>
              <div class="text-caption text-grey">
                <div>Alamat</div>
                {{ studentData.address }}
              </div>
            </q-card-section>

          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat color="positive">
              Edit Profile Mahasiswa
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>


