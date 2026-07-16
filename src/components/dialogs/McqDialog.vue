<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">

import { inject, ref } from 'vue'

import McqService from '@/services/mcq.service'

const dialogRef: any = inject('dialogRef')

const loading = ref(false)

const isEdit = ref(false)

const mcq = ref({
  id: 0,
  quiz_id: dialogRef?.value?.data?.quizId,

  question: '',

  choices: [
    {
      choice: '',
      is_correct: true,
    },
    {
      choice: '',
      is_correct: false,
    },
  ],

  enable: true,
})

if (dialogRef?.value?.data?.mcq) {
  isEdit.value = true

  mcq.value = JSON.parse(
    JSON.stringify(dialogRef.value.data.mcq)
  )
}

/*
|--------------------------------------------------------------------------
| Choices
|--------------------------------------------------------------------------
*/

const addChoice = () => {
  mcq.value.choices.push({
    choice: '',
    is_correct: false,
  })
}

const removeChoice = (index: number) => {
  if (mcq.value.choices.length <= 2) {
    return
  }

  mcq.value.choices.splice(index, 1)

  // Ensure one option always remains correct
  if (!mcq.value.choices.some(c => c.is_correct)) {
    mcq.value.choices[0].is_correct = true
  }
}

const setCorrectChoice = (index: number) => {
  mcq.value.choices.forEach((choice, i) => {
    choice.is_correct = i === index
  })
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const validate = () => {
  if (!mcq.value.question.trim()) {
    alert('Question is required.')
    return false
  }

  if (mcq.value.choices.length < 2) {
    alert('At least two choices are required.')
    return false
  }

  const emptyChoice = mcq.value.choices.find(
    c => !c.choice.trim()
  )

  if (emptyChoice) {
    alert('Please fill all choices.')
    return false
  }

  const correctAnswers = mcq.value.choices.filter(
    c => c.is_correct
  )

  if (correctAnswers.length !== 1) {
    alert('Select exactly one correct answer.')
    return false
  }

  return true
}

/*
|--------------------------------------------------------------------------
| Save
|--------------------------------------------------------------------------
*/

const saveMcq = async () => {
  if (!validate()) return

  try {
    loading.value = true

    if (isEdit.value) {
      await McqService.updateMcq(
        mcq.value.id,
        mcq.value
      )
    } else {
      await McqService.createMcq(mcq.value)
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

    <div class="mcq-dialog">

        <!-- Question -->

        <div class="field">

            <label>Question</label>

            <Textarea
                v-model="mcq.question"
                rows="3"
                autoResize
                fluid
                placeholder="Enter the question..."
            />

        </div>

        <!-- Choices -->

        <div class="choices-header">

            <h3>Choices</h3>

            <Button
                icon="pi pi-plus"
                label="Add Choice"
                severity="success"
                @click="addChoice"
            />

        </div>

        <div
            v-for="(choice,index) in mcq.choices"
            :key="index"
            class="choice-card"
        >

            <div class="choice-left">

                <RadioButton
                    :modelValue="choice.is_correct"
                    :binary="true"
                    @click="setCorrectChoice(index)"
                />

                <InputText
                    v-model="choice.choice"
                    fluid
                    :placeholder="`Choice ${index+1}`"
                />

            </div>

            <Button
                icon="pi pi-trash"
                severity="danger"
                outlined
                rounded
                @click="removeChoice(index)"
                :disabled="mcq.choices.length<=2"
            />

        </div>

        <!-- Enable -->

        <div class="enable-row">

            <label>Enable Question</label>

            <ToggleSwitch
                v-model="mcq.enable"
            />

        </div>

        <!-- Buttons -->

        <div class="footer-buttons">

            <Button
                severity="secondary"
                outlined
                label="Cancel"
                icon="pi pi-times"
                @click="dialogRef.close()"
            />

            <Button
                :loading="loading"
                :label="isEdit ? 'Update MCQ' : 'Create MCQ'"
                icon="pi pi-check"
                severity="success"
                @click="saveMcq"
            />

        </div>

    </div>

</template>
<style scoped>
.mcq-dialog {

    display: flex;

    flex-direction: column;

    gap: 25px;

    padding: 10px;
}

/* ===========================
   Fields
=========================== */

.field {

    display: flex;

    flex-direction: column;

    gap: 8px;
}

.field label {

    font-weight: 600;

    color: #344054;

    font-size: 15px;
}

/* ===========================
   Choices Header
=========================== */

.choices-header {

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-top: 10px;
}

.choices-header h3 {

    color: #067647;

    font-size: 22px;

    font-weight: 700;
}

/* ===========================
   Choice Card
=========================== */

.choice-card {

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 16px;

    padding: 16px;

    border-radius: 16px;

    border: 1px solid #d7f5e5;

    background: #f8fffb;

    transition: .25s;
}

.choice-card:hover {

    border-color: #12b76a;

    box-shadow: 0 6px 20px rgba(18,183,106,.08);
}

.choice-left {

    flex: 1;

    display: flex;

    align-items: center;

    gap: 18px;
}

/* ===========================
   Enable
=========================== */

.enable-row {

    display: flex;

    justify-content: space-between;

    align-items: center;

    padding: 14px 18px;

    border-radius: 14px;

    background: #f8fffb;

    border: 1px solid #d7f5e5;
}

.enable-row label {

    font-weight: 600;

    color: #344054;
}

/* ===========================
   Footer Buttons
=========================== */

.footer-buttons {

    display: flex;

    justify-content: flex-end;

    gap: 15px;

    margin-top: 15px;
}

/* ===========================
   PrimeVue Overrides
=========================== */

:deep(.p-inputtext) {

    width: 100%;

    border-radius: 12px;
}

:deep(.p-inputnumber) {

    width: 100%;
}

:deep(.p-inputnumber-input) {

    width: 100%;

    border-radius: 12px;
}

:deep(.p-textarea) {

    width: 100%;

    border-radius: 12px;
}

:deep(.p-button) {

    border-radius: 12px;
}

:deep(.p-radiobutton-box) {

    border-color: #12b76a;
}

:deep(.p-radiobutton-checked .p-radiobutton-box) {

    background: #12b76a;

    border-color: #12b76a;
}

:deep(.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider) {

    background: #12b76a;
}
</style>