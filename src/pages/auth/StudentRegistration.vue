<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { api } from 'src/boot/axios';
import axios from 'axios';
import getUser from 'src/utils/getUser';
import { useRouter } from 'vue-router';
import LocationSelect from 'components/LocationSelect.vue';
import { useSelectLocationStore } from 'stores/selectLocation';

interface FormInfo {
  fullName: string,
  address: string,
  phone: number | string,
  university: UniversityInfo,
  category: CategoryInfo[],
  accept: boolean
}

interface SubmitError {
  isError: boolean,
  message: string
}
interface SelectError {
  isError: boolean,
  message: string
}

interface UniversityInfo {
  id: number,
  name: string
  location: string,
  value: number,
  label: string
}
interface CategoryInfo {
  id: number,
  name: string,
  value: number,
  label: string
}

const universities = reactive<UniversityInfo[]>([]);
const categories = reactive<CategoryInfo[]>([]);
const selectLocationStore = useSelectLocationStore();
const submitError = reactive<SubmitError>({
  isError: false,
  message: ''
})
const selectError = reactive<SelectError>({
  isError: false,
  message: ''
})

const router = useRouter();
const loading = ref(false);
const loadingSelect = ref(false);
const loadingSelectCategory = ref(false);
const loadUser = ref(true);
const user = ref();
onMounted(async () => {
  user.value = await getUser(localStorage.getItem('token'));
  loadingSelectCategory.value = true;
  loadingSelect.value = true;
  try {
    const response = await api.get('universities');

    let data = [];
    data.push(...response.data.data)
    data.map((university) => {
      universities.push({
        name: university.name,
        id: university.id,
        location: university.location,
        value: university.id,
        label: university.name
      })
    })
    try {
      const response = await api.get('categories');
      let data = [];
      data.push(...response.data.data);
      data.map((category) => {
        categories.push({
          id: category.id,
          name: category.name,
          label: category.name,
          value: category.id
        });
      })
    } catch (error) {
      throw error
    } finally {
      loadingSelectCategory.value = false;
      loadingSelect.value = false;
      loadUser.value = false;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      error.response.data.message.forEach((errorMessage: string) => {
        selectError.message = errorMessage;
      });
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred.');
  }
})

const formData = reactive<FormInfo>({
  fullName: '',
  address: '',
  phone: '',
  university: {
    id: 0,
    name: '',
    location: '',
    value: 0,
    label: 'Pilih Instansi'
  },
  category: [],
  accept: false
})

const phoneValidation = helpers.regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);

const rules = {
  fullName: { required },
  address: { required },
  phone: { required, phoneValidation: helpers.withMessage('Nomor handphone tidak valid', phoneValidation) },
}
const $v = useVuelidate(rules, formData)

const options = ref(universities)
const optionsCategory = ref(categories);

const filterFn = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      options.value = universities;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = universities.filter(
      (university) => university.name.toLowerCase().indexOf(needle) > -1
    );
  });
};
const filterFnCategory = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      optionsCategory.value = categories;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    optionsCategory.value = categories.filter(
      (category) => category.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const onSubmit = async () => {
  console.log(formData.category)
  if (!$v.value.$invalid && formData.accept) {
    loading.value = true;
    try {
      await api.post('students', {
        name: formData.fullName,
        address: formData.address,
        phone: formData.phone,
        user_id: user.value.data.id,
        university_id: formData.university?.id,
        categories: formData.category.map((category) => category.id),
        regency: selectLocationStore.$state.regency?.name,
        district: selectLocationStore.$state.district?.name
      }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      router.push('/')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.university_id !== undefined) {
          submitError.isError = true;
          submitError.message = error.response.data.university_id[0];
        } else {
          submitError.isError = true;
          submitError.message = error.response.data.message;
        }
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
  <q-linear-progress indeterminate v-if="loadUser" color="pink-4" />
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-7 col-sm-10">
        <q-card class="my-card q-pt-md">
          <div class="text-h6 text-center">Daftar sebagai mahasiswa</div>
          <q-banner inline-actions :class="submitError.isError ? `text-white bg-red` : `text-white bg-red hidden`" rounded
            v-if="submitError.isError">
            {{ submitError.message }}
            <template v-slot:action>
              <q-btn flat dense icon="fa-solid fa-xmark" @click="submitError.isError = false" />
            </template>
          </q-banner>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input filled v-model="formData.fullName" label="Nama Lengkap" lazy-rules :error="$v.fullName.$error"
                :error-message="$v.fullName.$errors.map((e) => e.$message).join()" @input="$v.fullName.$touch"
                @blur="$v.fullName.$touch" />
              <q-input autogrow filled v-model="formData.address" label="Alamat" lazy-rules :error="$v.address.$error"
                :error-message="$v.address.$errors.map((e) => e.$message).join()" @input="$v.address.$touch"
                @blur="$v.address.$touch" />
              <q-input type="tel" filled v-model="formData.phone" label="Nomor telephone" lazy-rules
                :error="$v.phone.$error" :error-message="$v.phone.$errors.map((e) => e.$message).join()"
                @input="$v.phone.$touch" @blur="$v.phone.$touch" />

              <q-select :loading="loadingSelect" filled v-model="formData.university" use-input input-debounce="0"
                @filter="filterFn" behavior="dialog" :options="options" label="Instansi">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-select :loading="loadingSelectCategory" filled v-model="formData.category" use-input input-debounce="0"
                @filter="filterFnCategory" use-chips behavior="dialog" :options="optionsCategory"
                label="Minat atau interest anda" multiple>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <LocationSelect />

              <q-toggle v-model="formData.accept" label="Saya menerima lisensi dan persyaratan" />

              <div>
                <q-btn label="Daftar" type="submit" color="primary"
                  :disable="loadUser || $v?.$invalid || !formData.accept" :loading="loading" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
