<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import crescent from '@/assets/Crescent.png'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<template>
  <header class="topbar">
    <div class="logo-section">
      <img
        :src="crescent"
        class="logo"
        alt="Crescent Logo"
      />

      <div class="title-section">
        <h2>Crescent Quizzes</h2>
        <span>Learning Made Better</span>
      </div>
    </div>

    <Button
      icon="pi pi-sign-out"
      severity="danger"
      text
      rounded
      class="logout-btn"
      @click="logout"
    />
  </header>
</template>

<style scoped>
.topbar {
  height: 80px;
  background: white;
  border-bottom: 3px solid #067647;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 35px;
  box-shadow: 0 3px 10px rgba(0,0,0,.05);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 50px;
}

.title-section h2 {
  color: #067647;
  font-size: 24px;
  margin: 0;
}

.title-section span {
  color: #667085;
  font-size: 13px;
}

.logout-btn {
  color: #067647 !important;
}

.logout-btn:hover {
  background: #067647 !important;
  color: white !important;
}
</style>