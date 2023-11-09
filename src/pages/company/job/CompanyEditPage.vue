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
import { JobTypeSelect } from 'src/models/job';
import { JobApplicationRequisite } from 'src/models/job';

const route = useRoute();
const bar = ref();
const formJob = ref<JobWithCompanyWithCategoriesInfo>({
  id: 0,
  title: '',
  description: 'Deskripsi Pekerjaan',
  location: '',
  regency: '',
  district: '',
  end_time: '16:00',
  schedule: '',
  start_time: '10:00',
  province: '',
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
  company_id: 0,
  jobtypes: {
    id: 0,
    name: '',
    label: '',
    value: 0
  },
  jobtype_id: 0
});

const companyStore = useCompanyStore();
const $q = useQuasar();
const companyId = ref();
const categories = reactive<CategoryInfo[]>([]);
const loadingSelectCategory = ref(false);
const userStore = useUserStore();
const router = useRouter();
const jobtypes = ref<JobTypeSelect[]>([]);
const jobRequisiteChecks = ref<JobApplicationRequisite>({
  is_cover_letter: false,
  is_proposal: false,
  is_recommendation_letter: false,
  is_resume: true,
  is_transcript: false,
})
async function getCompanyInfo() {
  const responseCompany = await api.get(`companies/getOneCompanyByUserId/${userStore.$state.userId}`);
  companyStore.$state.companyId = responseCompany.data.company.id;
  companyId.value = responseCompany.data.company.id;
}

async function getJobInfo() {
  const response = await api.get(`/jobs/showJobWithCompanyAndCategories/${route.params.id}`);
  formJob.value = response.data.data;
}

async function getCategoryInfo() {
  const response = await api.get('categories');
  formJob.value.categories = formJob.value.categories.map((category: CategoryInfo) => ({
    id: category.id,
    name: category.name,
    value: category.id,
    label: category.name,
  }));
}

async function getLocationInfo() {
  selectLocationStore.$state.province = {
    id: 0,
    name: formJob.value.province,
    value: 0,
    label: formJob.value.province,
  };
  selectLocationStore.$state.district = {
    id: 0,
    name: formJob.value.district,
    value: 0,
    label: formJob.value.district,
  };
  selectLocationStore.$state.regency = {
    id: 0,
    name: formJob.value.regency,
    value: 0,
    label: formJob.value.regency,
  };
}

async function getJobType() {
  const response = await api.get(`jobtypes/${formJob.value.jobtype_id}`);
  const jobtypeData = response.data.jobtype;
  formJob.value.jobtypes = response.data.jobtype;
  formJob.value.jobtypes.label = response.data.jobtype.name;
  formJob.value.jobtypes.value = jobtypeData.id;
}

async function getAllJobTypes() {
  const response = await api.get('jobtypes/all');
  jobtypes.value = response.data.job_types;
  jobtypes.value.map((jobtype) => {
    jobtype.label = jobtype.name;
    jobtype.value = jobtype.id;
  });
}

async function getJobApplicationRequisites() {
  const response = await api.get(`job-application-requisites/getByJoblistingId/${route.params.id}`);
  jobRequisiteChecks.value = response.data.jobApplicationRequisite;
}

onMounted(async () => {
  loadingSelectCategory.value = true;
  try {
    if (companyStore.$state.companyId === 0) {
      try {
        bar.value.start();
        await getCompanyInfo();
        await getJobInfo();
        await getCategoryInfo();
        await getLocationInfo();
      } catch (error) {
        throw error;
      }
    } else {
      bar.value.start();
      companyId.value = companyStore.$state.companyId;
      try {
        await getJobInfo();
      } catch (error) {
        throw error;
      }
    }

    try {
      await getCompanyInfo();
    } catch (error) {
      throw error;
    }

    try {
      await getCategoryInfo();
      await getLocationInfo();
    } catch (error) {
      throw error;
    } finally {
      loadingSelectCategory.value = false;
      bar.value.stop();
    }

    try {
      await getJobType();
    } catch (error) {
      throw error;
    }

    try {
      await getAllJobTypes();
    } catch (error) {
      throw error;
    }

    try {
      await getJobApplicationRequisites();
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  } finally {
    bar.value.stop();
  }
});


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
      province: selectLocationStore.$state.province?.name,
      district: selectLocationStore.$state.district?.name,
      end_time: `${formJob.value.end_time}:00`,
      schedule: formJob.value.schedule,
      start_time: `${formJob.value.start_time}:00`,
      categories: formJob.value.categories.map((category) => category.id),
      company_id: companyId.value,
      jobtype_id: formJob.value.jobtypes.id,
      is_cover_letter: jobRequisiteChecks.value.is_cover_letter,
      is_transcript: jobRequisiteChecks.value.is_transcript,
      is_recommendation_letter: jobRequisiteChecks.value.is_recommendation_letter,
      is_proposal: jobRequisiteChecks.value.is_proposal,
      is_resume: jobRequisiteChecks.value.is_resume
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
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="row justify-center">
      <div class="col-md-7">
        <q-card class="my-card">
          <div class="text-h4 text-center q-mt-md">Edit Pekerjaan</div>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input filled v-model="formJob.title" label="Judul Pekerjaan" lazy-rules :error="$v.title.$error"
                :error-message="$v.title.$errors.map((e) => e.$message).join()" @input="$v.title.$touch"
                @blur="$v.title.$touch" />

              <q-input filled autogrow v-model="formJob.location" label="Alamat Lengkap Tempat Kerja" lazy-rules
                :error="$v.location.$error" :error-message="$v.location.$errors.map((e) => e.$message).join()"
                @input="$v.location.$touch" @blur="$v.location.$touch" />
              <LocationSelect :is-edit="true" />
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
              <q-select filled v-model="formJob.jobtypes" :options="jobtypes" label="Tipe pekerjaan" />
              <div class="text-subtitle1">Syarat melamar kerja</div>
              <q-checkbox v-model="jobRequisiteChecks.is_resume" label="Curriculum vitae" />
              <q-checkbox v-model="jobRequisiteChecks.is_cover_letter" label="Surat Lamaran" />
              <q-checkbox v-model="jobRequisiteChecks.is_proposal" label="Proposal" />
              <q-checkbox v-model="jobRequisiteChecks.is_recommendation_letter" label="Surat Rekomendasi" />
              <q-checkbox v-model="jobRequisiteChecks.is_transcript" label="Transkrip nilai" />
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
