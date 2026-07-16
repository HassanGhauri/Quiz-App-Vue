<script setup lang="ts">
import Toast from 'primevue/toast'
import DynamicDialog from 'primevue/dynamicdialog'
</script>

<template>
  <RouterView />

  <!-- Global Toast -->
  <Toast />

  <!-- Global Dynamic Dialog -->
  <DynamicDialog />
</template>

<style>
body {
  margin: 0;
}
</style>