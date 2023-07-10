<script setup lang="ts">
import { api } from 'src/boot/axios';
import { ApplicationItem } from 'src/components/models';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import formatDate from 'src/utils/formatDate';
import { AxiosError } from 'axios';

const isStudentEmpty = ref(false);
const students = ref<ApplicationItem[]>([]);
const route = useRoute();

onMounted(async () => {
  try {
    const response = await api.get(`applications/getApplicationsHistoryByJobId/${route.params.id}`);
    students.value = response.data.map((item: ApplicationItem) => {
      return {
        student: item.student,
        status: item.status,
        created_at: item.created_at,
        id: item.id
      };
    });
    console.log(students.value);
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response && error.response.status === 404) {
      isStudentEmpty.value = true;
    } else {
      throw error;
    }
  }
})

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}
</script>
<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-10 col-xs-12 col-sm-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Mahasiswa</th>
              <th class="text-left">Tanggal Mendaftar</th>
              <th class="text-left">Status</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>
          <tbody v-if="!isStudentEmpty">
            <template v-for="student in students" :key="student.id">
              <tr>
                <td class="text-left">{{ student.student.name }}</td>
                <td class="text-left">{{ formatDate(new Date(student.created_at)) }}</td>
                <td class="text-left">{{ student.status }}</td>
                <td class="text-right">
                  <q-btn icon="info" color="blue" :to="{ name: 'StudentDetailApplication', params: { id: student.id } }">
                    <q-tooltip>
                      Lihat Detail Mahasiswa
                    </q-tooltip>
                  </q-btn>
                </td>
              </tr>
            </template>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="3" class="text-center">Belum ada Mahasiswa yang mendaftar</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </div>
</template>
