<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';
import { useRoute, useRouter } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
const studentWithApplication = ref();
const route = useRoute();
const user = ref();
const bar = ref();
const router = useRouter();
onMounted(async () => {
  try {
    bar.value.start();
    const response = await api.get(`/applications/${route.params.id}`);
    studentWithApplication.value = response.data.data.application;
    user.value = response.data.data.user;
    console.log(user.value);
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

</script>

<template>
  <div class="">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="q-pa-md">
      <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-10">
          <q-img :src="`${user?.image}`" spinner-color="white" style="height: 140px; max-width: 150px"
            @error="handleImageError" />

          <div class="text-h4">{{ studentWithApplication?.student?.name }}</div>
        </div>
        <div class="col-md-2 col-sm-4 col-xs-10">
          <a :href="studentWithApplication?.resume" target="_blank" class="text-black"><q-btn color="primary">Lihat
              cv</q-btn></a>
        </div>
        <div class="col-md-2 col-sm-4 col-xs-10">
          <a :href="studentWithApplication?.cover_letter" target="_blank" class="text-black"><q-btn color="primary">Lihat
              Surat Lamaran</q-btn></a>
        </div>
      </div>
      <div class="text-overline">{{ studentWithApplication?.student?.address }}</div>
      <div class="text-body1">{{ studentWithApplication?.student?.phone }}</div>
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
