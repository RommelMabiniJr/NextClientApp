export const JobsService = {
    async getServices() {
        const res = await fetch('/data/services.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }
};
