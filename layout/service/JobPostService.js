import axios from "axios";

export const JobPostService = {
  /**
   * Gets all job posts.
   * @returns {Promise} - The promise object representing the job posts.
   */
  async getAllJobPosts() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/post`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Gets a job post by id.
   * @param {number} jobpostId - The job post id.
   * @returns {Promise} - The promise object representing the job post.
   */
  async getJobPostFull(jobpostId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/post/full/${jobpostId}`
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Gets a short version of job post by id.
   * @param {number} jobpostId - The job post id.
   * @returns {Promise} - The promise object representing the job post.
   *
   */
  async getJobPostShort(jobpostId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/post/${jobpostId}/short`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Creates a job post.
   * @param {Object} jobpost - The job post object.
   * @returns {Promise} - The promise object representing the job post.
   */
  async createJobPost(jobpost) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/post`,
        jobpost
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Updates a job post.
   * @param {number} jobpostId - The job post id.
   * @param {Object} jobpost - The job post object.
   * @returns {Promise} - The promise object representing the job post.
   */
  async updateJobPost(jobpostId, jobpost) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/post/${jobpostId}`,
        jobpost
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getApplicants(jobpostId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/employer/job-applicants/${jobpostId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
