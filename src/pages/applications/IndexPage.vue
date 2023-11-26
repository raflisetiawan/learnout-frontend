<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ApplicationInfo } from 'src/components/models';
import { useJobStore } from 'src/stores/job';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { JobWithCompanyWithCategoriesInfo } from 'src/components/models';
import { useUserStore } from 'src/stores/user';
import { SubmitError } from 'components/models';
import axios from 'axios';
import { JobApplicationRequisiteBooleanFormat } from 'src/models/job';

const route = useRoute();
const router = useRouter();
const bar = ref();
const userStore = useUserStore();

const jobStore = useJobStore();
const job = ref<JobWithCompanyWithCategoriesInfo>();
const studentId = ref();
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

if (jobStore.$state.temporaryJob === null) {
  onMounted(async () => {
    loading.value = true;
    bar.value.start(); // Memulai AJAX bar
    try {
      const studentResponse = await api.get(`/students/getStudentIdByUserId/${userStore.$state.userId}`);
      studentId.value = studentResponse.data.student_id;
      const response = await api.get(`/jobs/showJobWithCompanyAndCategories/${route.params.id}`);
      job.value = response.data.data;
    } catch (error) {
      throw error;
    } finally {
      bar.value.stop();
      loading.value = false;
    }
    try {
      await getJobApplicationRequisite();
    } catch (error) {
      throw error;
    }
  });
} else {
  job.value = jobStore.$state.temporaryJob;
  onMounted(async () => {
    try {
      const studentResponse = await api.get(`/students/getStudentIdByUserId/${userStore.$state.userId}`);
      studentId.value = studentResponse.data.student_id;
    } catch (error) {
      throw error;
    } finally {
      bar.value.stop();
      loading.value = false;
    }
    try {
      await getJobApplicationRequisite();
    } catch (error) {
      throw error;
    }
  })
}

const getJobApplicationRequisite = async () => {
  const response = await api.get(`job-application-requisites/getByJoblistingId/${route.params.id}`);
  jobApplicationRequisite.value = response.data.jobApplicationRequisite;
}

const applicationForm = ref<ApplicationInfo>({
  cover_letter: [],
  created_at: new Date(),
  id: 0,
  joblisting_id: 0,
  resume: [],
  status: '',
  student_id: 0,
  updated_at: new Date(),
  pending: '',
  recommendation_letter: [],
  proposal: [],
  transcripts: [],
  healthInsurance: []
})


const onSubmit = async () => {
  try {
    loading.value = true;
    await api.post('/applications', {
      joblisting_id: job.value?.id,
      resume: applicationForm.value.resume,
      cover_letter: applicationForm.value.cover_letter,
      status: 'pending',
      student_id: studentId.value,
      transcripts: applicationForm.value.transcripts,
      proposal: applicationForm.value.proposal,
      recommendation_letter: applicationForm.value.recommendation_letter,
      health_insurance: applicationForm.value.healthInsurance,
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
        throw error;
      } else {
        submitError.isError = true;
        submitError.message = 'Terjadi masalah, coba lagi';
        throw error;
      }
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
            lazy-rules label="Upload Surat Lamaran">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_resume">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.resume"
            label="Upload CV" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_proposal">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.proposal"
            label="Upload Propolsal" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_recommendation_letter">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined
            v-model="applicationForm.recommendation_letter" label="Surat rekomendasi" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_transcript">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.transcripts"
            label="Transkrip nilai" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md" v-if="jobApplicationRequisite.is_health_insurance">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined
            v-model="applicationForm.healthInsurance" label="Asuransi kesehatan" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md">
          <q-btn type="submit" color="primary" :loading="loading">Lamar</q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>
