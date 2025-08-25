import Login from '../views/Login.vue'
import Kanban from '../views/Kanban.vue'
import Users from '../views/Users.vue'
import { isAuthenticated } from '../stores/auth.js'

export const routes = [
  { path: '/', redirect: '/kanban' },
  { path: '/login', component: Login },
  { path: '/kanban', component: Kanban },
  { path: '/users', component: Users },
]

export function applyGuards(router) {
  router.beforeEach((to) => {
    if (to.path !== '/login' && !isAuthenticated()) return '/login'
    if (to.path === '/login' && isAuthenticated()) return '/kanban'
    return true
  })
}
