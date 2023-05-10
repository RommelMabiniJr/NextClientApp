// import data from '../data/philippines.json';

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // set distance in km to 2 decimal places
    return Number(distance.toFixed(2));
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export default {
    calculateDistance
}


// const getCoordinates = async (location) => {
//     try {
//         const response = await axios.get('https://nominatim.openstreetmap.org/search', {
//             params: {
//                 q: location,
//                 format: 'json',
//                 limit: 1,
//             },
//         });

//         if (response.data.length > 0) {
//             const { lat, lon } = response.data[0];
//             return { latitude: lat, longitude: lon };
//         } else {
//             throw new Error('Location not found');
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }