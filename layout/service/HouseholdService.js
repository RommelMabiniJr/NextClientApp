export const PaymentService = {
    async getServiceNameByID(serviceId) {
        const res = await fetch('/data/services.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        const service = d.data.find(s => s.id === serviceId);
        return service.name;
    },

    async getFrequencyOfPayments() {
        const res = await fetch('/data/frequencyOfPayments.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }
};
