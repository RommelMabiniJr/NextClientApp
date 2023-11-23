import axios from "axios";

export const InterviewService = {
  async setInterviewSchedule(jobpostId, applicationId, interviewResult) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/interview/${applicationId}/schedule`,
        { interviewResult }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteInterviewSchedule(jobpostId, applicationId) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/interview/${applicationId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getInterviewDetails(jobpostId, applicationId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/interview/${applicationId}/details`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getScheduledInterviews(jobpostId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/interviews/scheduled`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async markInterviewAsCompleted(jobpostId, applicationId) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/interview/${applicationId}/completed`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async setPassedInterview(jobpostId, applicationId) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/interview/${applicationId}/passed`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async resetPassedInterview(jobpostId, applicationId) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/interview/${applicationId}/passed`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getPassedInterview(jobpostId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/interview/passed`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
