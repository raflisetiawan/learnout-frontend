<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ApplicationInfo } from 'src/components/models';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { JobWithCompanyWithCategoriesInfo } from 'src/components/models';
import { SubmitError } from 'components/models';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const bar = ref();
const coverLetterUrl = ref();
const resumeUrl = ref();

const job = ref<JobWithCompanyWithCategoriesInfo>();
const loading = ref(false);
const submitError = reactive<SubmitError>({
  isError: false,
  message: ''
})

onMounted(async () => {
  loading.value = true;
  bar.value.start();
  try {
    const response = await api(`applications/${route.params.id}`);
    const responseJob = await api.get(`/jobs/showJobWithCompanyAndCategories/${response.data.data.joblisting_id}`);
    job.value = responseJob.data.data;
    const data = response.data;
    coverLetterUrl.value = response.data.data.cover_letter;
    resumeUrl.value = response.data.data.resume;

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

const applicationForm = ref<ApplicationInfo>({
  cover_letter: null,
  created_at: new Date(),
  id: 0,
  joblisting_id: 0,
  resume: null,
  status: '',
  student_id: 0,
  updated_at: new Date(),
  pending: ''
})


const onSubmit = async () => {
  try {
    loading.value = true;
    await api.post(`/applications/${route.params.id}`, {
      student_id: applicationForm.value.student_id,
      joblisting_id: applicationForm.value.joblisting_id,
      resume: applicationForm.value.resume,
      cover_letter: applicationForm.value.cover_letter,
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
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.cover_letter"
            label="Upload Surat Lamaran">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <a target="_blank" class="text-black" :href="coverLetterUrl"><q-btn>Lihat surat lamaran anda
              sebelumnya</q-btn></a>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.resume"
            label="Upload CV">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <a target="_blank" class="text-black" :href="resumeUrl"><q-btn>Lihat CV anda
              sebelumnya</q-btn></a>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md">
          <q-btn type="submit" color="primary" :loading="loading">Edit Lamaran</q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>
