import API from "./axios";

export const loginUser = (data) => API.post("/admin/login", data);
