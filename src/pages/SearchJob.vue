<script setup lang="ts">
import { ref } from 'vue';

const text = ref();
</script>

<template>
  <q-input outlined bottom-slots v-model="text" label="Cari pekerjaan" counter maxlength="12" dense>

    <template v-slot:append>
      <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
      <q-icon name="search" />
    </template>
  </q-input>
</template>
