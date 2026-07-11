<script setup lang="ts">
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue';
</script>

<template>
    <Header />
    <Navbar/>

    <main class="main-content">
        <RouterView />
    </main>
</template>

<style scoped>
.main-content{
    min-height: calc(100vh - 80px);
    background:#f8fffb;
}
</style>