<script setup lang="ts" async>
import { api } from 'src/boot/axios';
import { reactive, ref } from 'vue';
import LocationSelect from '../LocationSelect.vue';
import { useSelectLocationStore } from 'src/stores/selectLocation';
import { useFilterSearchStore } from 'src/stores/filterSearch';
import { useRouter } from 'vue-router';

interface CategoryInfo {
  id: number,
  name: string,
  value: number,
  label: string
}
const filterDialog = ref(false);
const categories = reactive<CategoryInfo[]>([]);
const loadingSelectCategory = ref(false);
const loadingSelect = ref(false);
const category = ref();
const optionsCategory = ref(categories);
const locationStore = useSelectLocationStore();
const filterSearch = useFilterSearchStore();
const router = useRouter();

const getCategories = async () => {
  try {
    const response = await api.get('categories');
    let data = [];
    data.push(...response.data.data);
    data.map((category) => {
      categories.push({
        id: category.id,
        name: category.name,
        label: category.name,
        value: category.id
      });
    })
  } catch (error) {
    throw error
  } finally {
    loadingSelectCategory.value = false;
    loadingSelect.value = false;
  }
}

await getCategories();

const showDialog = () => {
  filterSearch.$state.isFilter = false;
  filterSearch.$state.categories = [];
  filterSearch.$state.regency = undefined;
  filterDialog.value = true;
}

const filterFnCategory = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      optionsCategory.value = categories;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    optionsCategory.value = categories.filter(
      (category) => category.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const onFilter = async () => {
  // try {
  //   const params = {};
  filterSearch.$state.isFilter = true;

  if (category.value !== undefined) {
    const categoryNames = category.value.map((c: any) => c.id);
    // const categoryString = categoryNames.join(',');
    filterSearch.$state.categories = categoryNames;
  }

  if (locationStore.$state.regency?.name !== '') {
    filterSearch.$state.regency = locationStore.$state.regency?.name;
    // params['regency'] = locationStore.$state.regency?.name;
  }

  router.push({ name: 'AllJob' })

  //   const response = await api.get('jobs', { params });
  //   console.log(response.data);
  // } catch (error) {
  //   console.error(error);
  // }
}

</script>
<template>
  <div class="q-mt-lg">
    <q-btn icon="fa-solid fa-filter" class="q-ml-md" size="sm" @click="showDialog">
      Filter
    </q-btn>

    <q-dialog v-model="filterDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Filter</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row text-center justify-center">
            <div class="col-10 q-mb-md">
              <q-select :loading="loadingSelectCategory" filled v-model="category" use-input input-debounce="0"
                @filter="filterFnCategory" use-chips behavior="dialog" :options="optionsCategory" label="Category"
                multiple>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-10">
              <location-select />
            </div>
          </div>
          <div class="row text-center q-mt-md">
            <div class="col-12">
              <q-btn color="primary" @click="onFilter">Filter</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
