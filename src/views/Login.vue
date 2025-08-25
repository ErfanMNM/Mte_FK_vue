<template>
  <div class="login-wrap">
    <div class="login-card">
      <h1>Đăng nhập</h1>
      <form @submit.prevent="onSubmit">
        <label>Tài khoản</label>
        <input v-model="username" class="input" placeholder="admin" required />
        <label>Mật khẩu</label>
        <input v-model="password" type="password" class="input" placeholder="123456" required />
        <button class="btn" type="submit" :disabled="loading">{{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}</button>
        <div class="hint">Demo: admin / 123456</div>
        <div class="error">{{ error }}</div>
      </form>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, saveAuth } from '../stores/auth.js'
import { apiLogin } from '../api/mock.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const user = await apiLogin(username.value, password.value)
    auth.user = user
    saveAuth()
    router.push('/kanban')
  } catch (e) {
    error.value = e?.message || 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}
</script>

