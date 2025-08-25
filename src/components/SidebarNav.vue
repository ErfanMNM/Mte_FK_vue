<template>
  <aside class="admin-sidebar">
    <nav>
      <RouterLink to="/kanban" class="nav-link" :class="{ active: currentPath === '/kanban' }">Kanban</RouterLink>
      <RouterLink to="/users" class="nav-link" :class="{ active: currentPath === '/users' }">Users</RouterLink>
    </nav>
  </aside>
</template>

<script setup>
defineProps({ currentPath: String })
</script>
