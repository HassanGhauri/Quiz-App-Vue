<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QuizService from '@/services/quiz.service'
import { useRouter } from 'vue-router'
import { useDialog } from 'primevue/usedialog'
import QuizDialog from '@/components/dialogs/QuizDialog.vue'
interface Quiz {
  id: number
  title: string
  total_time: number
  passing_marks: number
  created_at: string
}

const quizzes = ref<Quiz[]>([])
const loading = ref(false)

const loadQuizzes = async () => {
  try {
    loading.value = true

    const response = await QuizService.getQuizzes()

    quizzes.value = response.data.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const router = useRouter()
const dialog = useDialog()

const openEditQuizDialog = (quiz: Quiz) => {
  dialog.open(QuizDialog, {
    data: {
      quiz,
    },

    props: {
      header: 'Edit Quiz',
      modal: true,
      style: {
        width: '85rem',
      },
      closable: true,
      dismissableMask: true,
    },

    onClose: (options) => {
      if (options?.data?.saved) {
        loadQuizzes()
      }
    },
  })
}

const openAddQuizDialog = () => {
  dialog.open(QuizDialog, {
    props: {
      header: 'Create Quiz',
      modal: true,
      style: {
        width: '55rem',
      },
      closable: true,
      dismissableMask: true,
    },

    onClose: (options) => {
      if (options?.data?.saved) {
        loadQuizzes()
      }
    },
  })
}

const startQuiz = (quizId: number) => {
  router.push({
    name: 'Quiz',
    params: {
      id: quizId,
    },
  })
}
onMounted(() => {
  loadQuizzes()
})
</script>

<template>
  <div class="home-page">

    <div class="hero">

      <div>
        <h1>Quizzes</h1>

        <p>
          Manage and participate in available quizzes.
        </p>
      </div>

      <div class="hero-buttons">

        <Button icon="pi pi-plus" label="Add Quiz" class="add-btn" @click="openAddQuizDialog" />

        <Button icon="pi pi-refresh" label="Refresh" severity="secondary" outlined @click="loadQuizzes" />

      </div>

    </div>

    <ProgressSpinner v-if="loading" class="spinner" />

    <div v-else class="quiz-grid">

      <Card v-for="quiz in quizzes" :key="quiz.id" class="quiz-card">

        <template #title>

          {{ quiz.title }}

        </template>

        <template #content>

          <div class="quiz-info">

            <div class="info-row">

              <i class="pi pi-clock"></i>

              <span>{{ quiz.total_time }} Minutes</span>

            </div>

            <div class="info-row">

              <i class="pi pi-check-circle"></i>

              <span>Passing Marks : {{ quiz.passing_marks }}</span>

            </div>

            <div class="info-row">

              <i class="pi pi-calendar"></i>

              <span>
                {{ new Date(quiz.created_at).toLocaleDateString() }}
              </span>

            </div>

          </div>

        </template>

        <template #footer>

          <div class="card-buttons">

            <Button label="Start" icon="pi pi-play" class="start-btn" @click="startQuiz(quiz.id)" />

            <Button label="Edit" icon="pi pi-pencil" severity="warning" outlined @click="openEditQuizDialog(quiz)" />

          </div>

        </template>

      </Card>

    </div>

    <div v-if="!loading && quizzes.length === 0" class="empty-state">

      <i class="pi pi-book"></i>

      <h2>No quizzes available</h2>

      <p>Create a quiz from Laravel and it will appear here.</p>

    </div>

  </div>
</template>

<style scoped>
.home-page {

  min-height: 100vh;

  background: #f8fffb;

  padding: 50px;
}

.hero {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 40px;
}

.hero h1 {

  color: #067647;

  font-size: 42px;

  font-weight: 800;
}

.hero p {

  margin-top: 10px;

  color: #667085;

  font-size: 18px;
}

.quiz-grid {

  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));

  gap: 30px;
}

.quiz-card {

  border-radius: 25px;

  transition: .35s;

  border: 1px solid #d7f5e5;

  box-shadow: 0 12px 35px rgba(0, 0, 0, .05);
}

.quiz-card:hover {

  transform: translateY(-8px);

  box-shadow: 0 18px 45px rgba(18, 183, 106, .18);
}

.quiz-info {

  display: flex;

  flex-direction: column;

  gap: 18px;

  margin-top: 10px;
}

.info-row {

  display: flex;

  align-items: center;

  gap: 12px;

  color: #344054;

  font-size: 15px;
}

.info-row i {

  color: #12b76a;

  font-size: 18px;
}

.start-btn {

  width: 100%;

  background: #12b76a;

  border: none;
}

.spinner {

  display: block;

  margin: auto;

  margin-top: 120px;
}

.empty-state {

  text-align: center;

  margin-top: 100px;
}

.empty-state i {

  font-size: 80px;

  color: #12b76a;
}

.empty-state h2 {

  margin-top: 20px;

  color: #067647;
}

.empty-state p {

  color: #667085;

  margin-top: 10px;
}

:deep(.p-card-title) {

  color: #067647;

  font-size: 24px;

  font-weight: 700;
}

:deep(.p-card) {

  background: white;
}

.hero-buttons {

  display: flex;

  gap: 15px;

  align-items: center;
}

.add-btn {

  background: linear-gradient(90deg, #067647, #12b76a);

  border: none;

  color: white;
}

.add-btn:hover {

  background: linear-gradient(90deg, #055d39, #0fa15d);
}

.card-buttons {

  display: flex;

  gap: 12px;
}

.card-buttons .p-button {

  flex: 1;
}
</style>