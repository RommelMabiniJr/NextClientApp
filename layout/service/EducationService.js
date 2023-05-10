export const EducationService = {
    async getEducationLevels() {
        const res = await fetch('/data/education.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }
};
