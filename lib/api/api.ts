import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

// 🔹 БРАУЗЕР → твій Next (/api/...)
export const nextApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
  validateStatus: () => true,
});

// 🔹 Next API/SSR → бекенд (Render або локально)
export const backend = axios.create({
  baseURL: isProd
    ? process.env.NEXT_PUBLIC_API_URL // прод: твій Render (наприклад https://nodejs-hw-6-vj8w.onrender.com)
    : "http://localhost:3030", // локальний бекенд
  withCredentials: true,
  validateStatus: () => true,
});
