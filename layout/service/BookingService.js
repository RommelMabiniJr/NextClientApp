import axios from "axios";

export const BookingService = {
  // Gets all bookings(regular and requests) for an employer
  async getEmployerAllBookingsSimple(employerId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/${employerId}/all-bookings/simple`
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

  async getEmployerBookingRequestFull(bookingId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking-request/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkerAllBookingsSimple(workerId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/${workerId}/all-bookings/simple`
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

  async getWorkerBookingRequestFull(bookingId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/booking-request/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getBookingIdByApplicationId(applicationId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/application/${applicationId}/bookingId`
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

  async setBookingRequest(jobDetails, offerDetails, workerId, uuid) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking-request/${workerId}`,
        {
          jobDetails,
          offerDetails,
          uuid,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  // For cancelling booking requests
  async cancelBookingRequest(bookingId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking-request/${bookingId}/cancel`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  // For cancelling regular bookings
  async cancelBooking(bookingId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking/${bookingId}/cancel`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  // For accepting booking requests
  async acceptBookingRequest(bookingId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/booking-request/${bookingId}/accept`
      );

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  },

  // For rejecting booking requests
  async declineBookingRequest(bookingId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/booking-request/${bookingId}/decline`
      );

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  },
};
