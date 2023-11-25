import axios from "axios";

export const ApplicationStageServices = {
  async startJobPostApplication(jobpostId) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/application/start`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getCurrentStage(jobpostId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/application/current-stage`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async setCurrentStage(jobpostId, stage) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/application/current-stage`,
        { stage }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async resetStage(jobpostId) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/reset-current-stage`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

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

  /**
   * Retrieves the scheduled interviews for a given job post.
   *
   * @param {string} jobpostId - The ID of the job post to retrieve scheduled interviews for.
   * @returns {Promise<Array<{
   *   interview_id: number,
   *   application_id: number,
   *   scheduled_date: string,
   *   scheduled_time: string,
   *   interview_link: string
   *   is_passed: boolean,
   *   timestamp: string,
   *   status: string,
   * }>>} - A promise that resolves to an array of scheduled interviews.
   */
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

  async sendOffer(jobpostId, applicationId, offer) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/offer/${applicationId}`,
        { offer }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getOfferDetails(jobpostId, applicationId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/offer/${applicationId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async addOfferTimelineEvent(applicationId, timelineEvent) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/offer/${applicationId}/timeline-event`,
        { timelineEvent }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getOfferTimelineEvents(offerId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/offer/${offerId}/timeline-events`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async acceptOffer(jobPostId, applicationId) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/post/${jobPostId}/job-offer/${applicationId}/accept`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
