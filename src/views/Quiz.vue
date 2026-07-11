<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import McqService from '@/services/mcq.service'

const route = useRoute()

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

const loadQuiz = async () => {
  try {
    loading.value = true

    const response = await McqService.getQuizMcqs(quizId)

    quiz.value = response.data.quiz

    questions.value = response.data.data
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

const finishQuiz = () => {
  answers.value[currentQuestion.value.id] = selectedAnswer.value

  console.log('Submitted Answers')

  console.log(answers.value)

  alert('Quiz Finished!')
}

onMounted(loadQuiz)
</script>

<template>
  <div class="quiz-page">

    <ProgressSpinner v-if="loading" />

    <div
      v-else
      class="quiz-container"
    >

      <Card>

        <template #title>

          {{ quiz?.title }}

        </template>

        <template #subtitle>

          Question {{ currentQuestionIndex + 1 }}

          /

          {{ questions.length }}

        </template>

        <template #content>

          <ProgressBar
            :value="progress"
            class="mb-4"
          />

          <h2 class="question">

            {{ currentQuestion.question }}

          </h2>

          <div
            v-for="choice in currentQuestion.choices"
            :key="choice.choice"
            class="choice"
          >

            <RadioButton
              v-model="selectedAnswer"
              :inputId="choice.choice"
              :value="choice.choice"
            />

            <label :for="choice.choice">

              {{ choice.choice }}

            </label>

          </div>

        </template>

        <template #footer>

          <div class="footer-buttons">

            <Button
              label="Previous"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              @click="previousQuestion"
              :disabled="currentQuestionIndex === 0"
            />

            <Button
              v-if="currentQuestionIndex < questions.length - 1"
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="nextQuestion"
            />

            <Button
              v-else
              label="Finish"
              icon="pi pi-check"
              severity="success"
              @click="finishQuiz"
            />

          </div>

        </template>

      </Card>

    </div>

  </div>
</template>

<style scoped>

.quiz-page{

    min-height:100vh;

    background:#f8fffb;

    display:flex;

    justify-content:center;

    align-items:center;

    padding:50px;
}

.quiz-container{

    width:100%;

    max-width:900px;
}

.question{

    font-size:28px;

    color:#067647;

    margin-bottom:35px;
}

.choice{

    display:flex;

    align-items:center;

    gap:15px;

    padding:18px;

    border:1px solid #d7f5e5;

    border-radius:14px;

    margin-bottom:18px;

    cursor:pointer;

    transition:.25s;
}

.choice:hover{

    background:#effff5;
}

.choice label{

    cursor:pointer;

    width:100%;

    font-size:17px;
}

.footer-buttons{

    display:flex;

    justify-content:space-between;
}

:deep(.p-card){

    border-radius:20px;

    box-shadow:0 15px 45px rgba(0,0,0,.08);
}

</style>