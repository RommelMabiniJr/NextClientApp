export const JobsService = {
  async getServices() {
    const res = await fetch("/data/services.json", {
      headers: { "Cache-Control": "no-cache" },
    });
    const d = await res.json();
    return d.data;
  },

  // get service name by id
  async getServiceNameById(id) {
    const services = await this.getServices();
    const service = services.find((s) => s.service_id === id);
    if (!service) return "";
    return service.service_name;
  },
};
