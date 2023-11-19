import axios from "axios";

export const RatingAndReviewService = {
  async getReviewOfBooking(bookingId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/review/booking/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async setReviewOfBooking(bookingId, review) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/review/booking/${bookingId}`,
        review
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateReviewOfBooking(reviewId, review) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/review/booking/${reviewId}`,
        review
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
