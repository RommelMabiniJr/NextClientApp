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

  // For deleting booking requests by employer
  async deleteBookingRequestByEmployer(bookingId) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking-request/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  // For deleting booking requests by worker
  async deleteBookingRequestByWorker(bookingId) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/booking-request/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteRegBookingByEmployer(bookingId) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteRegBookingByWorker(bookingId) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/booking/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  // For cancelling booking requests
  async cancelBookingRequestByEmployer(bookingId, reason) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking-request/${bookingId}/cancel`,
        {
          reason,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  // For cancelling regular bookings
  async cancelBookingByEmployer(bookingId, reason) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking/${bookingId}/cancel`,
        {
          reason,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  // For cancelling booking requests
  async cancelBookingRequestByWorker(bookingId, reason) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/booking-request/${bookingId}/cancel`,
        {
          reason,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  // For cancelling regular bookings
  async cancelBookingByWorker(bookingId, reason) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/booking/${bookingId}/cancel`,
        {
          reason,
        }
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

  // For creating an extension request to a booking
  async extendBooking(bookingId, startDate, endDate, salaryIncrease) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking/${bookingId}/extend`,
        {
          startDate,
          endDate,
          salaryIncrease,
        }
      );

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  },

  // For deleting an extension request to a booking
  async deleteExtensionRequest(bookingId, extensionId) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking/${bookingId}/extension/${extensionId}`
      );

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  },

  // For getting the extension request for a booking
  async getBookingExtensions(bookingId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/booking/${bookingId}/extensions`
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  // For accepting or rejecting an extension request
  async respondToExtensionRequest(bookingId, extensionId, extensionResponse) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/booking/${bookingId}/extension/${extensionId}/${extensionResponse}`
      );

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  },
};
