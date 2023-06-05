<script setup lang="ts" async>
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { UniversitiesInfo } from 'components/models';
import { useQuasar } from 'quasar';

interface dataUniversityInfo {
  name: string,
  id: number
}

const universities = ref<UniversitiesInfo[]>([]);
const $q = useQuasar();

const getUniversities = async (isDelete: boolean) => {
  try {
    const response = await api.get('universities');
    if (isDelete) {
      universities.value = response.data.data;
    } else {
      universities.value.push(...response.data.data);
    }
  } catch (error) {
    throw error;
  }
};

await getUniversities(false);

function confirm(data: dataUniversityInfo) {
  $q.dialog({
    title: 'Confirm',
    message: `Apakah anda yakin ingin menghapus ${data.name}`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await api.delete(`universities/${data.id}`)
    await getUniversities(true);
    // console.log('>>>> OK')
  }).onOk(() => {
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
</script>
<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-md-8">
        <q-btn :to="{ name: 'CreateUniversity' }" color="primary" class="q-mb-md">Tambah Universitas</q-btn>
        <q-markup-table wrap-cells>
          <thead>
            <tr>
              <th class="text-left">Nama Universitas</th>
              <th class="text-center">Alamat</th>
              <th class="text-center" colspan="3">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="university in universities" :key="university.id">
              <tr>
                <td class="text-left">{{ university.name }}</td>
                <td class="text-left">{{ university.location }}</td>
                <td class="text-left">
                  <q-btn dense icon="delete" color="negative"
                    @click="confirm({ name: university.name, id: university.id })" />
                </td>
                <td>
                  <q-btn dense icon="fa-solid fa-circle-info" color="secondary" :to="{
                    name: 'ShowUniversities', params: {
                      id: university.id
                    }
                  }" />
                </td>
                <td>
                  <q-btn dense icon="fa-solid fa-pen-to-square" color="positive" :to="{
                    name: 'EditUniversities', params: {
                      id: university.id
                    }
                  }" />
                </td>
              </tr>
            </template>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </div>
</template>
