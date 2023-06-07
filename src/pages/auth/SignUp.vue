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
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        errorForm.isError = true;
        if (error.response.data.email) {
          if (Array.isArray(error.response.data.email)) {
            error.response.data.email.forEach((errorMessage: string) => {
              errorForm.message = errorMessage
            });
          } else {
            errorForm.message = error.response.data.email;
          }
        }
        if (error.response.data.password) {
          if (Array.isArray(error.response.data.password)) {
            error.response.data.password.forEach((errorMessage: string) => {
              errorForm.message = errorMessage;
            });
          } else {
            errorForm.message = error.response.data.password;
          }
        }
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
  <div class="text-h6 q-mb-md text-center">SIGN UP</div>
  <div class="q-pb-md">
    <q-banner inline-actions :class="errorForm.isError ? `text-white bg-red` : `text-white bg-red hidden`" rounded
      v-if="errorForm.isError">
      {{ errorForm.message }}
      <template v-slot:action>
        <q-btn flat dense icon="fa-solid fa-xmark" @click="errorForm.isError = false" />
      </template>
    </q-banner>
  </div>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input filled v-model="form.email" label="Email *" type="email" :error="v$.email.$error" @input="v$.email.$touch"
      @blur="v$.email.$touch" :error-message="v$.email.$errors.map((e) => e.$message).join()">
    </q-input>

    <q-input filled v-model="form.name" label="name *" type="text" :error="v$.name.$error" @input="v$.name.$touch"
      @blur="v$.name.$touch" :error-message="v$.name.$errors.map((e) => e.$message).join()" />

    <q-input filled v-model="form.password" type="password" label="Password *" :error="v$.password.$error"
      @input="v$.password.$touch" @blur="v$.password.$touch"
      :error-message="v$.password.$errors.map((e) => e.$message).join()" />

    <q-input filled v-model="form.confirmPassword" label="Konfirmasi Password *" type="password"
      :error="v$.confirmPassword.$error" @input="v$.confirmPassword.$touch" @blur="v$.confirmPassword.$touch"
      :error-message="v$.confirmPassword.$errors.map((e) => e.$message).join()" />

    <div>
      <q-btn label="Sign Up" type="submit" color="primary" :loading="loading" :disable="v$?.$invalid" />
    </div>
    <div class="text-center">
      <q-btn class="flex-center" dense flat label="Already have account?, Sign In" :to="{ name: 'SignIn' }"></q-btn>
    </div>
  </q-form>
</template>
