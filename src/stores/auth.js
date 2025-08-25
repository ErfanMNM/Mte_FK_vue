import { reactive } from 'vue'

const AUTH_KEY = 'mte_fk_vue_auth_v1'

export const auth = reactive({ user: null })

export function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) auth.user = JSON.parse(raw)
  } catch {}
}

export function saveAuth() {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth.user))
}

export function clearAuth() {
  auth.user = null
  localStorage.removeItem(AUTH_KEY)
}

export function isAuthenticated() {
  return !!(auth.user && auth.user.token)
}

loadAuth()

