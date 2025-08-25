import { reactive, computed } from 'vue'

const USERS_KEY = 'mte_fk_vue_users_v1'

const initialUsers = [
  { id: uid(), name: 'Quản trị viên', username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: Date.now() - 86400000 },
  { id: uid(), name: 'Nguyễn Văn A', username: 'nguyenvana', email: 'a@example.com', role: 'editor', status: 'active', createdAt: Date.now() - 3600_000 },
  { id: uid(), name: 'Trần Thị B', username: 'tranthib', email: 'b@example.com', role: 'viewer', status: 'disabled', createdAt: Date.now() - 10_000 },
]

export const users = reactive({ list: [] })

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) users.list = JSON.parse(raw)
    else users.list = initialUsers
  } catch {
    users.list = initialUsers
  }
}

export function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users.list))
}

export function createUser(u) {
  users.list.push({
    id: uid(),
    name: u.name || '',
    username: u.username || '',
    email: u.email || '',
    role: u.role || 'viewer',
    status: u.status || 'active',
    createdAt: Date.now(),
  })
  saveUsers()
}

export function updateUser(id, patch) {
  const i = users.list.findIndex(x => x.id === id)
  if (i === -1) return
  users.list[i] = { ...users.list[i], ...patch }
  saveUsers()
}

export function deleteUser(id) {
  users.list = users.list.filter(x => x.id !== id)
  saveUsers()
}

export function searchUsers(term) {
  const q = (term || '').toLowerCase()
  if (!q) return users.list
  return users.list.filter(u =>
    [u.name, u.username, u.email, u.role, u.status].some(v => (v||'').toLowerCase().includes(q))
  )
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

loadUsers()

