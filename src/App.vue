<template>
  <div class="app">
    <template v-if="$route.path === '/login'">
      <RouterView />
    </template>
    <template v-else>
      <div class="admin-layout">
        <HeaderBar />
        <div class="admin-main">
          <SidebarNav :currentPath="$route.path" />
          <div class="admin-content">
            <RouterView />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import HeaderBar from './components/HeaderBar.vue'
import SidebarNav from './components/SidebarNav.vue'
</script>
