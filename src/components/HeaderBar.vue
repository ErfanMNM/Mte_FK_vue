<template>
  <header class="admin-header">
    <div class="brand">Mte_FK Admin</div>
    <div class="search-box">
      <input class="input" placeholder="Tìm nhanh..." />
    </div>
    <div class="spacer" />
    <div class="user">{{ username }}</div>
    <button class="btn small" @click="logout">Đăng xuất</button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { auth, clearAuth } from '../stores/auth.js'

const router = useRouter()
const username = auth.user?.name || ''

function logout() {
  clearAuth()
  router.push('/login')
}
</script>
