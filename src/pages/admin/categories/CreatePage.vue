<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios'

interface FormName {
  name: string,
}

const loading = ref(false);
const router = useRouter();

const form = reactive<FormName>({
  name: '',
});
const rules = {
  name: { required, minLength: minLength(3) },
};

const v$ = useVuelidate(rules, form);

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    loading.value = true;
    try {
      await api.post('categories', { name: form.name })
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
        <div class="text-h6 q-mb-lg text-center">Tambah Category</div>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled v-model="form.name" label="Nama Category *" type="text" :error="v$.name.$error"
            @input="v$.name.$touch" @blur="v$.name.$touch" :error-message="v$.name.$errors.map((e) => e.$message).join()">
          </q-input>

          <div>
            <q-btn label="Tambah" type="submit" color="primary" :loading="loading" :disable="v$?.$invalid" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
