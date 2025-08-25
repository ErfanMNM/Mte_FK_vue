const USERS = [{ id: 1, username: 'admin', password: '123456', name: 'Quản trị viên' }]

export function apiLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const u = USERS.find(x => x.username === username && x.password === password)
      if (!u) return reject(new Error('Sai tài khoản hoặc mật khẩu'))
      resolve({ id: u.id, name: u.name, username: u.username, token: 'mock-'+Date.now() })
    }, 300)
  })
}

export function apiFetchBoard(current) {
  return new Promise(resolve => setTimeout(() => resolve(current), 150))
}

export function apiSaveBoard(board) {
  return new Promise(resolve => setTimeout(() => resolve(board), 150))
}

// Users mock endpoints
export function apiFetchUsers(list) {
  return new Promise(resolve => setTimeout(() => resolve(list), 200))
}

export function apiSaveUsers(list) {
  return new Promise(resolve => setTimeout(() => resolve(list), 200))
}
