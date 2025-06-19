export function logout() {
  document.cookie = 'accessToken=; path=/; max-age=0';
  window.location.href = '/login';
}