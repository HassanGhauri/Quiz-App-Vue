<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useToast } from 'primevue/usetoast'

import AuthService from '@/services/auth.service'

import booksplant from '@/assets/BooksPlants.png'
import bookpen from '@/assets/BookPen.png'
import crescent from '@/assets/Crescent.png'

const router = useRouter()
const toast = useToast()

// ======================
// FORM DATA
// ======================

const email = ref('')
const password = ref('')
const remember = ref(false)

const loading = ref(false)

// ======================
// LOGIN
// ======================

const login = async () => {
  if (!email.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Email Required',
      detail: 'Please enter your email.',
      life: 3000,
    })
    return
  }

  if (!password.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Password Required',
      detail: 'Please enter your password.',
      life: 3000,
    })
    return
  }

  try {
    loading.value = true

    const response = await AuthService.login({
      email: email.value,
      password: password.value,
    })

    console.log(response.data)

    // Save user temporarily
    localStorage.setItem('user', JSON.stringify(response.data.data))

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: response.data.message,
      life: 2000,
    })

    await router.push('/home')
  } catch (error: any) {
    console.error(error)

    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail:
        error.response?.data?.message ??
        'Invalid email or password.',
      life: 3500,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Toast />

  <div class="login-page">
    <!-- ===========================
         LEFT SIDE
    ============================ -->
    <div class="left-section">
      <div class="left-content">
        <div class="logo-area">
          <img :src="crescent" class="crescent-logo" alt="crescent" />

          <h1>Crescent</h1>

          <h2>Quizzes</h2>

          <p class="tagline">
            Test your knowledge.
            <br />

            Challenge yourself.
            <br />

            <span>Grow every day.</span>
          </p>
        </div>

        <div class="books-area">
          <img :src="booksplant" class="books-image" alt="Books" />
        </div>
      </div>

      <div class="bottom-wave">
        <div class="wave-text">
          "Learning is a treasure that will follow its owner
          everywhere."
        </div>
      </div>
    </div>

    <!-- ===========================
         RIGHT SIDE
    ============================ -->

    <div class="right-section">
      <div class="login-card">
        <div class="top-icon-wrapper">
          <div class="icon-bg"></div>

          <img :src="bookpen" class="book-pen" alt="Book Pen" />
        </div>

        <h2>Welcome Back!</h2>

        <p class="subtitle">
          Log in to continue your quiz journey
        </p>

        <!-- ======================
             EMAIL
        ======================= -->

        <div class="input-group">
          <label>Email</label>

          <InputText v-model="email" placeholder="Enter your email" class="w-full custom-input" @keyup.enter="login" />
        </div>

        <!-- ======================
             PASSWORD
        ======================= -->

        <div class="input-group">
          <label>Password</label>

          <Password v-model="password" placeholder="Enter your password" :feedback="false" toggleMask fluid
            class="w-full custom-password" inputClass="custom-password-input" @keyup.enter="login" />
        </div>

        <!-- ======================
             REMEMBER
        ======================= -->

        <div class="options">
          <div class="remember-option">
            <Checkbox v-model="remember" binary inputId="remember" />

            <label for="remember">
              Remember me
            </label>
          </div>

          <a href="#">
            Forgot Password?
          </a>
        </div>

        <!-- ======================
             LOGIN BUTTON
        ======================= -->

        <Button label="Log In" icon="pi pi-sign-in" class="login-btn" :loading="loading" @click="login" />

        <!-- ======================
             DIVIDER
        ======================= -->

        <div class="divider">
          <span>or continue with</span>
        </div>

        <!-- ======================
             SOCIAL BUTTONS
        ======================= -->

        <div class="social-buttons">
          <Button outlined severity="secondary" class="social-btn">
            <i class="pi pi-google"></i>

            <span>Google</span>
          </Button>

          <Button outlined severity="secondary" class="social-btn">
            <i class="pi pi-microsoft"></i>

            <span>Microsoft</span>
          </Button>
        </div>
        <!-- ======================
             SIGNUP
        ======================= -->

        <div class="signup-text">
          <span>Don't have an account?</span>

          <a href="#">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  font-family: Inter, sans-serif;
}

.input-wrapper input {
  color: #101828;
}

.input-wrapper input::placeholder {
  color: #98a2b3;
}

.login-card {
  color: #101828;
}

.login-page {
  min-height: 100vh;

  display: flex;

  background: #f8fffb;

  overflow-x: hidden;
}

/* =========================
   LEFT SECTION
========================= */

.left-section {
  flex: 1;
  min-height: 100vh;
  background: linear-gradient(180deg, #f4fff8 0%, #ecfff3 100%);

  position: relative;

  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* BACKGROUND CIRCLES */

.left-section::before {
  content: '';

  position: absolute;

  width: 700px;
  height: 700px;

  background: rgba(13, 155, 99, 0.04);

  border-radius: 50%;

  top: -300px;
  left: -250px;
}

.left-section::after {
  content: '';

  position: absolute;

  width: 500px;
  height: 500px;

  background: rgba(13, 155, 99, 0.03);

  border-radius: 50%;

  bottom: 80px;
  right: -220px;
}

.left-content {
  padding: 20px 60px 0;

  position: relative;
  z-index: 3;
}

/* =========================
   LOGO AREA
========================= */

.logo-area {
  text-align: center;
}

.crescent-logo {
  width: 95px;

  margin-bottom: 10px;

  filter: drop-shadow(0 8px 20px rgba(11, 138, 88, 0.15));
}

.logo-area h1 {
  font-size: 62px;

  font-weight: 800;

  color: #067647;

  line-height: 1;

  letter-spacing: -2px;
}

.logo-area h2 {
  font-size: 34px;

  color: #36b37e;

  font-weight: 500;

  letter-spacing: 10px;

  margin-top: 8px;
  margin-bottom: 25px;
}

.tagline {
  font-size: 24px;

  line-height: 1.7;

  color: #1f2937;

  font-weight: 500;
}

.tagline span {
  color: #0d9b63;
  font-weight: 700;
}

/* =========================
   BOOK IMAGE
========================= */

.books-area {
  margin-top: -10px;

  display: flex;
  justify-content: center;

  position: relative;
  z-index: 3;
}

.books-image {
  width: 420px;

  object-fit: contain;

  transform: translateY(-10px);

  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.08));
}

/* =========================
   SMALL BOTTOM WAVE
========================= */

.bottom-wave {
  position: relative;

  min-height: 120px;

  flex-shrink: 0;
  height: 120px;

  background: linear-gradient(135deg, #04643d 0%, #067647 45%, #0b8a58 100%);

  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* MAIN CURVE */

.bottom-wave::before {
  content: '';

  position: absolute;

  top: -70px;
  left: -5%;

  width: 110%;
  height: 110px;

  background: #f1fff7;

  border-radius: 0 0 50% 50%;
}

/* LIGHT FLOATING WAVE */

.bottom-wave::after {
  content: '';

  position: absolute;

  top: -40px;
  right: -10%;

  width: 120%;
  height: 90px;

  background: rgba(255, 255, 255, 0.06);

  border-radius: 50%;
}

/* WAVE CONTENT */

.wave-text {
  position: relative;
  z-index: 5;

  color: white;

  font-size: 14px;

  text-align: center;

  font-weight: 500;

  margin-top: 20px;

  letter-spacing: 0.3px;
}

/* COPYRIGHT */

.wave-copy {
  position: relative;
  z-index: 5;

  margin-top: 10px;

  color: rgba(255, 255, 255, 0.8);

  font-size: 12px;

  letter-spacing: 1px;
}

/* =========================
   RIGHT SECTION
========================= */

.right-section {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 25px 50px;

  position: relative;
}

/* =========================
   LOGIN CARD
========================= */

.login-card {
  width: 100%;
  max-width: 520px;

  background: white;

  border-radius: 34px;

  padding: 40px;

  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.08),
    0 8px 20px rgba(13, 155, 99, 0.04);

  position: relative;

  overflow: hidden;
}

/* LIGHT GLOW */

.login-card::before {
  content: '';

  position: absolute;

  width: 280px;
  height: 280px;

  background: rgba(13, 155, 99, 0.03);

  border-radius: 50%;

  top: -160px;
  right: -120px;
}

/* =========================
   TOP ICON
========================= */

.top-icon-wrapper {
  position: relative;

  width: 130px;
  height: 130px;

  margin: auto;
  margin-bottom: 15px;
}

.icon-bg {
  width: 130px;
  height: 130px;

  background: linear-gradient(180deg, #effff5 0%, #e6fff0 100%);

  border-radius: 50%;

  position: absolute;

  box-shadow: inset 0 4px 10px rgba(255, 255, 255, 0.8);
}

.book-pen {
  width: 110px;

  position: absolute;

  top: 10px;
  left: 10px;
}

/* =========================
   TEXT
========================= */

.login-card h2 {
  text-align: center;

  font-size: 42px;

  font-weight: 800;

  color: #101828;

  margin-bottom: 10px;

  position: relative;
  z-index: 3;
}

.subtitle {
  text-align: center;

  color: #667085;

  font-size: 17px;

  margin-bottom: 30px;

  position: relative;
  z-index: 3;
}

/* =========================
   INPUTS
========================= */

.input-group {
  margin-bottom: 20px;

  position: relative;
  z-index: 3;
}

.input-group label {
  display: block;

  margin-bottom: 8px;

  color: #344054;

  font-weight: 600;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;

  left: 18px;
  top: 50%;

  transform: translateY(-50%);

  font-size: 16px;

  z-index: 3;
}

.input-wrapper input {
  width: 100%;

  padding: 16px 18px 16px 52px;

  border-radius: 15px;

  border: 1px solid #d0d5dd;

  background: #fcfffd;

  font-size: 15px;

  transition: 0.3s;
}

.input-wrapper input:focus {
  outline: none;

  border-color: #0d9b63;

  background: white;

  box-shadow: 0 0 0 5px rgba(13, 155, 99, 0.12);
}

/* =========================
   OPTIONS
========================= */

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;

  position: relative;
  z-index: 3;
}

.remember {
  display: flex;
  align-items: center;
  gap: 10px;

  color: #344054;

  font-size: 14px;
}

.options a {
  color: #0d9b63;

  text-decoration: none;

  font-weight: 600;

  font-size: 14px;
}

/* =========================
   LOGIN BUTTON
========================= */

.login-btn {
  width: 100%;

  padding: 16px;

  border: none;
  border-radius: 16px;

  background: linear-gradient(90deg, #0b8a58, #12b76a);

  color: white;

  font-size: 18px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.3s ease;

  position: relative;
  z-index: 3;
}

.login-btn:hover {
  transform: translateY(-3px);

  box-shadow: 0 15px 35px rgba(18, 183, 106, 0.35);
}

/* =========================
   DIVIDER
========================= */

.divider {
  text-align: center;

  margin: 28px 0;

  position: relative;

  z-index: 3;
}

.divider span {
  background: white;

  padding: 0 20px;

  color: #98a2b3;

  position: relative;
  z-index: 2;

  font-size: 14px;
}

.divider::before {
  content: '';

  position: absolute;

  width: 100%;
  height: 1px;

  background: #eaecf0;

  left: 0;
  top: 50%;
}

/* =========================
   SOCIAL BUTTONS
========================= */

.social-buttons {
  display: flex;

  gap: 16px;

  position: relative;
  z-index: 3;
}

.social-buttons button {
  flex: 1;

  padding: 14px;

  border-radius: 15px;

  border: 1px solid #d0d5dd;

  background: white;

  color: #344054;

  font-size: 15px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.3s;
}

.social-buttons button:hover {
  border-color: #0d9b63;

  color: #0d9b63;

  transform: translateY(-2px);
}

/* =========================
   SIGNUP
========================= */

.signup-text {
  margin-top: 28px;

  text-align: center;

  color: #667085;

  font-size: 15px;

  position: relative;
  z-index: 3;
}

.signup-text span {
  color: #0d9b63;

  font-weight: 700;

  cursor: pointer;
}

.error-message {
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
  font-weight: 600;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1100px) {
  .login-page {
    flex-direction: column;
  }

  .left-section {
    display: none;
  }

  .right-section {
    padding: 20px;
    align-items: center;
  }

  .login-card {
    padding: 30px 24px;
  }

  .login-card h2 {
    font-size: 34px;
  }

  .top-icon-wrapper {
    width: 110px;
    height: 110px;
  }

  .icon-bg {
    width: 110px;
    height: 110px;
  }

  .book-pen {
    width: 90px;
  }
}

/* ===========================
   PRIMEVUE INPUTS
=========================== */

:deep(.custom-input) {
  width: 100%;
  height: 52px;
}

:deep(.custom-input input) {
  background: #ffffff !important;
  color: #1f2937 !important;
  border: 1px solid #d0d5dd;
  border-radius: 14px;
}

:deep(.custom-input::placeholder) {
  color: #98a2b3;
}

:deep(.custom-password) {
  width: 100%;
}

:deep(.custom-password .p-password-input) {
  width: 100%;
  height: 52px;

  background: #ffffff !important;

  color: #1f2937 !important;

  border-radius: 14px;
}

:deep(.custom-password input) {
  color: #1f2937 !important;

  background: #ffffff !important;
}

:deep(.custom-input:focus),
:deep(.custom-password .p-password-input:focus) {
  border-color: #0d9b63 !important;

  box-shadow: 0 0 0 4px rgba(13, 155, 99, 0.15);
}

:deep(.custom-password input::placeholder),
:deep(.custom-input input::placeholder) {
  color: #98a2b3 !important;
}

:deep(.p-password-toggle-mask) {
  color: #667085;
}
</style>
