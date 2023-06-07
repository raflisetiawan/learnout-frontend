<script setup lang="ts">
import CompanyProfileLayout from 'src/pages/company_profile/IndexPage.vue';
import isAuthenticated from 'src/utils/isAuthenticated';
import HomePage from './HomePage.vue';
</script>

<template>
  <CompanyProfileLayout v-if="!isAuthenticated()" />
  <HomePage v-else />
</template>
