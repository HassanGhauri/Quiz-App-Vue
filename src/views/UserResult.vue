
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

<style scoped>

.results-page {

    min-height: 100vh;

    background: #f8fffb;

    padding: 40px;
}

.hero {

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 35px;
}

.hero h1 {

    color: #067647;

    font-size: 40px;

    font-weight: 800;

    margin: 0;
}

.hero p {

    color: #667085;

    margin-top: 8px;

    font-size: 17px;
}

:deep(.p-datatable) {

    background: white;

    border-radius: 18px;

    overflow: hidden;

    border: 1px solid #d7f5e5;

    box-shadow: 0 10px 30px rgba(0,0,0,.06);
}

:deep(.p-datatable-header) {

    background: white;

    border-bottom: 1px solid #e4f4ea;
}

:deep(.p-datatable-thead > tr > th) {

    background: #067647;

    color: white;

    font-weight: 700;

    padding: 16px;

    border: none;
}

:deep(.p-datatable-tbody > tr) {

    transition: .25s;
}

:deep(.p-datatable-tbody > tr:hover) {

    background: #f2fff7;
}

:deep(.p-datatable-tbody > tr > td) {

    padding: 16px;

    color: #344054;

    border-bottom: 1px solid #eef4ef;
}

:deep(.p-paginator) {

    border-top: 1px solid #eef4ef;

    background: white;
}

:deep(.p-tag-success) {

    background: #12b76a;

    color: white;
}

:deep(.p-tag-danger) {

    background: #ef4444;

    color: white;
}

:deep(.p-button-info) {

    background: #12b76a;

    border-color: #12b76a;
}

:deep(.p-button-info:hover) {

    background: #067647;

    border-color: #067647;
}

:deep(.p-button-outlined) {

    color: #067647;

    border-color: #067647;
}

:deep(.p-button-outlined:hover) {

    background: #067647;

    color: white;
}

:deep(.p-paginator-page.p-paginator-page-selected) {

    background: #12b76a;

    color: white;
}

:deep(.p-paginator-page:hover) {

    background: #ecfdf3;
}

:deep(.p-column-title) {

    font-weight: 700;
}

</style>