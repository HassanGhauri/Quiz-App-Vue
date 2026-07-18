
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { inject } from 'vue'

const dialogRef: any = inject('dialogRef')

const result = dialogRef.value.data.result
</script>

<template>

<div class="container">

    <div class="summary">

        <div class="card">

            <h3>User</h3>

            <p>
                {{ result.user.first_name }}
                {{ result.user.last_name }}
            </p>

        </div>

        <div class="card">

            <h3>Quiz</h3>

            <p>{{ result.quiz.title }}</p>

        </div>

        <div class="card">

            <h3>Percentage</h3>

            <p>{{ result.percentage }}%</p>

        </div>

        <div class="card">

            <h3>Status</h3>

            <Tag
                :value="result.passed ? 'Passed' : 'Failed'"
                :severity="result.passed ? 'success':'danger'"
            />

        </div>

        <div class="card">

            <h3>Time Taken</h3>

            <p>{{ result.time_taken }} Seconds</p>

        </div>

    </div>

    <Divider/>

    <h2>Question Details</h2>

    <Accordion>

        <AccordionPanel
            v-for="(answer,index) in result.answers"
            :key="index"
            :value="index"
        >

            <AccordionHeader>

                Question {{ index+1 }}

            </AccordionHeader>

            <AccordionContent>

                <h4>{{ answer.question }}</h4>

                <Tag
                    :value="answer.correct ? 'Correct':'Incorrect'"
                    :severity="answer.correct ? 'success':'danger'"
                />

            </AccordionContent>

        </AccordionPanel>

    </Accordion>

</div>

</template>

<style scoped>

.container{

    display:flex;

    flex-direction:column;

    gap:25px;

}

.summary{

    display:grid;

    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));

    gap:20px;

}

.card{

    background:#f8fffb;

    border:1px solid #d7f5e5;

    border-radius:15px;

    padding:18px;

    text-align:center;

}

.card h3{

    color:#067647;

    margin-bottom:10px;

}

h2{

    color:#067647;

}

</style>