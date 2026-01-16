import api from "./axios";

export const fetchCustomers = async () => {
  const response = await api.get("/user");
  console.log(response.data);
  return response.data.users;
};

