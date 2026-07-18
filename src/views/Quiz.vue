<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import McqService from '@/services/mcq.service'
import resultService from '@/services/result.service'
import router from '@/routes'
import { onUnmounted } from 'vue'
const route = useRoute()
const reviewMode = ref(false)
const timeLeft = ref(0) // seconds remaining

let timer: number | null = null
const result = computed(() => {
  let correct = 0

  const details = questions.value.map(question => {

    const selected = answers.value[question.id]

    const correctChoice = question.choices.find(
      c => c.is_correct
    )?.choice

    const isCorrect = selected === correctChoice

    if (isCorrect) correct++

    return {
      id: question.id,
      question: question.question,
      selected,
      correctAnswer: correctChoice,
      correct: isCorrect
    }
  })

  const percentage =
    questions.value.length === 0
      ? 0
      : (correct / questions.value.length) * 100

  return {
    correct,
    wrong: questions.value.length - correct,
    percentage,
    details
  }
})

const showResult = () => {
  answers.value[currentQuestion.value.id] = selectedAnswer.value

  reviewMode.value = true
}

const quizId = Number(route.params.id)

interface Choice {
  choice: string
  is_correct: boolean
}

interface Mcq {
  id: number
  question: string
  choices: Choice[]
}

interface Quiz {
  id: number
  title: string
  total_time: number
  passing_marks: number
}

const loading = ref(true)

const quiz = ref<Quiz | null>(null)

const questions = ref<Mcq[]>([])

const currentQuestionIndex = ref(0)

const answers = ref<Record<number, string>>({})

const selectedAnswer = ref('')

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value]
})

const progress = computed(() => {
  if (questions.value.length === 0) return 0

  return ((currentQuestionIndex.value + 1) / questions.value.length) * 100
})
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
})

const timeTaken = computed(() => {
  const totalSeconds = (quiz.value?.total_time ?? 0) * 60

  return totalSeconds - timeLeft.value
})
const loadQuiz = async () => {
  try {
    loading.value = true

    const response = await McqService.getQuizMcqs(quizId)

    quiz.value = response.data.quiz

    questions.value = response.data.data
    // convert minutes to seconds
    timeLeft.value = (quiz.value?.total_time ?? 0) * 60

    timer = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        if (timer) {
          clearInterval(timer)
        }

        finishQuiz()
      }
    }, 1000)
  } finally {
    loading.value = false
  }
}

const nextQuestion = () => {
  answers.value[currentQuestion.value.id] = selectedAnswer.value

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++

    selectedAnswer.value =
      answers.value[currentQuestion.value.id] || ''
  }
}

const previousQuestion = () => {
  answers.value[currentQuestion.value.id] = selectedAnswer.value

  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--

    selectedAnswer.value =
      answers.value[currentQuestion.value.id] || ''
  }
}

const finishQuiz = async () => {
  if (timer) {
    clearInterval(timer)
  }
  const payload = {
    user_id: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!).id
      : 1,

    quiz_id: quizId,

    answers: result.value.details.map(q => ({
      question_id: q.id,
      question: q.question,
      correct: q.correct
    })),

    percentage: result.value.percentage,

    passed:
      result.value.percentage >=
      (quiz.value?.passing_marks ?? 0),

    time_taken: timeTaken.value,
  }

  await resultService.createResult(payload)

  router.push('/home')
}

onMounted(loadQuiz)

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="quiz-page">

    <ProgressSpinner v-if="loading" />

    <div v-else class="quiz-container">

      <!-- ================= QUIZ SCREEN ================= -->

      <Card v-if="!reviewMode">

        <template #title>

          <div class="title-row">

            <span>{{ quiz?.title }}</span>

            <div class="timer">

              <i class="pi pi-clock"></i>

              {{ formattedTime }}

            </div>

          </div>

        </template>
        <template #subtitle>
          Question {{ currentQuestionIndex + 1 }}
          /
          {{ questions.length }}
        </template>

        <template #content>

          <ProgressBar :value="progress" class="mb-4" />

          <h2 class="question">
            {{ currentQuestion.question }}
          </h2>

          <div v-for="choice in currentQuestion.choices" :key="choice.choice" class="choice">

            <RadioButton v-model="selectedAnswer" :inputId="choice.choice" :value="choice.choice" />

            <label :for="choice.choice">
              {{ choice.choice }}
            </label>

          </div>

        </template>

        <template #footer>

          <div class="footer-buttons">

            <Button label="Previous" icon="pi pi-arrow-left" severity="secondary" outlined @click="previousQuestion"
              :disabled="currentQuestionIndex === 0" />

            <Button v-if="currentQuestionIndex < questions.length - 1" label="Next" icon="pi pi-arrow-right"
              iconPos="right" @click="nextQuestion" />

            <Button v-else label="Review Result" icon="pi pi-eye" severity="success" @click="showResult" />

          </div>

        </template>

      </Card>

      <!-- ================= RESULT SCREEN ================= -->

      <Card v-else>

        <template #title>
          Quiz Result
        </template>

        <template #content>

          <div class="summary">

            <div class="summary-card">
              <h4>Total Questions</h4>
              <span>{{ questions.length }}</span>
            </div>

            <div class="summary-card">
              <h4>Correct</h4>
              <span>{{ result.correct }}</span>
            </div>

            <div class="summary-card">
              <h4>Wrong</h4>
              <span>{{ result.wrong }}</span>
            </div>

            <div class="summary-card">
              <h4>Percentage</h4>
              <span>{{ result.percentage.toFixed(1) }}%</span>
            </div>

          </div>

          <Divider />

          <div v-for="item in result.details" :key="item.id" class="result-item">

            <h3>{{ item.question }}</h3>

            <p>
              <strong>Your Answer:</strong>
              {{ item.selected || 'Not Answered' }}
            </p>

            <p>
              <strong>Correct Answer:</strong>
              {{ item.correctAnswer }}
            </p>

            <Tag :value="item.correct ? 'Correct' : 'Wrong'" :severity="item.correct ? 'success' : 'danger'" />

          </div>

        </template>

        <template #footer>

          <Button label="End Exam" icon="pi pi-check" severity="success" @click="finishQuiz" />

        </template>

      </Card>

    </div>

  </div>
</template>

<style scoped>
.title-row {

  display: flex;

  justify-content: space-between;

  align-items: center;

  width: 100%;
}

.timer {

  display: flex;

  align-items: center;

  gap: 8px;

  padding: 8px 14px;

  background: #ecfdf3;

  color: #067647;

  border: 1px solid #b7ebc6;

  border-radius: 30px;

  font-size: 15px;

  font-weight: 700;
}

.timer i {

  font-size: 15px;
}

.quiz-page {

  min-height: 100vh;

  background: #f8fffb;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 50px;
}

.quiz-container {

  width: 100%;

  max-width: 900px;
}

.question {

  font-size: 28px;

  color: #067647;

  margin-bottom: 35px;
}

.choice {

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 18px;

  border: 1px solid #d7f5e5;

  border-radius: 14px;

  margin-bottom: 18px;

  cursor: pointer;

  transition: .25s;
}

.choice:hover {

  background: #effff5;
}

.choice label {

  cursor: pointer;

  width: 100%;

  font-size: 17px;
}

.footer-buttons {

  display: flex;

  justify-content: space-between;
}

:deep(.p-card) {

  border-radius: 20px;

  box-shadow: 0 15px 45px rgba(0, 0, 0, .08);
}
</style>