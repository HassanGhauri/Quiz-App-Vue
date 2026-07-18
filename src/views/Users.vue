<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserService from '@/services/user.service'
import { useDialog } from 'primevue/usedialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import UserDialog from '@/components/dialogs/UserDialog.vue'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
}

const users = ref<User[]>([])
const loading = ref(false)

const dialog = useDialog()
const confirm = useConfirm()
const toast = useToast()

const loadUsers = async () => {
  try {
    loading.value = true

    const response = await UserService.getUsers()

    users.value = response.data.data
  } finally {
    loading.value = false
  }
}

const openAddUserDialog = () => {
  dialog.open(UserDialog, {
    props: {
      header: 'Add User',
      modal: true,
      style: {
        width: '45rem',
      },
    },

    onClose: (options) => {
      if (options?.data?.saved) {
        loadUsers()
      }
    },
  })
}

const openEditUserDialog = (user: User) => {
  dialog.open(UserDialog, {
    data: {
      user,
    },

    props: {
      header: 'Edit User',
      modal: true,
      style: {
        width: '45rem',
      },
    },

    onClose: (options) => {
      if (options?.data?.saved) {
        loadUsers()
      }
    },
  })
}

const deleteUser = (event: Event, user: User) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,

    message: `Delete ${user.first_name} ${user.last_name}?`,

    header: 'Delete User',

    icon: 'pi pi-trash',

    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },

    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },

    accept: async () => {
      await UserService.deleteUser(user.id)

      toast.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'User deleted successfully.',
        life: 3000,
      })

      loadUsers()
    },
  })
}

onMounted(loadUsers)
</script>

<template>
  <div class="users-page">

    <div class="hero">

      <div>
        <h1>Users</h1>
        <p>Manage application users.</p>
      </div>

      <div class="hero-buttons">

        <Button
          icon="pi pi-plus"
          label="Add User"
          class="add-btn"
          @click="openAddUserDialog"
        />

        <Button
          icon="pi pi-refresh"
          outlined
          severity="secondary"
          @click="loadUsers"
        />

      </div>

    </div>

    <ProgressSpinner
      v-if="loading"
      class="spinner"
    />

    <div
      v-else
      class="user-grid"
    >

      <Card
        v-for="user in users"
        :key="user.id"
        class="user-card"
      >

        <template #title>

          {{ user.first_name }} {{ user.last_name }}

        </template>

        <template #content>

          <div class="user-info">

            <div class="info-row">
              <i class="pi pi-envelope"></i>
              <span>{{ user.email }}</span>
            </div>

            <div class="info-row">
              <i class="pi pi-user"></i>

              <Tag
                :value="user.role"
                severity="success"
              />
            </div>

          </div>

        </template>

        <template #footer>

          <div class="card-buttons">

            <Button
              icon="pi pi-pencil"
              rounded
              severity="warning"
              outlined
              @click="openEditUserDialog(user)"
            />

            <Button
              icon="pi pi-trash"
              rounded
              severity="danger"
              outlined
              @click="deleteUser($event, user)"
            />

          </div>

        </template>

      </Card>

    </div>

  </div>
</template>

<style scoped>

.users-page{
    min-height:100vh;
    padding:50px;
    background:#f8fffb;
}

.hero{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:40px;
}

.hero h1{
    color:#067647;
    font-size:42px;
    font-weight:800;
}

.hero p{
    color:#667085;
}

.hero-buttons{
    display:flex;
    gap:15px;
}

.add-btn{
    background:linear-gradient(90deg,#067647,#12b76a);
    border:none;
}

.user-grid{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
    gap:30px;
}

.user-card{
    border-radius:20px;
    border:1px solid #d7f5e5;
    transition:.3s;
}

.user-card:hover{
    transform:translateY(-5px);
    box-shadow:0 15px 35px rgba(18,183,106,.18);
}

.user-info{
    display:flex;
    flex-direction:column;
    gap:18px;
}

.info-row{
    display:flex;
    align-items:center;
    gap:10px;
}

.info-row i{
    color:#12b76a;
}

.card-buttons{
    display:flex;
    justify-content:center;
    gap:12px;
}

.spinner{
    display:block;
    margin:80px auto;
}

:deep(.p-card-title){
    color:#067647;
    font-size:22px;
}

:deep(.p-card){
    background:white;
}

</style>