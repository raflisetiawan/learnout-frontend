<script setup lang="ts">
import { JobInfo, CategoryInfo } from 'src/components/models';
import { onMounted, reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import LocationSelect from 'components/LocationSelect.vue';
import { api } from 'src/boot/axios';
import { useSelectLocationStore } from 'src/stores/selectLocation';
import getUser from 'src/utils/getUser';

const formJob = reactive<JobInfo>({
  id: 0,
  title: '',
  description: '',
  location: '',
  regency: '',
  district: '',
  end_time: '10:56',
  schedule: '',
  start_time: '10:56',
  category: []
});
const companyId = ref();
const categories = reactive<CategoryInfo[]>([]);
const loadingSelectCategory = ref(false);

onMounted(async () => {
  loadingSelectCategory.value = true;
  try {
    const response = await getUser(localStorage.getItem('token'));
    companyId.value = response.data.id;
  } catch (error) {
    throw error;
  }
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
  }
})

const selectLocationStore = useSelectLocationStore();

const rules = {
  title: { required },
  description: { required },
  location: { required },
  schedule: { required }
}

const $v = useVuelidate(rules, formJob)

const onSubmit = async () => {
  try {
    const response = await api.post('jobs', {
      title: formJob.title,
      description: formJob.description,
      location: formJob.location,
      regency: selectLocationStore.$state.regency?.name,
      district: selectLocationStore.$state.district?.name,
      end_time: `${formJob.end_time}:00`,
      schedule: formJob.schedule,
      start_time: `${formJob.start_time}:00`,
      categories: formJob.category.map((category) => category.id),
      company_id: companyId.value
    })
    console.log(response);
  } catch (error) {
    throw error;
  }
}
const optionsCategory = ref(categories);

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

</script>
<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-7">
        <q-card class="my-card">
          <div class="text-h4 text-center q-mt-md">Posting Pekerjaan</div>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input filled v-model="formJob.title" label="Judul Pekerjaan" lazy-rules :error="$v.title.$error"
                :error-message="$v.title.$errors.map((e) => e.$message).join()" @input="$v.title.$touch"
                @blur="$v.title.$touch" />
              <q-input filled autogrow v-model="formJob.description" label="Deskripsi Pekerjaan" lazy-rules
                :error="$v.description.$error" :error-message="$v.description.$errors.map((e) => e.$message).join()"
                @input="$v.description.$touch" @blur="$v.description.$touch" />
              <q-input filled autogrow v-model="formJob.location" label="Alamat Lengkap Tempat Kerja" lazy-rules
                :error="$v.location.$error" :error-message="$v.location.$errors.map((e) => e.$message).join()"
                @input="$v.location.$touch" @blur="$v.location.$touch" />
              <LocationSelect />
              <q-input filled v-model="formJob.schedule" label="Jadwal Hari kerja" hint="Contoh: Senin - Jum'at"
                lazy-rules :error="$v.schedule.$error" :error-message="$v.schedule.$errors.map((e) => e.$message).join()"
                @input="$v.schedule.$touch" @blur="$v.schedule.$touch" />
              <q-input filled v-model="formJob.start_time" mask="time" label="Mulai jam kerja" :rules="['time']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="formJob.start_time" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input filled v-model="formJob.end_time" mask="time" label="Akhir jam kerja" :rules="['time']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="formJob.end_time" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select :loading="loadingSelectCategory" filled v-model="formJob.category" use-input input-debounce="0"
                @filter="filterFnCategory" use-chips behavior="dialog" :options="optionsCategory"
                label="Kategori Pekerjaan" multiple>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div>
                <q-btn label="Submit" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>