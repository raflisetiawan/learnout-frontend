<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const signout = async () => {
  api.get('signout')
    .then(() => {

      //remove localStorage
      localStorage.removeItem('signedIn')
      localStorage.removeItem('token')

      //redirect
      return router.push({ name: 'SignIn' });

    })
}
</script>
<template>
  <h1>Halo</h1>
  <button @click="signout">Sign out</button>
</template>
