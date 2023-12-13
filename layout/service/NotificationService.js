import axios from "axios";

export const NotificationService = {
  async getWorkerNotifications(uuid) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/notifications/${uuid}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getEmployerNotifications(uuid) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/notifications/${uuid}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async setEmpNotificationRead(notificationId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/notification/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async setWorkerNotificationRead(notificationId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/notification/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getPostId(applicationId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/notification/${applicationId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
