<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ApplicationInfo } from 'src/components/models';
import { useJobStore } from 'src/stores/job';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { JobWithCompanyWithCategoriesInfo } from 'src/components/models';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useUserStore } from 'src/stores/user';
import { SubmitError } from 'components/models';
import axios from 'axios';

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

if (jobStore.$state.temporaryJob === null) {
  onMounted(async () => {
    loading.value = true;
    bar.value.start(); // Memulai AJAX bar
    try {
      const studentResponse = await api.get(`/students/getStudentIdByUserId/${userStore.$state.userId}`);
      studentId.value = studentResponse.data.student_id;
      const response = await api.get(`/jobs/showJobWithCompanyAndCategories/${route.params.id}`);
      job.value = response.data.data;
      console.log(job.value);
    } catch (error) {
      throw error;
      // Penanganan error jika diperlukan
    } finally {
      bar.value.stop(); // Menghentikan AJAX bar setelah permintaan selesai
      loading.value = false;
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
  })
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
  pending: ''
})

const rules = {
  cover_letter: { required },
  resume: { required },
}
const $v = useVuelidate(rules, applicationForm)

const onSubmit = async () => {
  if (!$v.value.$invalid) {
    try {
      loading.value = true;
      await api.post('/applications', {
        joblisting_id: job.value?.id,
        resume: applicationForm.value.resume,
        cover_letter: applicationForm.value.cover_letter,
        status: 'pending',
        student_id: studentId.value,
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
            lazy-rules :error="$v.cover_letter.$error"
            :error-message="$v.cover_letter.$errors.map((e) => e.$message).join()" @input="$v.cover_letter.$touch"
            @blur="$v.cover_letter.$touch" label="Upload Surat Lamaran">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="col-md-7 col-sm-9 col-xs-10 q-mb-md">
          <q-file counter accept=".pdf,.docx,.txt" max-file-size="5242880" outlined v-model="applicationForm.resume"
            label="Upload CV" lazy-rules :error="$v.resume.$error"
            :error-message="$v.resume.$errors.map((e) => e.$message).join()" @input="$v.resume.$touch"
            @blur="$v.resume.$touch">
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
