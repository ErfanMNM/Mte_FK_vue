<template>
  <Dialog v-model:visible="open" modal header="Chi tiết công việc" :style="{ width: '880px' }">
    <div class="p-fluid" style="display:grid; gap:14px">
      <InputText v-model="draft.title" placeholder="Tiêu đề" class="p-inputtext-lg" />
      <div class="field row">
        <div class="field">
          <label>Hạn</label>
          <Calendar v-model="due" dateFormat="yy-mm-dd" showIcon iconDisplay="input" />
        </div>
        <div class="field">
          <label>Nhãn</label>
          <Chips v-model="draft.labels" separator="," />
        </div>
      </div>
      <div class="field">
        <label>Mô tả</label>
        <InputTextarea v-model="draft.description" rows="6" autoResize placeholder="Mô tả chi tiết..." />
      </div>
      <div class="field">
        <label>Checklist</label>
        <div class="checklist">
          <div v-for="item in draft.checklist" :key="item.id" class="check-item">
            <input type="checkbox" v-model="item.done" @change="persist" />
            <InputText v-model="item.text" @change="persist" />
            <Button label="Xóa" size="small" severity="danger" @click="removeChecklist(item.id)" />
          </div>
          <div class="check-add" style="display:flex; gap:8px; align-items:center;">
            <InputText v-model="checkInput" placeholder="Nội dung mục..." @keyup.enter="addChecklist" />
            <Button label="Thêm mục" size="small" @click="addChecklist" />
          </div>
        </div>
      </div>
      <div class="field">
        <label>Bình luận</label>
        <div class="comments">
          <div v-if="!draft.comments.length" class="muted">Chưa có bình luận</div>
          <div v-for="c in draft.comments" :key="c.id" class="comment">
            <div class="comment-meta">{{ fmtDate(c.at) }}</div>
            <div class="comment-text">{{ c.text }}</div>
          </div>
          <div class="comment-add" style="display:flex; gap:8px; align-items:flex-start;">
            <InputTextarea v-model="commentInput" rows="3" autoResize placeholder="Viết bình luận..." />
            <Button label="Gửi" size="small" @click="addComment" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Xóa task" severity="danger" icon="pi pi-trash" @click="onDeleteTask" />
      <Button label="Đóng" severity="secondary" @click="close" />
      <Button label="Lưu" icon="pi pi-check" @click="save" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { board, saveBoard, sanitizeTask, uid } from '../stores/board.js'
import { apiSaveBoard } from '../api/mock.js'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputTextarea from 'primevue/inputtextarea'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Chips from 'primevue/chips'

const props = defineProps({
  modelValue: Boolean,
  colId: String,
  taskId: String,
})
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const checkInput = ref('')
const commentInput = ref('')
const due = ref(null)

const draft = reactive({ title: '', description: '', dueDate: '', labels: [], checklist: [], comments: [] })

watch(() => [props.colId, props.taskId, props.modelValue], () => {
  if (!props.modelValue) return
  const t = getTask()
  if (!t) return
  Object.assign(draft, sanitizeTask(t))
  try { due.value = draft.dueDate ? new Date(draft.dueDate) : null } catch { due.value = null }
}, { immediate: true })

function getTask() {
  const col = board.columns.find(c => c.id === props.colId)
  return col?.tasks.find(t => t.id === props.taskId)
}

function close() { open.value = false }

function save() {
  const t = getTask()
  if (!t) return
  t.title = draft.title
  t.description = draft.description
  t.dueDate = due.value ? new Date(due.value).toISOString().slice(0,10) : ''
  t.labels = [...draft.labels]
  t.checklist = draft.checklist.map(i => ({ id: i.id || uid(), text: i.text || '', done: !!i.done }))
  t.comments = draft.comments.map(c => ({ id: c.id || uid(), text: c.text || '', at: c.at || Date.now() }))
  persist()
  close()
}

function persist() { saveBoard(); apiSaveBoard(board.columns) }

function removeLabel(i) { draft.labels.splice(i, 1); persist() }

function addChecklist() {
  const v = (checkInput.value || '').trim()
  if (!v) return
  draft.checklist.push({ id: uid(), text: v, done: false })
  checkInput.value = ''
  persist()
}
function removeChecklist(id) {
  draft.checklist = draft.checklist.filter(x => x.id !== id)
  persist()
}

function addComment() {
  const v = (commentInput.value || '').trim()
  if (!v) return
  draft.comments.push({ id: uid(), text: v, at: Date.now() })
  commentInput.value = ''
  persist()
}

function fmtDate(ts) {
  try { return new Date(ts).toLocaleString() } catch { return '' }
}

function onDeleteTask() {
  const col = board.columns.find(c => c.id === props.colId)
  if (!col) return
  col.tasks = col.tasks.filter(t => t.id !== props.taskId)
  persist()
  close()
}
</script>
