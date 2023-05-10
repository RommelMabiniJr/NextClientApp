import regionVIIIJson from "../../public/data/region-viii-with-coordinates.json";
const DistanceCalculator = require('../../lib/distanceCalc').default;

export const LocationService = {
    async getCertificates() {
        const res = await fetch('/data/region-viii-with-coordinates.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    },

    async getCoordinates(province, municipality) {
        const municipalityData = regionVIIIJson[province].municipality_list[municipality];
        const lat = municipalityData.lat;
        const long = municipalityData.long;
        return { lat, long };
    },

    async calculateDistancesToAllMunicipalities(province, municipality) {
        const municipalityData = regionVIIIJson[province].municipality_list[municipality];
        const lat = municipalityData.lat;
        const long = municipalityData.long;
        const distances = [];
        for (const municipality in regionVIIIJson[province].municipality_list) {
            const municipalityData = regionVIIIJson[province].municipality_list[municipality];
            const lat2 = municipalityData.lat;
            const long2 = municipalityData.long;
            const distance_val = DistanceCalculator.calculateDistance(lat, long, lat2, long2);
            distances.push({ municipality, distance_val });
        }
        return distances;
    }
};
