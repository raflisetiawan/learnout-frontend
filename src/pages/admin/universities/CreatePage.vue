<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios'
import LocationSelect from 'src/components/LocationSelect.vue';
import { useSelectLocationStore } from 'src/stores/selectLocation';

interface FormName {
  name: string,
  location: string,
}


// interface errorFormInfo {
//   isError: boolean,
//   message: string
// }

const loading = ref(false);
const router = useRouter();
const selectLocationStore = useSelectLocationStore();

const form = reactive<FormName>({
  name: '',
  location: ''
});

// const errorForm = reactive<errorFormInfo>({
//   isError: false,
//   message: ''
// })

const rules = {
  name: { required, minLength: minLength(3) },
  location: { required, minLength: minLength(3) },
};

const v$ = useVuelidate(rules, form);

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    loading.value = true;
    try {
      await api.post('universities', { name: form.name, location: form.location, regency: selectLocationStore.$state.regency?.name, district: selectLocationStore.$state.district?.name })
      router.push({ name: 'Universities' })
    } catch (error) {
      throw error
    } finally {
      loading.value = false;
    }
  }
};

</script>
<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-8">
        <div class="text-h6 q-mb-lg text-center">Tambah Universitas</div>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled v-model="form.name" label="Nama Universitas *" type="text" :error="v$.name.$error"
            @input="v$.name.$touch" @blur="v$.name.$touch" :error-message="v$.name.$errors.map((e) => e.$message).join()">
          </q-input>
          <LocationSelect />
          <q-input filled autogrow v-model="form.location" label="Alamat Lengkap *" type="text"
            :error="v$.location.$error" @input="v$.location.$touch" @blur="v$.location.$touch"
            :error-message="v$.location.$errors.map((e) => e.$message).join()">
          </q-input>

          <div>
            <q-btn label="Tambah" type="submit" color="primary" :loading="loading"
              :disable="v$?.$invalid || !selectLocationStore.$state.province || !selectLocationStore.$state.regency || !selectLocationStore.$state.district" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
