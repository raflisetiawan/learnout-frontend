export default function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  return !!token;
}
