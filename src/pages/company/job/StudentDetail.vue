<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';
import { useRoute, useRouter } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { JobApplicationRequisiteBooleanFormat } from 'src/models/job';
const studentWithApplication = ref();
const route = useRoute();
const user = ref();
const bar = ref();
const router = useRouter();
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
  try {
    bar.value.start();
    await getJobApplicationRequisite()
    const response = await api.get(`/applications/${route.params.id}`);
    studentWithApplication.value = response.data.data.application;
    user.value = response.data.data.user;
  } catch (error) {
    throw error;
  } finally {
    bar.value.stop();
  }
})

const onReject = async () => {
  try {
    await api.patch(`applications/reject/${studentWithApplication.value?.id}`);
    router.push({
      name: 'StudentApplicationList', params: {
        id: studentWithApplication.value?.joblisting_id
      }
    })
  } catch (error) {
    throw error;
  }
}

const onAccept = async () => {
  try {
    await api.patch(`applications/accept/${studentWithApplication.value?.id}`);
    router.push({
      name: 'StudentApplicationList', params: {
        id: studentWithApplication.value?.joblisting_id
      }
    })
  } catch (error) {
    throw error;
  }
}

const handleImageError = () => {
  user.value.image = `${user.value.image}/user.png`;
}

const getJobApplicationRequisite = async () => {
  const response = await api.get(`job-application-requisites/getByJoblistingIdFromUpdateApplication/${route.params.id}`);
  jobApplicationRequisite.value = response.data.jobApplicationRequisite;
}

</script>

<template>
  <div class="">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="q-pa-md">
      <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-10 q-mr-sm q-mb-md">
          <q-img :src="`${user?.image}`" spinner-color="white" style="height: 140px; max-width: 150px"
            @error="handleImageError" />

          <div class="text-h4">{{ studentWithApplication?.student?.name }}</div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-4 col-sm-10 col-xs-10 q-mr-sm q-mb-md" v-if="jobApplicationRequisite.is_resume">
              <a :href="studentWithApplication?.resume" target="_blank" class="text-black"><q-btn color="primary">Lihat
                  cv</q-btn></a>
            </div>
            <div class="col-md-4 col-sm-10 col-xs-10 q-mr-sm q-mb-md" v-if="jobApplicationRequisite.is_proposal">
              <a :href="studentWithApplication?.proposal" target="_blank" class="text-black"><q-btn color="primary">Lihat
                  Proposal</q-btn></a>
            </div>
            <div class="col-md-4 col-sm-10 col-xs-10 q-mr-sm q-mb-md" v-if="jobApplicationRequisite.is_cover_letter">
              <a :href="studentWithApplication?.cover_letter" target="_blank" class="text-black"><q-btn
                  color="primary">Lihat
                  Surat Lamaran</q-btn></a>
            </div>
            <div class="col-md-4 col-sm-10 col-xs-10 q-mr-sm q-mb-md" v-if="jobApplicationRequisite.is_transcript">
              <a :href="studentWithApplication?.transcripts" target="_blank" class="text-black"><q-btn
                  color="primary">Lihat
                  Transcript</q-btn></a>
            </div>
            <div class="col-md-4 col-sm-10 col-xs-10 q-mr-sm q-mb-md"
              v-if="jobApplicationRequisite.is_recommendation_letter">
              <a :href="studentWithApplication?.recommendation_letter" target="_blank" class="text-black"><q-btn
                  color="primary">Lihat
                  Surat rekomendasi</q-btn></a>
            </div>
            <div class="col-md-4 col-sm-10 col-xs-10 q-mr-sm q-mb-md" v-if="jobApplicationRequisite.is_health_insurance">
              <a :href="studentWithApplication?.health_insurance" target="_blank" class="text-black"><q-btn
                  color="primary">Lihat
                  Asuransi kesehatan</q-btn></a>
            </div>
          </div>
        </div>
      </div>
      <div class="text-overline">{{ studentWithApplication?.student?.address }}</div>
      <div class="text-body1">{{ studentWithApplication?.student?.phone }}</div>
      <div class="text-body1">Linkedin : <a target="_blank" :href="studentWithApplication?.student?.linkedin">{{
        studentWithApplication?.student?.linkedin }}</a></div>
      <div class="text-body2">{{ studentWithApplication?.student?.province }} - {{
        studentWithApplication?.student?.regency
      }} - {{ studentWithApplication?.student?.district }}</div>
      <div class="text-caption text-grey q-mb-md">Di posting sejak:
        {{ studentWithApplication?.student?.created_at ? formatDistanceToNow(new
          Date(studentWithApplication?.student.created_at), { addSuffix: true, locale: id }) : ''
        }}
      </div>
      <div class="col-10">
        <q-separator color="primary" class="q-my-md"></q-separator>
      </div>
      <p v-if="studentWithApplication?.student?.resume !== null" v-html="studentWithApplication?.student?.resume"></p>
      <div class="row">
        <div class="col-md-2"><q-btn @click="onAccept" color="green">Terima lamaran</q-btn></div>
        <div class="col-md-2"><q-btn @click="onReject" color="red">Tolak lamaran</q-btn></div>
      </div>
    </div>
  </div>
</template>
