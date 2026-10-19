import api from "./apiFetch";

export async function login(credentials) {
  const res = await api.post("/users/login", credentials);
  localStorage.setItem("token", res.data.token);
  return res.data;
}

export async function register(user) {
  const res = await api.post("/users/register", user);
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
}
