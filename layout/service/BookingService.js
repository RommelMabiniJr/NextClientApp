import axios from "axios";

export const BookingService = {
  async getEmployerBookingsSimple(employerId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/${employerId}/bookings/simple`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getEmployerBookingFull(bookingId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkerBookingsSimple(workerId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/${workerId}/bookings/simple`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkerBookingFull(bookingId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/booking/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async markBookingStart(bookingId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking/${bookingId}/start`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async markBookingComplete(bookingId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking/${bookingId}/complete`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
