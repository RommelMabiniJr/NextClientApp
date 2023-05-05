export const CertificateService = {
    async getCertificates() {
        const res = await fetch('/data/certifications.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }
};
