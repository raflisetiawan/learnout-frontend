<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { api } from 'boot/axios'


interface FormState {
  email: string,
  password: string
}
interface SignInError {
  isError: boolean,
  message: string
}

const router = useRouter();
const loading = ref(false);
const form = reactive<FormState>({
  email: '',
  password: ''
})

const signInError = reactive<SignInError>({
  isError: false,
  message: ''
})

const rules = {
  email: { required, email },
  password: { required }
}

const $v = useVuelidate(rules, form)

const onSubmit = async (): Promise<void> => {
  if (!$v.value.$invalid) {
    loading.value = true;
    try {
      const response = await api.post('signin', { email: form.email, password: form.password }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      localStorage.setItem('signedIn', 'true');
      localStorage.setItem('token', response.data.token);
      router.push('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        error.response.data.message.forEach((errorMessage: string) => {
          signInError.message = errorMessage;
        });
        throw new Error(error.response.data.message);
      }
      throw new Error('An error occurred.');
    }
    finally {
      loading.value = false;
    }
  }
};

</script>
<template>
  <div class="text-h6 text-center">SIGN IN</div>
  <div class="q-pa-md">
    <q-banner inline-actions :class="signInError.isError ? `text-white bg-red` : `text-white bg-red hidden`" rounded
      v-if="signInError.isError">
      {{ signInError.message }}
      <template v-slot:action>
        <q-btn flat dense icon="fa-solid fa-xmark" @click="signInError.isError = false" />
      </template>
    </q-banner>
  </div>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input filled v-model="form.email" label="Email *" :error="$v.email.$error" class="q-mb-lg"
      :error-message="$v.email.$errors.map((e) => e.$message).join()" @input="$v.email.$touch" @blur="$v.email.$touch" />
    <q-input type="password" filled v-model="form.password" label="Password *" :error="$v.password.$error"
      :error-message="$v.password.$errors.map((e) => e.$message).join()" @input="$v.password.$touch"
      @blur="$v.password.$touch" />

    <div>
      <q-btn label="Sign In" :loading="loading" type="submit" color="primary" :disable="$v?.$invalid" />
    </div>
    <div class="text-center">
      <q-btn class="flex-center" dense flat label="Do not have account?, Sign Up" :to="{ name: 'SignUp' }"></q-btn>
    </div>
  </q-form>
</template>
