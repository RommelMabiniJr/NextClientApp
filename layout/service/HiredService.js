import axios from "axios";

export const HiredService = {
  async getHiredApplicant(jobpostId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/hired-applicant`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
