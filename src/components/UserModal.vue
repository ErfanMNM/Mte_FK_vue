<template>
  <Dialog v-model:visible="open" modal :header="isEdit ? 'Sửa người dùng' : 'Thêm người dùng'" :style="{ width: '600px' }">
    <div class="p-fluid p-formgrid p-grid" style="display:grid; gap:12px">
      <div class="p-field">
        <label>Họ tên</label>
        <InputText v-model="draft.name" />
      </div>
      <div class="p-field">
        <label>Tài khoản</label>
        <InputText v-model="draft.username" />
      </div>
      <div class="p-field">
        <label>Email</label>
        <InputText v-model="draft.email" />
      </div>
      <div class="p-field">
        <label>Vai trò</label>
        <Dropdown v-model="draft.role" :options="roles" />
      </div>
      <div class="p-field">
        <label>Trạng thái</label>
        <Dropdown v-model="draft.status" :options="statuses" />
      </div>
    </div>
    <template #footer>
      <Button label="Hủy" severity="secondary" @click="close" />
      <Button label="Lưu" icon="pi pi-check" @click="save" />
    </template>
  </Dialog>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const props = defineProps({ modelValue: Boolean, user: Object })
const emit = defineEmits(['update:modelValue', 'save'])

const open = computed({ get: () => props.modelValue, set: v => emit('update:modelValue', v) })
const isEdit = computed(() => !!props.user?.id)
const draft = reactive({ id: null, name: '', username: '', email: '', role: 'viewer', status: 'active' })
const roles = ['admin','editor','viewer']
const statuses = ['active','disabled']

watch(() => props.user, (u) => {
  Object.assign(draft, { id: null, name: '', username: '', email: '', role: 'viewer', status: 'active' }, u || {})
}, { immediate: true })

function close() { open.value = false }
function save() { emit('save', { ...draft }) }
</script>
