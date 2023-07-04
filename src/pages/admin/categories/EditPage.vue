<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useRouter, useRoute } from 'vue-router';
import { api } from 'boot/axios'
import { CategoriesInfo } from 'src/components/models';

interface FormName {
  name: string | undefined,
}


const loading = ref(false);
const router = useRouter();
const route = useRoute();
const category = ref<CategoriesInfo>();

onBeforeMount(async () => {
  const response = await api.get(`categories/${route.params.id}`)
  category.value = response.data.data;
  form.name = category.value?.name;
})

const form = reactive<FormName>({
  name: '',
});


const rules = {
  name: { required },
};

const v$ = useVuelidate(rules, form);

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    loading.value = true;
    try {
      await api.patch(`categories/${route.params.id}`, { name: form.name })
      router.push({ name: 'Categories' })
    } catch (error) {
      throw error
    } finally {
      loading.value = false;
    }
  }
};

</script>
<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-8">
        <div class="text-h6 q-mb-lg text-center">Edit Category</div>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled v-model="form.name" label="Nama Category *" type="text" :error="v$.name.$error"
            @input="v$.name.$touch" @blur="v$.name.$touch" :error-message="v$.name.$errors.map((e) => e.$message).join()">
          </q-input>

          <div>
            <q-btn label="Edit" type="submit" color="primary" :loading="loading" :disable="v$?.$invalid" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
