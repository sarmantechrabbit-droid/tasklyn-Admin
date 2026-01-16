import api from "./axios";

export const sendNotification = async (payload) => {
  const response = await api.post("/notification/send-email", payload);
  console.log(response.data);
  return response.data;
};

export const sendNotificationBySubcription = async (payload) => {
  const response = await api.post("/notification/send-email-by-subscription", payload);
  console.log(response.data);
  return response.data;
};
