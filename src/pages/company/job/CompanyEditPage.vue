<script setup lang="ts">
import { CategoryInfo, JobWithCompanyWithCategoriesInfo } from 'src/components/models';
import { onMounted, reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import LocationSelect from 'components/LocationSelect.vue';
import { api } from 'src/boot/axios';
import { useSelectLocationStore } from 'src/stores/selectLocation';
import { useQuasar } from 'quasar';
import { useUserStore } from 'stores/user';
import { useCompanyStore } from 'src/stores/company';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const formJob = ref<JobWithCompanyWithCategoriesInfo>({
  id: 0,
  title: '',
  description: 'Deskripsi Pekerjaan',
  location: '',
  regency: '',
  district: '',
  end_time: '10:56',
  schedule: '',
  start_time: '10:56',
  categories: [],
  created_at: new Date(),
  updated_at: new Date(),
  company: {
    id: '',
    userId: '',
    name: '',
    description: '',
    location: '',
    website: '',
    email: '',
    phone: '',
    regency: '',
    district: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  company_id: 0
});

const companyStore = useCompanyStore();
const $q = useQuasar();
const companyId = ref();
const categories = reactive<CategoryInfo[]>([]);
const loadingSelectCategory = ref(false);
const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  loadingSelectCategory.value = true;
  if (companyStore.$state.companyId === 0) {
    try {
      const responseCompany = await api.get(`companies/getOneCompanyByUserId/${userStore.$state.userId}`)
      companyStore.$state.companyId = responseCompany.data.company.id;
      companyId.value = responseCompany.data.company.id;
      const response = await api.get(`/jobs/showJobWithCompanyAndCategories/${route.params.id}`);
      formJob.value = response.data.data;
      console.log(formJob.value);
    } catch (error) {
      throw error;
    }
  } else {
    companyId.value = companyStore.$state.companyId;
    try {
      const response = await api.get(`/jobs/showJobWithCompanyAndCategories/${route.params.id}`);
      formJob.value = response.data.data;
    } catch (error) {
      throw error;
    }
  }
  try {
    const getCompany = await api(`/companies/getOneCompanyByUserId/${userStore.$state.userId}`)
    companyId.value = getCompany.data.company.id;
  } catch (error) {
    throw error;
  }
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
  }
})

const selectLocationStore = useSelectLocationStore();

const rules = {
  title: { required },
  description: { required },
  location: { required },
  schedule: { required }
}

const $v = useVuelidate(rules, formJob)

const onSubmit = async () => {
  try {
    await api.patch(`jobs/${route.params.id}`, {
      title: formJob.value.title,
      description: formJob.value.description,
      location: formJob.value.location,
      regency: selectLocationStore.$state.regency?.name,
      district: selectLocationStore.$state.district?.name,
      end_time: `${formJob.value.end_time}:00`,
      schedule: formJob.value.schedule,
      start_time: `${formJob.value.start_time}:00`,
      categories: formJob.value.categories.map((category) => category.id),
      company_id: companyId.value
    })
    router.push({ name: 'ListJob' })
  } catch (error) {
    throw error;
  }
}
const optionsCategory = ref(categories);

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

</script>
<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-7">
        <q-card class="my-card">
          <div class="text-h4 text-center q-mt-md">Posting Pekerjaan</div>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input filled v-model="formJob.title" label="Judul Pekerjaan" lazy-rules :error="$v.title.$error"
                :error-message="$v.title.$errors.map((e) => e.$message).join()" @input="$v.title.$touch"
                @blur="$v.title.$touch" />

              <q-input filled autogrow v-model="formJob.location" label="Alamat Lengkap Tempat Kerja" lazy-rules
                :error="$v.location.$error" :error-message="$v.location.$errors.map((e) => e.$message).join()"
                @input="$v.location.$touch" @blur="$v.location.$touch" />
              <LocationSelect />
              <q-input filled v-model="formJob.schedule" label="Jadwal Hari kerja" hint="Contoh: Senin - Jum'at"
                lazy-rules :error="$v.schedule.$error" :error-message="$v.schedule.$errors.map((e) => e.$message).join()"
                @input="$v.schedule.$touch" @blur="$v.schedule.$touch" />
              <q-input filled v-model="formJob.start_time" mask="time" label="Mulai jam kerja" :rules="['time']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="formJob.start_time" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input filled v-model="formJob.end_time" mask="time" label="Akhir jam kerja" :rules="['time']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="formJob.end_time" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select :loading="loadingSelectCategory" filled v-model="formJob.categories" use-input input-debounce="0"
                @filter="filterFnCategory" use-chips behavior="dialog" :options="optionsCategory"
                label="Kategori Pekerjaan" multiple>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-editor v-model="formJob.description" :dense="$q.screen.lt.md" :toolbar="[
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
                <q-btn label="Submit" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
