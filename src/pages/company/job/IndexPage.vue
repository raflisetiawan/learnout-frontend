<script setup lang="ts">
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useUserStore } from 'src/stores/user';
import { useCompanyStore } from 'src/stores/company';
import { JobWithCompanyWithCategoriesInfo } from 'src/components/models';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const loadingDeleteDialog = ref(false);
const showDeleteDialog = ref(false);
const deleteData = ref({
  id: 0,
  name: ''
});
const userStore = useUserStore();
const companyStore = useCompanyStore();
const companyId = ref();
const jobs = ref<JobWithCompanyWithCategoriesInfo[]>([]);

const getData = async () => {
  if (companyStore.$state.companyId === 0) {
    try {
      const responseCompany = await api.get(`companies/getOneCompanyByUserId/${userStore.$state.userId}`)
      companyStore.$state.companyId = responseCompany.data.company.id;
      companyId.value = responseCompany.data.company.id;
      const response = await api.get(`/jobs/getJobByCompanyId/${companyId.value}`);
      jobs.value = response.data.data;
    } catch (error) {
      throw error;
    }
  } else {
    companyId.value = companyStore.$state.companyId;
    try {
      const response = await api.get(`/jobs/getJobByCompanyId/${companyId.value}`);
      jobs.value = response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

onMounted(async () => {
  await getData();
})

const handleDeleteDialog = (id: number, title: string) => {
  showDeleteDialog.value = true;
  deleteData.value.id = id;
  deleteData.value.name = title;
}

const onDeleteJob = async () => {
  loadingDeleteDialog.value = true;
  try {
    await api.delete(`jobs/${deleteData.value.id}`);
    await getData();
  } catch (error) {
    throw error
  } finally {
    loadingDeleteDialog.value = false;
    showDeleteDialog.value = false;
  }
}
</script>

<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <template v-for="job in jobs" :key="job.id">
        <div class="col-4">
          <q-card class="my-card q-ma-md">
            <q-card-section>
              <div class="text-h6">{{ job.title }}</div>
              <div class="text-subtitle2">{{ formatDistanceToNow(new Date(job.created_at), {
                addSuffix: true, locale: id
              }) }}</div>
            </q-card-section>

            <q-separator dark />

            <q-card-actions>
              <q-btn flat icon="delete" color="red" @click="handleDeleteDialog(job.id, job.title)"></q-btn>
              <q-btn flat icon="edit" color="green" :to="{
                name: 'CompanyEditJob', params: {
                  id: job.id
                }
              }"></q-btn>
              <q-btn flat icon="info" color="blue" :to="{
                name: 'DetailJob', params: {
                  id: job.id
                }
              }">
                <q-tooltip>Detail Pekerjaan</q-tooltip>
              </q-btn>
              <q-btn flat color="secondary" :to="{
                name: 'StudentApplicationList', params: {
                  id: job.id
                }
              }">
                Lihat Pendaftar
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </div>
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm">Apakah anda yakin ingin menghapus pekerjaan: {{ deleteData.name }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="black" v-close-popup />
          <q-btn flat label="Hapus" color="red" @click="onDeleteJob" :loading="loadingDeleteDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
