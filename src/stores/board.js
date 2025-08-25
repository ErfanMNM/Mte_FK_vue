import { reactive } from 'vue'

const BOARD_KEY = 'mte_fk_vue_board_v2'

export const defaultBoard = () => ({
  title: 'Bảng của tôi',
  columns: [
    { id: 'todo', name: 'Việc cần làm', tasks: [] },
    { id: 'doing', name: 'Đang thực hiện', tasks: [] },
    { id: 'done', name: 'Hoàn thành', tasks: [] },
  ],
})

export const board = reactive(defaultBoard())

export function loadBoard() {
  try {
    let raw = localStorage.getItem(BOARD_KEY)
    if (!raw) raw = localStorage.getItem('mte_fk_vue_board_v1')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        // migrate from v1 (columns array only)
        board.title = 'Bảng của tôi'
        board.columns = sanitizeColumns(parsed)
      } else if (parsed && typeof parsed === 'object') {
        board.title = parsed.title || 'Bảng của tôi'
        board.columns = sanitizeColumns(parsed.columns || [])
      }
    }
  } catch {}
}

export function saveBoard() {
  localStorage.setItem(BOARD_KEY, JSON.stringify({ title: board.title, columns: board.columns }))
}

export function resetBoard() {
  const b = defaultBoard()
  board.title = b.title
  board.columns = b.columns
  saveBoard()
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

loadBoard()

// Helpers
function sanitizeColumns(cols) {
  return (cols || []).map(c => ({
    id: c.id || uid(),
    name: c.name || 'Cột',
    tasks: (c.tasks || []).map(sanitizeTask),
  }))
}

export function sanitizeTask(t) {
  return {
    id: t.id || uid(),
    title: t.title || 'Chưa có tiêu đề',
    description: t.description || '',
    dueDate: t.dueDate || '',
    labels: Array.isArray(t.labels) ? t.labels : [],
    checklist: Array.isArray(t.checklist) ? t.checklist : [],
    comments: Array.isArray(t.comments) ? t.comments : [],
  }
}

// Column operations
export function addColumn(name = 'Cột mới') {
  board.columns.push({ id: uid(), name, tasks: [] })
  saveBoard()
}

export function renameColumn(colId, name) {
  const col = board.columns.find(c => c.id === colId)
  if (col) { col.name = name; saveBoard() }
}

export function deleteColumn(colId) {
  board.columns = board.columns.filter(c => c.id !== colId)
  saveBoard()
}
