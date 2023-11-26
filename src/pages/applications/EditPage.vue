<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { JobWithCompanyWithCategoriesInfo } from 'src/components/models';
import { SubmitError } from 'components/models';
import axios from 'axios';
import { JobApplicationRequisiteBooleanFormat } from 'src/models/job';

const route = useRoute();
const router = useRouter();
const bar = ref();
const coverLetterUrl = ref();
const resumeUrl = ref();
const recommendationLetterUrl = ref();
const transcriptsUrl = ref();
const proposalUrl = ref();
const healthInsuranceUrl = ref();

const job = ref<JobWithCompanyWithCategoriesInfo>();
const loading = ref(false);
const submitError = reactive<SubmitError>({
  isError: false,
  message: ''
})
const jobApplicationRequisite = ref<JobApplicationRequisiteBooleanFormat>({
  is_cover_letter: false,
  is_proposal: false,
  is_resume: false,
  is_transcript: false,
  is_recommendation_letter: false,
  is_health_insurance: false,
  id: 0
});

onMounted(async () => {
  loading.value = true;
  bar.value.start();
  try {
    await getJobApplicationRequisite();
  } catch (error) {
    throw error;
  }
  try {
    const response = await api(`applications/${route.params.id}`);

    const responseJob = await api.get(`/jobs/showJobWithCompanyAndCategories/${response.data.data.joblisting_id}`);
    job.value = responseJob.data.data;
    const data = response.data;
    coverLetterUrl.value = response.data.data.application.cover_letter;
    resumeUrl.value = response.data.data.application.resume;
    recommendationLetterUrl.value = response.data.data.application.recommendation_letter;
    proposalUrl.value = response.data.data.application.proposal;
    transcriptsUrl.value = response.data.data.application.transcripts;
    console.log(response.data.data.application);


    healthInsuranceUrl.value = response.data.data.application.health_insurance;


    applicationForm.value = {
      ...data.data,
      cover_letter: null,
      resume: null
    };

  } catch (error) {
    throw error;
  } finally {
    bar.value.stop();
    loading.value = false;
  }
});

const applicationForm = ref({
  cover_letter: null,
  created_at: new Date(),
  id: 0,
  joblisting_id: 0,
  resume: null,
  status: '',
  student_id: 0,
  updated_at: new Date(),
  pending: '',
  recommendation_letter: [],
  proposal: [],
  transcripts: [],
  healthInsurance: [],
  application: { student_id: 0, joblisting_id: 0 },

})

const getJobApplicationRequisite = async () => {
  const response = await api.get(`job-application-requisites/getByJoblistingIdFromUpdateApplication/${route.params.id}`);
  jobApplicationRequisite.value = response.data.jobApplicationRequisite;
}



const onSubmit = async () => {
  try {
    loading.value = true;
    await api.post(`/applications/${route.params.id}`, {
      student_id: applicationForm.value.application.student_id,
      joblisting_id: applicationForm.value.application.joblisting_id,
      resume: applicationForm.value.resume,
      cover_letter: applicationForm.value.cover_letter,
      health_insurance: applicationForm.value.healthInsurance,
      status: 'pending',
      _method: 'PATCH'
    }, {
      headers: {
        'content-type': 'multipart/form-data',
      }
    });
    router.push({ name: 'HistoryApplication' });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.data.message !== undefined) {
        submitError.isError = true;
        submitError.message = error.response.data.message
      } else {
        submitError.isError = true;
        submitError.message = 'Terjadi masalah, coba lagi';
      }
      throw error;
    } else {
      submitError.isError = true;
      submitError.message = 'Terjadi masalah, coba lagi'
      throw error;
    }
  } finally {
    loading.value = false;
  }
};


</script>

<template>
  <div class="q-pa-md">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="text-h4">Syarat Melamar</div>
    <div class="text-h6">{{ job?.title }}</div>
    <div class="text-overline">{{ job?.company.name }}</div>
    <div class="row">
      <div class="col-md-6">
        <q-banner inline-actions :class="submitError.isError ? `text-white bg-red q-mb-md` : `text-white bg-red hidden`"
          rounded v-if="submitError.isError">
          {{ submitError.message }}
          <template v-slot:action>
            <q-btn flat dense icon="fa-solid fa-xmark" @click="submitError.isError = false" />
          </template>
        </q-banner>
      </div>
    </div>
    <q-form @submit="onSubmit" class="q-gutter-md" enctype="multipart/form-data">
      <div class="row">
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_cover_letter">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.cover_letter"
            label="Upload Surat Lamaran">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <a target="_blank" class="text-black" :href="coverLetterUrl"><q-btn>Lihat surat lamaran anda
              sebelumnya</q-btn></a>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_resume">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.resume"
            label="Upload CV">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <a target="_blank" class="text-black" :href="resumeUrl"><q-btn>Lihat CV anda
              sebelumnya</q-btn></a>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_recommendation_letter">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined
            v-model="applicationForm.recommendation_letter" label="Upload Surat Rekomendasi">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <a target="_blank" class="text-black" :href="recommendationLetterUrl"><q-btn>Lihat Surat Rekomendasi anda
              sebelumnya</q-btn></a>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_proposal">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.proposal"
            label="Upload Proposal">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <a target="_blank" class="text-black" :href="proposalUrl"><q-btn>Lihat Proposal anda
              sebelumnya</q-btn></a>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_transcript">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.transcripts"
            label="Upload Transkrip">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <a target="_blank" class="text-black" :href="transcriptsUrl"><q-btn>Lihat Transkrip anda
              sebelumnya</q-btn></a>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_health_insurance">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined
            v-model="applicationForm.healthInsurance" label="Upload Asuransi Kesehatan">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <a target="_blank" class="text-black" :href="healthInsuranceUrl"><q-btn>Lihat asuransi kesehatan
              sebelumnya</q-btn></a>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md">
          <q-btn type="submit" color="primary" :loading="loading">Edit Lamaran</q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>
