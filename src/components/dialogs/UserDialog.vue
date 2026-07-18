<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { inject, ref } from 'vue'
import UserService from '@/services/user.service'

const dialogRef: any = inject('dialogRef')

const loading = ref(false)
const isEdit = ref(false)

const roles = [
  { label: 'Admin', value: 'Admin' },
  { label: 'User', value: 'User' }
]

const user = ref({
  id: 0,
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: '',
})

// Edit Mode
if (dialogRef?.value?.data?.user) {
  isEdit.value = true

  user.value = {
    ...dialogRef.value.data.user,
    password: '',
  }
}

const saveUser = async () => {
  try {
    loading.value = true

    if (isEdit.value) {
      const payload: any = {
        first_name: user.value.first_name,
        last_name: user.value.last_name,
        email: user.value.email,
        role: user.value.role,
      }

      // Only send password if entered
      if (user.value.password.trim() !== '') {
        payload.password = user.value.password
      }

      await UserService.updateUser(user.value.id, payload)
    } else {
      await UserService.createUser({
        first_name: user.value.first_name,
        last_name: user.value.last_name,
        email: user.value.email,
        password: user.value.password,
        role: user.value.role,
      })
    }

    dialogRef.value.close({
      saved: true,
    })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="dialog-container">

    <h2>
      {{ isEdit ? 'Edit User' : 'Add User' }}
    </h2>

    <div class="form-grid">

      <div class="field">

        <label>First Name</label>

        <InputText
          v-model="user.first_name"
          fluid
        />

      </div>

      <div class="field">

        <label>Last Name</label>

        <InputText
          v-model="user.last_name"
          fluid
        />

      </div>

      <div class="field full-width">

        <label>Email</label>

        <InputText
          v-model="user.email"
          fluid
        />

      </div>

      <div class="field">

        <label>
          {{ isEdit ? 'New Password (Optional)' : 'Password' }}
        </label>

        <Password
          v-model="user.password"
          :feedback="false"
          toggleMask
          fluid
        />

      </div>

      <div class="field">

        <label>Role</label>

        <Select
          v-model="user.role"
          :options="roles"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Role"
          fluid
        />

      </div>

    </div>

    <Button
      class="save-btn"
      :loading="loading"
      :label="isEdit ? 'Update User' : 'Create User'"
      icon="pi pi-check"
      @click="saveUser"
    />

  </div>
</template>

<style scoped>

.dialog-container{

    display:flex;

    flex-direction:column;

    gap:24px;

    padding:12px;
}

h2{

    color:#067647;

    text-align:center;

    margin-bottom:5px;
}

.form-grid{

    display:grid;

    grid-template-columns:1fr 1fr;

    gap:20px;
}

.field{

    display:flex;

    flex-direction:column;

    gap:8px;
}

.full-width{

    grid-column:1 / -1;
}

label{

    font-weight:600;

    color:#344054;
}

.save-btn{

    margin-top:10px;

    background:#12b76a;

    border:none;

    width:100%;
}

:deep(.p-inputtext),
:deep(.p-password-input),
:deep(.p-select){

    width:100%;
}

</style>