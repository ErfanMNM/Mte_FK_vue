<template>
  <div class="kanban-wrap">
    <div class="board-bar">
      <input v-model="boardTitle" class="input board-title" />
      <div class="spacer" />
      <Button label="Thêm cột" icon="pi pi-plus" @click="addColumnPrompt" />
      <Button label="Xóa bảng" severity="secondary" @click="onReset" />
    </div>

    <div class="add-form">
      <InputText v-model="newTaskTitle" placeholder="Tiêu đề công việc..." @keyup.enter="addTask" />
      <select v-model="newTaskColumn" class="select">
        <option v-for="c in columns" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <Button label="Thêm" icon="pi pi-check" @click="addTask" />
    </div>

    <main class="board">
      <section v-for="col in columns" :key="col.id" class="column" @dragover.prevent @drop="onDrop(col.id, $event)">
        <div class="column-head">
          <h2 class="column-title">{{ col.name }} <span class="count">{{ col.tasks.length }}</span></h2>
          <div class="col-actions">
            <button class="btn small" @click="renameColumnPrompt(col.id, col.name)">Sửa</button>
            <button class="btn small danger" @click="deleteColumn(col.id)">Xóa</button>
          </div>
        </div>
        <div class="tasks">
          <article v-for="task in col.tasks" :key="task.id" class="task" draggable="true"
                   @dragstart="onDragStart(col.id, task.id, $event)" @click="openTask(col.id, task.id)">
            <div class="task-title">{{ task.title }}</div>
            <div class="task-actions" @click.stop>
              <Button label="Sửa" size="small" @click="onEdit(col.id, task.id)" />
              <Button label="Xóa" size="small" severity="danger" @click="onDelete(col.id, task.id)" />
            </div>
          </article>
        </div>
      </section>
    </main>

    <TaskModal v-model="modalOpen" :colId="activeColId" :taskId="activeTaskId" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { board, saveBoard, resetBoard, uid, addColumn, renameColumn, deleteColumn as delCol, sanitizeTask } from '../stores/board.js'
import { apiSaveBoard } from '../api/mock.js'
import TaskModal from '../components/TaskModal.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const state = reactive({ drag: null })
const columns = computed(() => board.columns)
const boardTitle = ref(board.title)
watch(boardTitle, (v) => { board.title = v; saveBoard(); apiSaveBoard(board.columns) })
const newTaskTitle = ref('')
const newTaskColumn = ref('todo')
const modalOpen = ref(false)
const activeColId = ref('')
const activeTaskId = ref('')

function addTask() {
  const title = newTaskTitle.value.trim()
  if (!title) return
  const col = board.columns.find(c => c.id === newTaskColumn.value)
  if (!col) return
  col.tasks.push(sanitizeTask({ id: uid(), title }))
  newTaskTitle.value = ''
  saveBoard()
  apiSaveBoard(board.columns)
}

function onDelete(colId, taskId) {
  const col = board.columns.find(c => c.id === colId)
  if (!col) return
  col.tasks = col.tasks.filter(t => t.id !== taskId)
  saveBoard(); apiSaveBoard(board.columns)
}

function onEdit(colId, taskId) {
  const col = board.columns.find(c => c.id === colId)
  if (!col) return
  const task = col.tasks.find(t => t.id === taskId)
  if (!task) return
  const next = prompt('Sửa tiêu đề:', task.title)
  if (next !== null) {
    const v = next.trim()
    if (v) task.title = v
    saveBoard(); apiSaveBoard(board.columns)
  }
}

function onDragStart(fromColId, taskId, ev) {
  state.drag = { fromColId, taskId }
  try {
    ev.dataTransfer.setData('text/plain', JSON.stringify(state.drag))
    ev.dataTransfer.effectAllowed = 'move'
  } catch {}
}

function onDrop(targetColId, ev) {
  let payload = state.drag
  if (!payload) {
    try {
      const raw = ev.dataTransfer.getData('text/plain')
      if (raw) payload = JSON.parse(raw)
    } catch {}
  }
  if (!payload) return
  const from = board.columns.find(c => c.id === payload.fromColId)
  const to = board.columns.find(c => c.id === targetColId)
  if (!from || !to) return
  const idx = from.tasks.findIndex(t => t.id === payload.taskId)
  if (idx === -1) return
  const [task] = from.tasks.splice(idx, 1)
  to.tasks.push(task)
  state.drag = null
  saveBoard(); apiSaveBoard(board.columns)
}

function onReset() {
  if (!confirm('Đặt lại toàn bộ bảng?')) return
  resetBoard()
}

function addColumnPrompt() {
  const name = prompt('Tên cột mới:', 'Cột mới')
  if (name && name.trim()) addColumn(name.trim())
}

function renameColumnPrompt(id, current) {
  const name = prompt('Đổi tên cột:', current)
  if (name !== null && name.trim()) renameColumn(id, name.trim())
}

function deleteColumn(id) {
  if (!confirm('Xóa cột này?')) return
  delCol(id)
}

function openTask(colId, taskId) {
  activeColId.value = colId
  activeTaskId.value = taskId
  modalOpen.value = true
}
</script>
