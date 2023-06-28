<script setup async lang="ts">
import { ref } from 'vue';
import { UserInfo, CompanyInfo, StudentInfo } from 'components/models';
import formatDate from '../../../utils/formatDate';
import { api } from 'src/boot/axios';
import { useRoleStore } from 'src/stores/role';
import { UniversitiesInfo } from 'components/models';
import { useUserStore } from 'src/stores/user';
import StudentProfile from './StudentProfile.vue';


const userStore = useUserStore();
const roleStore = useRoleStore();
const showEditDialog = ref(false);
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
  regency: '',
  province: ''
})

const getData = async () => {
  if (roleStore.$state.role === 'company') {
    try {
      const response = await api.get(`/users/getUserAndCompanyByUserId/${userStore.$state.userId}`);
      userData.value = { ...userData.value, ...response.data.user }
      companyData.value = { ...companyData.value, ...response.data.data };
    } catch (error) {
      throw error
    }
  } else if (roleStore.$state.role === 'user') {
    try {
      const response = await api.get(`/users/getUserAndStudentByUserId/${userStore.$state.userId}`);
      userData.value = { ...userData.value, ...response.data.user }
      studentData.value = { ...studentData.value, ...response.data.student };
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
}

await getData();

const loadingUpdate = ref(false);


interface UpdateForm {
  name: string;
  image: string[] | File[] | FileList | null | undefined;
}

const updateForm = ref<UpdateForm>({
  name: '',
  image: null
})

const onUpdateProfile = async () => {
  loadingUpdate.value = true;
  try {
    const response = await api.post(`/users/updateImageAndName/${userData.value.id}`, { name: updateForm.value.name, image: updateForm.value.image, _method: 'PATCH' }, {
      headers: { 'content-type': 'multipart/form-data' }
    });
    await getData();
    userStore.$state.userImage = response.data.image;
  } catch (error) {
    throw error;
  } finally {
    loadingUpdate.value = false;
    showEditDialog.value = false;
    updateForm.value = { name: '', image: null };
  }
}

const handleImageError = () => {
  userData.value.image += '/user.png';
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
              <q-avatar size="100px" v-if="userData.image !== null">
                <q-img :src="userData.image" @error="handleImageError" />
              </q-avatar>
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat color="positive" @click="showEditDialog = true">
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
        <StudentProfile :studentData="studentData" :universityData="universityData" />
      </div>
    </div>

    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 350px">
        <q-form @submit="onUpdateProfile" enctype="multipart/form-data">
          <q-card-section>
            <div class="text-h6">Edit User Profile</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input label="Nama user" dense v-model="updateForm.name" autofocus class="q-mb-md"
              :rules="[val => val && val.length > 0 || 'Please type something']" />
            <q-file dense outlined v-model="updateForm.image" label="Edit gambar profile"
              accept=".png, .jpg, .jfif, image/jpeg">
              <template v-slot:prepend>
                <q-icon name="photo_camera" />
              </template>
            </q-file>

          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Edit" type="submit" :loading="loadingUpdate" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>


