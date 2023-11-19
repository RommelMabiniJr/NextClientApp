import axios from "axios";

export const ScreeningService = {
  async getScreeningResults(jobpostId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/screening/results`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async saveScreeningResults(jobpostId, screeningResults) {
    console.log(screeningResults);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/screening/results`,
        { screeningResults }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
