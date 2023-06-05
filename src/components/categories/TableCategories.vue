<script setup lang="ts" async>
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { CategoriesInfo } from 'components/models';
import { useQuasar } from 'quasar';

interface dataCategoryInfo {
  name: string,
  id: number
}

const categories = ref<CategoriesInfo[]>([]);
const $q = useQuasar();

const getCategories = async (isDelete: boolean) => {
  try {
    const response = await api.get('categories');
    if (isDelete) {
      categories.value = response.data.data;
    } else {
      categories.value.push(...response.data.data);
    }
  } catch (error) {
    throw error;
  }
};

await getCategories(false);

function confirm(data: dataCategoryInfo) {
  $q.dialog({
    title: 'Confirm',
    message: `Apakah anda yakin ingin menghapus ${data.name}`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await api.delete(`categories/${data.id}`)
    await getCategories(true);
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
        <q-btn :to="{ name: 'CreateCategory' }" color="primary" class="q-mb-md">Tambah Category</q-btn>
        <q-markup-table wrap-cells>
          <thead>
            <tr>
              <th class="text-left">Nama Category</th>
              <th class="text-center" colspan="3">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="category in categories" :key="category.id">
              <tr>
                <td class="text-left">{{ category.name }}</td>
                <td class="text-left">
                  <q-btn dense icon="delete" color="negative"
                    @click="confirm({ name: category.name, id: category.id })" />
                </td>
                <td>
                  <q-btn dense icon="fa-solid fa-circle-info" color="secondary" :to="{
                    name: 'ShowCategory', params: {
                      id: category.id
                    }
                  }" />
                </td>
                <td>
                  <q-btn dense icon="fa-solid fa-pen-to-square" color="positive" :to="{
                    name: 'EditCategory', params: {
                      id: category.id
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
