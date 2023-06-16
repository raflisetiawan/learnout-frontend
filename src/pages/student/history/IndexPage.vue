<script setup lang="ts">
import { api } from 'src/boot/axios';
import { ApplicationWithJobListingAndCompanyInfo } from 'src/components/models';
import { useStudentStore } from 'src/stores/student';
import { useUserStore } from 'src/stores/user';
import { onMounted, ref } from 'vue';

const studentStore = useStudentStore();
const userStore = useUserStore();
const loadingDelete = ref(false);
const bar = ref();
const applications = ref<ApplicationWithJobListingAndCompanyInfo[]>([]);
const confirm = ref({
  isShowed: false,
  id: 0,
  title: ''
});

if (!studentStore.$state.studentId) {
  console.log
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
      const studentResponse = await api.get(`/applications/getApplicationsHistoryByStudentId/${studentStore.$state.studentId}`);
      applications.value = [...studentResponse.data];
    } catch (error) {
      throw error;
    } finally {
      bar.value.stop();
    }
  })
}

const showConfirm = (id: number, title: string) => {
  confirm.value.isShowed = true;
  confirm.value.id = id;
  confirm.value.title = title;
}

const sureCancel = async () => {
  try {
    loadingDelete.value = true;
    await api.patch(`applications/cancel/${confirm.value.id}`);
    if (!studentStore.$state.studentId) {
      try {
        const studentResponse = await api.get(`/applications/getApplicationsHistoryByUserId/${userStore.$state.userId}`);
        applications.value = [...studentResponse.data];
      } catch (error) {
        throw error;
      }
    } else {
      try {
        const studentResponse = await api.get(`/applications/getApplicationsHistoryByStudentId/${studentStore.$state.studentId}`);
        applications.value = [...studentResponse.data];
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    throw error;
  } finally {
    loadingDelete.value = false;
    confirm.value.isShowed = false;
  }
}

</script>
<template>
  <div>
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
                  <q-btn dense size="sm" icon="edit" color="green"
                    :to="{ name: 'EditHistoryApplication', params: { id: application.id } }">
                    <q-tooltip>
                      Edit
                    </q-tooltip>
                  </q-btn>
                  <q-btn dense size="sm" icon="cancel" color="red"
                    @click="showConfirm(application.id, application.joblisting.title)">
                    <q-tooltip>
                      Batalkan
                    </q-tooltip>
                  </q-btn>
                </td>
              </tr>
            </template>
          </tbody>
        </q-markup-table>
      </div>
    </div>
    <q-dialog v-model="confirm.isShowed" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="cancel" color="red" text-color="white" />
          <span class="q-ml-sm">Apakah anda yakin ingin membatalkan lamaran.</span>
        </q-card-section>
        <q-card-section class="row items-center justify-center" style="top: -20px">
          <span class="q-ml-sm text-center">{{ confirm.title }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="black" v-close-popup />
          <q-btn flat label="Yakin" @click="sureCancel" color="red" :loading="loadingDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
