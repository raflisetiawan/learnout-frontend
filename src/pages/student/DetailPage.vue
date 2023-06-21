<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStudentStore } from 'src/stores/student';
import { useUserStore } from 'src/stores/user';
import { api } from 'src/boot/axios';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const studentStore = useStudentStore();
const userStore = useUserStore();
const bar = ref();
const student = ref();
const studentId = ref();

if (!studentStore.$state.studentId) {
  onMounted(async () => {
    try {
      bar.value.start();
      const response = await api.get(`students/getOneStudentByUserId/${userStore.$state.userId}`);
      student.value = response.data.student;
    } catch (error) {
      throw error;
    } finally {
      bar.value.stop();
    }
  })
} else {
  onMounted(async () => {
    try {
      bar.value.start();
      const response = await api.get(`students/getOneStudentByUserId/${studentStore.$state.studentId}`);
      studentId.value = response.data.data.id;
    } catch (error) {
      throw error
    } finally {
      bar.value.stop();
    }
  })
}

</script>
<template>
  <div class="">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="q-pa-md">
      <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-10">
          <div class="text-h4">{{ student?.name }}</div>
        </div>
      </div>
      <div class="text-overline">{{ student?.address }}</div>
      <div class="text-caption text-grey q-mb-md">Di posting sejak:
        {{ student?.created_at ? formatDistanceToNow(new Date(student.created_at), { addSuffix: true, locale: id }) : ''
        }}
      </div>
      <p v-if="student?.resume !== null" v-html="student?.resume"></p>
    </div>
  </div>
</template>
