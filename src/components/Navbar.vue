<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/home',
  },
  {
    label: 'Quizzes',
    icon: 'pi pi-book',
    to: '/quizzes',
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    to: '/settings',
  },
  {
    label: 'User Results',
    icon: 'pi pi-chart-line',
    to: '/user-results',
  },
  {
    label: 'Users',
    icon: 'pi pi-users',
    to: '/users',
  },
  {
    label: 'Profile',
    icon: 'pi pi-user',
    to: '/profile',
  },
])
</script>

<template>
  <nav class="navbar">
    <RouterLink
      v-for="item in items"
      :key="item.label"
      :to="item.to"
      class="nav-item"
      active-class="active-nav"
    >
      <i :class="item.icon"></i>

      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.navbar {
  height: 58px;

  background: white;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 35px;

  padding: 0 30px;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-item {
  display: flex;

  align-items: center;

  gap: 8px;

  height: 100%;

  padding: 0 18px;

  text-decoration: none;

  color: #475467;

  font-size: 15px;

  font-weight: 600;

  transition: all .25s ease;

  border-bottom: 3px solid transparent;
}

.nav-item i {
  font-size: 16px;
}

.nav-item:hover {
  color: #067647;

  background: #f3fff8;
}

.active-nav {
  color: #067647;

  border-bottom-color: #067647;

  background: #f5fff9;
}
</style>