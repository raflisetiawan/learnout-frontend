<script setup lang="ts">
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const formData = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});
const $q = useQuasar();
const loading = ref(false);
const phoneValidation = helpers.regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
const rules = {
  email: { required, email },
  name: { required },
  message: { required },
  phone: { required, phoneValidation: helpers.withMessage('Nomor handphone tidak valid', phoneValidation) },
}
const $v = useVuelidate(rules, formData.value)

const onSubmit = async () => {
  if (!$v.value.$invalid) {
    loading.value = true;
    try {
      await api.post('contact-us', formData.value);
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
      formData.value.email = '';
      formData.value.message = '';
      formData.value.name = '';
      formData.value.phone = '';
      $v.value.$reset();
      $q.notify({
        message: 'Berhasil terkirim',
        color: 'green'
      })
    }
  } else {
    $v.value.$touch();
  }
}
</script>
<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-md-8">
        <div class="text-h3 text-center q-mb-md">Contact</div>
        <p class="text-body1">
          Kami senang Anda tertarik dengan pekerjaan sambilan untuk mahasiswa. Jika Anda memiliki pertanyaan, saran, atau
          ingin mendapatkan informasi lebih lanjut mengenai pekerjaan sambilan yang tersedia, jangan ragu untuk
          menghubungi
          kami. Tim kami akan dengan senang hati membantu Anda. Ada beberapa cara untuk menghubungi kami:
        </p>
        <q-form @submit="onSubmit">
          <q-input filled v-model="formData.email" label="Email" lazy-rules :error="$v.email.$error"
            :error-message="$v.email.$errors.map((e) => e.$message).join()" @input="$v.email.$touch" bottom-slots
            @blur="$v.email.$touch" />
          <q-input filled v-model="formData.name" label="Nama" lazy-rules :error="$v.name.$error"
            :error-message="$v.name.$errors.map((e) => e.$message).join()" @input="$v.name.$touch"
            @blur="$v.name.$touch" />
          <q-input filled v-model="formData.phone" label="No Handphone" lazy-rules :error="$v.phone.$error"
            :error-message="$v.phone.$errors.map((e) => e.$message).join()" @input="$v.phone.$touch"
            @blur="$v.phone.$touch" />
          <q-input filled v-model="formData.message" label="Pesan" lazy-rules :error="$v.message.$error" autogrow
            :error-message="$v.message.$errors.map((e) => e.$message).join()" @input="$v.message.$touch"
            @blur="$v.message.$touch" />
          <q-btn type="submit" color="primary" :loading="loading">Kirim</q-btn>
        </q-form>
      </div>
    </div>
  </div>
  <div class="row justify-center text-center">
    <div class="col-md-4">
      <p>
        <a href="mailto:learnout@gmail.com" class="text-black"><q-btn icon="fa-solid fa-envelope" flat><span
              class="q-ml-md"></span>Email:
            Learnout@gmail.com</q-btn></a>
      </p>
    </div>
    <div class="col-md-4">
      <p>
        <a href="https://wa.me/+6281334388233" target="_blank" class="text-black"><q-btn icon="fa-brands fa-whatsapp"
            flat><span class="q-ml-md"></span>Whatsapp:
            081334388233</q-btn></a>
      </p>
    </div>
    <div class="col-md-4">
      <p>
        <a href="https://www.instagram.com/raflisetiawan6/" target="_blank" class="text-black"><q-btn
            icon="fa-brands fa-instagram" flat><span class="q-ml-md"></span>Instagram:
            learnout.my.id</q-btn></a>
      </p>
    </div>
  </div>
  <div class="row q-pa-md">
    <div class="col-md-8">
      <div class="q-mt-md">
        <p class="text-body1">
          Kami berkomitmen untuk memberikan informasi yang akurat dan relevan tentang pekerjaan sambilan yang sesuai
          untuk mahasiswa. Kami siap membantu Anda dalam menemukan peluang pekerjaan yang cocok dengan minat,
          kemampuan, dan jadwal Anda. Terima kasih telah mengunjungi Learnout.my.id. Kami berharap dapat membantu Anda
          dalam menemukan pekerjaan sambilan yang memenuhi kebutuhan Anda sebagai mahasiswa.
        </p>
      </div>
    </div>
  </div>
</template>
