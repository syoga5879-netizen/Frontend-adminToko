

import axios from "axios";
// const token = localStorage.getItem("token");
const token = "2|BZ9O0eJ7B5Lufagfsx9d4qHBRQRYQR37GAACfN0y60897f13";
const apiClient = axios.create({
 baseURL: "http://127.0.0.1:8000/api",
 headers: {
 "Content-Type": "application/json",
 Accept: "application/json",
 Authorization: 'Bearer ' + token,
 },
});
export default apiClient;