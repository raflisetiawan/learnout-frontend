<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, email } from '@vuelidate/validators';
import { api } from 'src/boot/axios';
import axios from 'axios';
import { useRouter } from 'vue-router';
import LocationSelect from 'components/LocationSelect.vue';
import { useSelectLocationStore } from 'src/stores/selectLocation';
import { useUserStore } from 'stores/user';
import { useRoleStore } from 'src/stores/role';

interface FormInfo {
  name: string,
  description: string,
  location: string,
  phone: number | string,
  email: string,
  website: string | null,
  accept: boolean
}

interface SubmitError {
  isError: boolean,
  message: string
}


const submitError = reactive<SubmitError>({
  isError: false,
  message: ''
})
const roleStore = useRoleStore();
const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const selectLocationStore = useSelectLocationStore();

const formData = reactive<FormInfo>({
  name: '',
  description: '',
  location: '',
  phone: '',
  email: '',
  website: '',
  accept: false
})

const phoneValidation = helpers.regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
const websiteValidation = helpers.regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/);

const rules = {
  name: { required },
  description: { required },
  location: { required },
  phone: { required, phoneValidation: helpers.withMessage('Nomor handphone tidak valid', phoneValidation) },
  email: { required, email },
  website: { required, websiteValidation: helpers.withMessage('Alamat website tidak valid', websiteValidation) },
  accept: { required }
}
const $v = useVuelidate(rules, formData)


const onSubmit = async () => {
  if (!$v.value.$invalid && formData.accept) {
    loading.value = true;
    try {
      await api.post('companies', {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        user_id: userStore.$state.userId,
        regency: selectLocationStore.$state.regency?.name,
        province: selectLocationStore.$state.province?.name,
        district: selectLocationStore.$state.district?.name
      }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      try {
        await api.patch(`users/update_role/${userStore.$state.userId}`);
        roleStore.$state.role = 'company';
        router.push('/')
      } catch (error) {
        throw error;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error('An error occurred.');
    } finally {
      loading.value = false;
    }
  }
}
</script>

<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-7 col-sm-10">
        <q-card class="my-card q-pt-md">
          <div class="text-h6 text-center">Daftar sebagai Pemilik Usaha</div>
          <q-banner inline-actions :class="submitError.isError ? `text-white bg-red` : `text-white bg-red hidden`" rounded
            v-if="submitError.isError">
            {{ submitError.message }}
            <template v-slot:action>
              <q-btn flat dense icon="fa-solid fa-xmark" @click="submitError.isError = false" />
            </template>
          </q-banner>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input filled v-model="formData.name" label="Nama Perusahaan" lazy-rules :error="$v.name.$error"
                :error-message="$v.name.$errors.map((e) => e.$message).join()" @input="$v.name.$touch"
                @blur="$v.name.$touch" />
              <q-input autogrow filled v-model="formData.location" label="Alamat" lazy-rules :error="$v.location.$error"
                :error-message="$v.location.$errors.map((e) => e.$message).join()" @input="$v.location.$touch"
                @blur="$v.location.$touch" />
              <q-input autogrow filled v-model="formData.description" label="Deskripsi Perusahaan" lazy-rules
                :error="$v.description.$error" :error-message="$v.description.$errors.map((e) => e.$message).join()"
                @input="$v.description.$touch" @blur="$v.description.$touch" />
              <q-input type="tel" filled v-model="formData.phone" label="Nomor telephone" lazy-rules
                :error="$v.phone.$error" :error-message="$v.phone.$errors.map((e) => e.$message).join()"
                @input="$v.phone.$touch" @blur="$v.phone.$touch" />
              <q-input type="email" filled v-model="formData.email" label="Email" lazy-rules :error="$v.email.$error"
                :error-message="$v.email.$errors.map((e) => e.$message).join()" @input="$v.email.$touch"
                @blur="$v.email.$touch" />
              <q-input type="text" filled v-model="formData.website" label="Website" lazy-rules :error="$v.website.$error"
                :error-message="$v.website.$errors.map((e) => e.$message).join()" @input="$v.website.$touch"
                @blur="$v.website.$touch" />
              <LocationSelect />

              <q-toggle v-model="formData.accept" label="Saya menerima lisensi dan persyaratan" lazy-rules />

              <div>
                <q-btn label="Daftar" type="submit" color="primary" :loading="loading"
                  :disable="$v?.$invalid || !formData.accept" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
