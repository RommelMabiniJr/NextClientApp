import axios from "axios";

export const ConfigService = {
  async getConfig(configName, configType) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/configurations`,
      {
        params: {
          configName,
          configType,
        },
      }
    );
    return response;
  },
};
