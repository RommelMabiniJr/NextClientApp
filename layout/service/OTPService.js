import axios from "axios";

export const OTPService = {
  async sendOTP(email) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/register/email-otp`,
        { email }
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  async verifyOTP(email, enteredOTP) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email-otp`,
        { email, enteredOTP }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
