
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ResultService from '@/services/result.service'
import { useDialog } from 'primevue/usedialog'
import ResultDialog from '@/components/dialogs/ResultDialog.vue'

const dialog = useDialog()

const loading = ref(false)
const results = ref([])

const loadResults = async () => {
  loading.value = true

  try {
    const response = await ResultService.getResults()

    results.value = response.data.data
  } finally {
    loading.value = false
  }
}

const viewResult = (result: any) => {
  dialog.open(ResultDialog, {
    data: {
      result,
    },

    props: {
      header: 'Quiz Result',
      modal: true,
      style: {
        width: '70rem',
      },
    },
  })
}

onMounted(loadResults)
</script>

<template>
  <div class="results-page">

    <div class="hero">

      <div>
        <h1>User Results</h1>
        <p>View every user's quiz attempts.</p>
      </div>

      <Button
        icon="pi pi-refresh"
        label="Refresh"
        @click="loadResults"
      />

    </div>

    <DataTable
      :value="results"
      :loading="loading"
      paginator
      :rows="10"
      stripedRows
    >

      <Column
        header="User"
      >
        <template #body="{ data }">
          {{ data.user.first_name }} {{ data.user.last_name }}
        </template>
      </Column>

      <Column
        field="quiz.title"
        header="Quiz"
      />

      <Column
        field="percentage"
        header="Score"
      >
        <template #body="{ data }">
          {{ data.percentage }}%
        </template>
      </Column>

      <Column
        header="Status"
      >
        <template #body="{ data }">

          <Tag
            :value="data.passed ? 'Passed' : 'Failed'"
            :severity="data.passed ? 'success' : 'danger'"
          />

        </template>
      </Column>

      <Column
        field="time_taken"
        header="Time"
      >
        <template #body="{ data }">
          {{ data.time_taken }} sec
        </template>
      </Column>

      <Column
        header="Action"
        style="width:130px"
      >
        <template #body="{ data }">

          <Button
            icon="pi pi-eye"
            label="View"
            severity="info"
            @click="viewResult(data)"
          />

        </template>
      </Column>

    </DataTable>

  </div>
</template>