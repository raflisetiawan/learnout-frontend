<script setup lang="ts">
import { api } from 'src/boot/axios';
import { ApplicationWithJobListingAndCompanyInfo } from 'src/components/models';
import { useStudentStore } from 'src/stores/student';
import { useUserStore } from 'src/stores/user';
import { onMounted, ref } from 'vue';

const studentStore = useStudentStore();
const userStore = useUserStore();
const bar = ref();
const applications = ref<ApplicationWithJobListingAndCompanyInfo[]>([]);

if (!studentStore.$state.studentId) {
  onMounted(async () => {
    try {
      bar.value.start();
      const studentResponse = await api.get(`/applications/getApplicationsHistoryByUserId/${userStore.$state.userId}`);
      applications.value = [...studentResponse.data];
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
      const studentResponse = await api.get(`/applications/getApplicationsHistoryByStudentId/${studentStore.$state.studentId}`);
      applications.value = [...studentResponse.data];
    } catch (error) {
      throw error;
    } finally {
      bar.value.stop();
    }
  })
}

</script>
<template>
  <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
  <div class="row q-pa-md justify-center">
    <div class="col-md-8 col-sm-10 col-xs-12">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">Judul Pekerjaan</th>
            <th class="text-right">Asal Perusahaan</th>
            <th class="text-right">Status</th>
            <th class="text-right">Surat Lamaran</th>
            <th class="text-right">CV</th>
            <th class="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="application in applications" :key="application.id">
            <tr>
              <td class="text-left">{{ application.joblisting.title }}</td>
              <td class="text-right">{{ application.joblisting.company.name }}</td>
              <td class="text-right"><q-badge color="warning">{{ application.status }}</q-badge></td>
              <td class="text-right">
                <a v-if="typeof application.cover_letter === 'string'" target="_blank" :href="application.cover_letter"
                  class="text-black">
                  <q-btn dense>Lihat</q-btn>
                </a>
              </td>
              <td class="text-right">
                <a v-if="typeof application.resume === 'string'" target="_blank" :href="application.resume"
                  class="text-black">
                  <q-btn dense>Lihat</q-btn>
                </a>
              </td>
              <td class="text-right">
                <q-btn dense size="xs" icon="edit" color="green"
                  :to="{ name: 'EditHistoryApplication', params: { id: application.id } }"></q-btn>
              </td>
            </tr>
          </template>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>
