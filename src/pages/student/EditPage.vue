<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { api } from 'src/boot/axios';
import axios from 'axios';
import { useRouter } from 'vue-router';
import LocationSelect from 'components/LocationSelect.vue';
import { useSelectLocationStore } from 'stores/selectLocation';
import { useUserStore } from 'src/stores/user';

interface FormInfo {
  fullName: string;
  address: string;
  phone: number | string;
  university: UniversityInfo;
  categories: CategoryInfo[];
  district: string;
  regency: string;
  province: string;
  resume: string;
}

interface SubmitError {
  isError: boolean;
  message: string;
}

interface SelectError {
  isError: boolean;
  message: string;
}

interface UniversityInfo {
  id: number;
  name: string;
  location: string;
  value: number;
  label: string;
}

interface CategoryInfo {
  id: number;
  name: string;
  value: number;
  label: string;
}

const bar = ref();
const userStore = useUserStore();
const universities = reactive<UniversityInfo[]>([]);
const categories = reactive<CategoryInfo[]>([]);
const selectLocationStore = useSelectLocationStore();
const submitError = reactive<SubmitError>({
  isError: false,
  message: '',
});
const selectError = reactive<SelectError>({
  isError: false,
  message: '',
});

const router = useRouter();
const loading = ref(false);
const loadingSelect = ref(false);
const loadingSelectCategory = ref(false);

const formData = reactive<FormInfo>({
  fullName: '',
  address: '',
  phone: '',
  university: {
    id: 0,
    name: '',
    location: '',
    value: 0,
    label: 'Pilih Instansi',
  },
  categories: [],
  district: '',
  regency: '',
  province: '',
  resume: ''
});
const studentId = ref();

const phoneValidation = helpers.regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);

const rules = {
  fullName: { required },
  address: { required },
  phone: { required, phoneValidation: helpers.withMessage('Nomor handphone tidak valid', phoneValidation) },
};
const $v = useVuelidate(rules, formData);

onMounted(async () => {
  loadingSelectCategory.value = true;
  loadingSelect.value = true;
  try {
    bar.value.start();
    const responseUniv = await api.get('universities');
    universities.push(...responseUniv.data.data.map((university: UniversityInfo) => ({
      name: university.name,
      id: university.id,
      location: university.location,
      value: university.id,
      label: university.name,
    })));

    const responseCategory = await api.get('categories');
    categories.push(...responseCategory.data.data.map((category: CategoryInfo) => ({
      id: category.id,
      name: category.name,
      label: category.name,
      value: category.id,
    })));

    const responseStudent = await api.get(`users/getUserWithStudentWithUniversityByUserId/${userStore.$state.userId}`);
    studentId.value = responseStudent.data.student.id;
    const studentData = responseStudent.data.student;
    formData.fullName = studentData.name;
    formData.address = studentData.address;
    formData.phone = studentData.phone;
    formData.regency = studentData.regency;
    formData.district = studentData.district;
    formData.province = studentData.province;
    formData.resume = studentData.resume;
    formData.university = {
      id: studentData.university.id,
      name: studentData.university.name,
      location: studentData.university.location,
      value: studentData.university.id,
      label: studentData.university.name,
    };
    formData.categories = studentData.categories.map((category: CategoryInfo) => ({
      id: category.id,
      name: category.name,
      value: category.id,
      label: category.name,
    }));
    selectLocationStore.$state.province = {
      id: 0,
      name: formData.province,
      value: 0,
      label: formData.province,
    };
    selectLocationStore.$state.district = {
      id: 0,
      name: formData.district,
      value: 0,
      label: formData.district,
    };
    selectLocationStore.$state.regency = {
      id: 0,
      name: formData.regency,
      value: 0,
      label: formData.regency,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      error.response.data.message.forEach((errorMessage: string) => {
        selectError.message = errorMessage;
      });
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred.');
  } finally {
    bar.value.stop();
    loadingSelectCategory.value = false;
    loadingSelect.value = false;
  }
});

const options = ref(universities);
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
    options.value = universities.filter((university) => university.name.toLowerCase().indexOf(needle) > -1);
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
    optionsCategory.value = categories.filter((category) => category.name.toLowerCase().indexOf(needle) > -1);
  });
};

const onSubmit = async () => {
  if (!$v.value.$invalid) {
    loading.value = true;
    try {
      await api.patch(`students/${studentId.value}`, {
        name: formData.fullName,
        address: formData.address,
        phone: formData.phone,
        resume: formData.resume,
        user_id: userStore.$state.userId,
        university_id: formData.university?.id,
        categories: formData.categories.map((category) => category.id),
        regency: selectLocationStore.$state.regency?.name,
        district: selectLocationStore.$state.district?.name,
        province: selectLocationStore.$state.province?.name,
      }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      router.push({ name: 'MyProfile' });
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
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="q-pa-md">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="row justify-center">
      <div class="col-md-7 col-sm-10 col-xs-12">
        <q-card class="my-card q-pt-md">
          <div class="text-h6 text-center">Edit Data mahasiswa</div>
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
              <q-select :loading="loadingSelectCategory" filled v-model="formData.categories" use-input input-debounce="0"
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
              <LocationSelect :is-edit="true" />
              <q-editor v-model="formData.resume" :dense="$q.screen.lt.md" :toolbar="[
                [
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  },
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    options: ['left', 'center', 'right', 'justify']
                  }
                ],
                ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                ['token', 'hr', 'link', 'custom_btn'],
                ['print', 'fullscreen'],
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: [
                      'p',
                      'h1',
                      'h2',
                      'h3',
                      'h4',
                      'h5',
                      'h6',
                      'code'
                    ]
                  },
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'size-1',
                      'size-2',
                      'size-3',
                      'size-4',
                      'size-5',
                      'size-6',
                      'size-7'
                    ]
                  },
                  {
                    label: $q.lang.editor.defaultFont,
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'default_font',
                      'arial',
                      'arial_black',
                      'comic_sans',
                      'courier_new',
                      'impact',
                      'lucida_grande',
                      'times_new_roman',
                      'verdana'
                    ]
                  },
                  'removeFormat'
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                ['undo', 'redo'],
                ['viewsource']
              ]" :fonts="{
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana'
}" />
              <div>
                <q-btn label="Edit" type="submit" color="primary" :disable="$v?.$invalid" :loading="loading" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
