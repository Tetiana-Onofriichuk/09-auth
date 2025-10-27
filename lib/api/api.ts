import axios from "axios";

// БРАУЗЕР → твій Next (/api/...)
export const nextApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
  validateStatus: () => true,
});

// Next API/SSR → бекенд (Render)
export const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // https://nodejs-hw-6-vj8w.onrender.com
  withCredentials: true,
  validateStatus: () => true,
});
