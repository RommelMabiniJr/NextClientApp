import axios from "axios";

export const UUIDService = {
  async getUserId(uuid) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/uuid/${uuid}/user-id`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
