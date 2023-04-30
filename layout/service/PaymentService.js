export const PaymentService = {
    async getPaymentMethods() {
        const res = await fetch('/data/paymentMethods.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    },

    async getFrequencyOfPayments() {
        const res = await fetch('/data/frequencyOfPayments.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }
};
