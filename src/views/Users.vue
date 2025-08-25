<template>
  <div class="users-wrap">
    <div class="card" style="display:flex; gap:8px; align-items:center;">
      <InputText v-model="q" placeholder="Tìm kiếm người dùng..." class="p-inputtext-lg" style="flex:1" />
      <Button label="Thêm người dùng" icon="pi pi-plus" @click="openCreate" />
    </div>

    <div class="card">
      <DataTable :value="filtered" paginator :rows="10" dataKey="id" responsiveLayout="scroll" :rowHover="true">
        <Column field="name" header="Họ tên" sortable></Column>
        <Column field="username" header="Tài khoản" sortable></Column>
        <Column field="email" header="Email"></Column>
        <Column header="Vai trò" :body="roleTpl"></Column>
        <Column header="Trạng thái" :body="statusTpl"></Column>
        <Column header="Ngày tạo" :body="dateTpl" sortable></Column>
        <Column header="" :body="actionTpl" style="width:160px"></Column>
      </DataTable>
    </div>

    <UserModal v-model="modal" :user="editing" @save="onSave" />
  </div>
</template>

<script setup>
import { computed, ref, h } from 'vue'
import { users, loadUsers, saveUsers, createUser, updateUser, deleteUser, searchUsers } from '../stores/users.js'
import { apiFetchUsers, apiSaveUsers } from '../api/mock.js'
import UserModal from '../components/UserModal.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'

loadUsers()
const q = ref('')
const modal = ref(false)
const editing = ref(null)

const filtered = computed(() => searchUsers(q.value))

function openCreate() { editing.value = null; modal.value = true }
function openEdit(u) { editing.value = { ...u }; modal.value = true }

function onSave(draft) {
  if (draft.id) updateUser(draft.id, draft)
  else createUser(draft)
  apiSaveUsers(users.list)
  modal.value = false
}

function onDelete(u) {
  if (!confirm('Xóa người dùng này?')) return
  deleteUser(u.id)
  apiSaveUsers(users.list)
}

function fmt(ts) { try { return new Date(ts).toLocaleString() } catch { return '' } }

// Table cell templates
function roleTpl({ data }) {
  return h(Tag, { value: data.role, severity: data.role === 'admin' ? 'warning' : data.role === 'editor' ? 'info' : 'success' })
}
function statusTpl({ data }) {
  return h(Tag, { value: data.status, severity: data.status === 'active' ? 'success' : 'danger' })
}
function dateTpl({ data }) { return fmt(data.createdAt) }
function actionTpl({ data }) {
  return h('div', { class: 'p-d-flex p-ai-center', style: 'display:flex;gap:6px' }, [
    h(Button, { label: 'Sửa', size: 'small', onClick: () => openEdit(data) }),
    h(Button, { label: 'Xóa', size: 'small', severity: 'danger', onClick: () => onDelete(data) })
  ])
}
</script>
