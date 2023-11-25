import axios from "axios";

export const OfferService = {
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

  async updateOffer(jobpostId, applicationId, offer) {
    try {
      const response = await axios.put(
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

  async getOfferDetailsByJobId(jobpostId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/${jobpostId}/offer-exists`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async acceptOffer(jobpostId, applicationId) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/post/${jobpostId}/job-offer/${applicationId}/accept`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async declineOffer(applicationId, declineReason) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/job-offer/${applicationId}/decline`,
        { declineReason }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
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
};
