<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { email, minLength, required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { api } from 'boot/axios'

interface FormName {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

interface errorFormInfo {
  isError: boolean,
  message: string
}

const loading = ref(false);
const router = useRouter();

const form = reactive<FormName>({
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
});

const errorForm = reactive<errorFormInfo>({
  isError: false,
  message: ''
})

const rules = {
  email: { required, email },
  name: { required, minLength: minLength(3) },
  password: { required },
  confirmPassword: { required },
};

const v$ = useVuelidate(rules, form);

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    loading.value = true;
    try {
      await api.post('signup', { email: form.email, name: form.name, password: form.password, password_confirmation: form.confirmPassword }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      try {
        const response = await api.post('signin', { email: form.email, password: form.password }, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });
        localStorage.setItem('signedIn', 'true');
        localStorage.setItem('token', response.data.token);
        router.push({ name: 'ChooseRole' });
      } finally {
        loading.value = false;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        errorForm.isError = true;
        error.response.data.message.map((errorMessage: string) => errorForm.message = errorMessage);
        throw new Error(error.response.data.message);
      }
      throw new Error('An error occurred.');
    } finally {
      loading.value = false;
    }
  }
};

</script>
<template>
  <div class="text-h6 q-mb-lg text-center">SIGN UP</div>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input filled v-model="form.email" label="Email *" type="email" :error="v$.email.$error" @input="v$.email.$touch"
      @blur="v$.email.$touch" :error-message="v$.email.$errors.map((e) => e.$message).join()">
    </q-input>

    <q-input filled v-model="form.name" label="name *" type="text" :error="v$.name.$error" @input="v$.name.$touch"
      @blur="v$.name.$touch" :error-message="v$.name.$errors.map((e) => e.$message).join()" />

    <q-input filled v-model="form.password" type="password" label="Password *" :error="v$.password.$error"
      @input="v$.password.$touch" @blur="v$.password.$touch"
      :error-message="v$.password.$errors.map((e) => e.$message).join()"
      :rules="[value => value === form.confirmPassword || 'Should require a matching password and confirmation']" />

    <q-input filled v-model="form.confirmPassword" label="Konfirmasi Password *" type="password"
      :rules="[value => value === form.password || 'Should require a matching password and confirmation']"
      :error="v$.confirmPassword.$error" @input="v$.confirmPassword.$touch" @blur="v$.confirmPassword.$touch"
      :error-message="v$.confirmPassword.$errors.map((e) => e.$message).join()" />

    <div>
      <q-btn label="Sign Up" type="submit" color="primary" :loading="loading"
        :disable="v$?.$invalid || form.password !== form.confirmPassword" />
    </div>
    <div class="text-center">
      <q-btn class="flex-center" dense flat label="Already have account?, Sign In" :to="{ name: 'SignIn' }"></q-btn>
    </div>
  </q-form>
</template>
