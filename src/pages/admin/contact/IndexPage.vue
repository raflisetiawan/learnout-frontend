<script setup lang="ts">
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';

const contacts = ref();
const bar = ref();
onMounted(async () => {
  try {
    bar.value.start()
    const response = await api.get('contact-us');
    contacts.value = response.data;
  } catch (error) {
    throw error;
  } finally {
    bar.value.stop();
  }
})
</script>
<template>
  <div class="q-pa-md">
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="row">
      <template v-for="contact in contacts" :key="contact.id">
        <div class="col-md-4 q-pa-sm">
          <q-card dark bordered class="bg-grey-9 my-card">
            <q-card-section>
              <div class="text-h6">{{ contact.name }}</div>
              <div class="text-subtitle2">{{ contact.email }}</div>
              <div class="text-caption">{{ contact.phone }}</div>
            </q-card-section>

            <q-separator dark inset />

            <q-card-section>
              {{ contact.message }}
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>
  </div>
</template>
