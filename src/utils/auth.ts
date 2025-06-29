import Cookies from 'js-cookie';

export function logout() {
  Cookies.remove('accessToken');
  window.location.href = '/login';
}
