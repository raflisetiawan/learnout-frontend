<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const text = ref();
const router = useRouter();

const onSubmit = async () => {
  router.push({ path: '/job', query: { keyword: text.value } });
}
</script>

<template>
  <q-form @submit="onSubmit" class="q-mt-md">
    <q-input outlined bottom-slots v-model="text" label="Cari pekerjaan" counter maxlength="12" dense>
      <template v-slot:append>
        <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
        <q-icon name="search" />
      </template>
    </q-input>
  </q-form>
</template>
