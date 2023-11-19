import axios from "axios";

export const ApplicationTimelineService = {
  async getApplicationTimeline(jobpostId, applicationId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/application/${applicationId}/progress-timeline`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
