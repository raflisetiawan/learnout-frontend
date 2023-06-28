<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import { useRouter, useRoute } from 'vue-router';
import { api } from 'boot/axios'
import LocationSelect from 'src/components/LocationSelect.vue';
import { useSelectLocationStore } from 'src/stores/selectLocation';
import { UniversitiesInfo } from 'src/components/models';

interface FormName {
  name: string | undefined,
  location: string | undefined,
}


const loading = ref(false);
const router = useRouter();
const route = useRoute();
const selectLocationStore = useSelectLocationStore();
let university = reactive<UniversitiesInfo>({
  district: '',
  id: 0,
  location: '',
  name: '',
  province: '',
  regency: ''
});

onBeforeMount(async () => {
  const response = await api.get(`universities/${route.params.id}`)
  university = response.data.data;
  form.name = university?.name;
  form.location = university?.location;

  selectLocationStore.$state.province = {
    id: 0,
    name: university.province,
    value: 0,
    label: university.province,
  };
  selectLocationStore.$state.district = {
    id: 0,
    name: university.district,
    value: 0,
    label: university.district,
  };
  selectLocationStore.$state.regency = {
    id: 0,
    name: university.regency,
    value: 0,
    label: university.regency,
  };
})

const form = reactive<FormName>({
  name: '',
  location: ''
});


const rules = {
  name: { required, minLength: minLength(3) },
  location: { required, minLength: minLength(3) },
};

const v$ = useVuelidate(rules, form);

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    loading.value = true;
    try {
      await api.patch(`universities/${route.params.id}`, { name: form.name, location: form.location, province: selectLocationStore.$state.province?.name, regency: selectLocationStore.$state.regency?.name, district: selectLocationStore.$state.district?.name })
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
        <div class="text-h6 q-mb-lg text-center">Edit Universitas</div>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled v-model="form.name" label="Nama Universitas *" type="text" :error="v$.name.$error"
            @input="v$.name.$touch" @blur="v$.name.$touch" :error-message="v$.name.$errors.map((e) => e.$message).join()">
            <template v-slot:hint>
              <p>Kota / Kabupaten: {{ university?.regency }}</p>
              <p>Kecamatan: {{ university?.district }}</p>
              <p>Klik provinsi jika ingin mengubah tempat</p>
            </template>
          </q-input>
          <div class="q-py-lg "></div>
          <LocationSelect :isEdit="true" />
          <q-input filled autogrow v-model="form.location" label="Alamat Lengkap *" type="text"
            :error="v$.location.$error" @input="v$.location.$touch" @blur="v$.location.$touch"
            :error-message="v$.location.$errors.map((e) => e.$message).join()">
          </q-input>

          <div>
            <q-btn label="Edit" type="submit" color="primary" :loading="loading" :disable="v$?.$invalid" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
