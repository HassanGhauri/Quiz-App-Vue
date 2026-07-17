<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { inject, ref } from 'vue'
import QuizService from '@/services/quiz.service'
import { onMounted } from 'vue'
import McqService from '@/services/mcq.service'
import { useDialog } from 'primevue/usedialog'
import McqDialog from './McqDialog.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const confirm = useConfirm()
const toast = useToast()
const dialogRef: any = inject('dialogRef')

const loading = ref(false)
const isEdit = ref(false)
interface Mcq {
  id: number
  question: string
  enable: boolean
}
const mcqs = ref<Mcq[]>([])

const confirmDeleteMcq = (
  event: Event,
  mcq: Mcq,
) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,

    message: 'Are you sure you want to delete this MCQ?',

    header: 'Delete MCQ',

    icon: 'pi pi-exclamation-triangle',

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
      try {
        await McqService.deleteMcq(mcq.id)

        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'MCQ deleted successfully.',
          life: 3000,
        })

        loadMcqs()
      } catch (error) {
        console.error(error)

        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to delete MCQ.',
          life: 3000,
        })
      }
    },
  })
}

const loadMcqs = async () => {
  if (!isEdit.value) return

  try {
    const response = await McqService.getQuizMcqs(
      quiz.value.id
    )

    mcqs.value = response.data.data
  } catch (err) {
    console.error(err)
  }
}
const quiz = ref({
  id: 0,
  title: '',
  total_time: 0,
  passing_marks: 0,
})

// Check if dialog was opened in edit mode
if (dialogRef?.value?.data?.quiz) {
  isEdit.value = true

  quiz.value = {
    ...dialogRef.value.data.quiz,
  }
}
onMounted(() => {
  loadMcqs()
})
const dialog = useDialog()
const openAddMcqDialog = () => {
  dialog.open(McqDialog, {
    data: {
      quizId: quiz.value.id,
    },

    props: {
      header: 'Add MCQ',
      modal: true,
      style: {
        width: '60rem',
      },
    },

    onClose: (options) => {
      if (options?.data?.saved) {
        loadMcqs()
      }
    },
  })
}

const openEditMcqDialog = (mcq: Mcq) => {
  dialog.open(McqDialog, {
    data: {
      quizId: quiz.value.id,
      mcq,
    },

    props: {
      header: 'Edit MCQ',
      modal: true,
      style: {
        width: '60rem',
      },
    },

    onClose: (options) => {
      if (options?.data?.saved) {
        loadMcqs()
      }
    },
  })
}
const saveQuiz = async () => {
  try {
    loading.value = true

    if (isEdit.value) {
      await QuizService.updateQuiz(
        quiz.value.id,
        quiz.value,
      )
    } else {
      await QuizService.createQuiz(quiz.value)
    }

    // Close dialog and notify parent
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
  <Toast />
  <ConfirmPopup />
  <div class="dialog-container">

    <h2>
      {{ isEdit ? 'Edit Quiz' : 'Add Quiz' }}
    </h2>

    <div class="field">

      <label>Quiz Title</label>

      <InputText v-model="quiz.title" fluid />

    </div>

    <div class="field">

      <label>Total Time (Minutes)</label>

      <InputNumber v-model="quiz.total_time" fluid />

    </div>

    <div class="field">

      <label>Passing Marks</label>

      <InputNumber v-model="quiz.passing_marks" fluid />

    </div>

    <Button class="save-btn" :loading="loading" :label="isEdit ? 'Update Quiz' : 'Create Quiz'" icon="pi pi-check"
      @click="saveQuiz" />
    <div v-if="isEdit" class="mcq-section">
      <div class="mcq-header">

        <h3>MCQs</h3>

        <Button label="Add MCQ" icon="pi pi-plus" severity="success" @click="openAddMcqDialog" />

      </div>

      <DataTable :value="mcqs" stripedRows>

        <Column field="question" header="Question" />

        <Column header="Status">
          <template #body="{ data }">

            <Tag :value="data.enable ? 'Enabled' : 'Disabled'" :severity="data.enable ? 'success' : 'danger'" />

          </template>
        </Column>

        <Column header="Actions"  headerStyle="text-align:center; width:120px;">
          <template #body="{ data }">

            <div class="action-buttons">

              <Button icon="pi pi-pencil" severity="warning" rounded outlined v-tooltip.top="'Edit'"
                @click="openEditMcqDialog(data)" />

              <Button icon="pi pi-trash" severity="danger" rounded outlined v-tooltip.top="'Delete'"
                @click="confirmDeleteMcq($event, data)" />

            </div>

          </template>
        </Column>

      </DataTable>

    </div>
  </div>
</template>

<style scoped>
.dialog-container {

  display: flex;

  flex-direction: column;

  gap: 20px;

  padding: 10px;
}

h2 {

  color: #067647;

  text-align: center;
}

.field {

  display: flex;

  flex-direction: column;

  gap: 8px;
}

label {

  color: #344054;

  font-weight: 600;
}

.save-btn {

  margin-top: 10px;

  background: #12b76a;

  border: none;
}

.mcq-section {

  margin-top: 35px;

  border-top: 1px solid #e5e7eb;

  padding-top: 25px;
}

.mcq-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 20px;
}

.mcq-header h3 {

  color: #067647;

  font-size: 22px;

  font-weight: 700;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-buttons .p-button {
  width: 36px;
  height: 36px;
}
</style>