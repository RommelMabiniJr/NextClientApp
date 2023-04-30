const getCoordinates = async (location) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: location,
                format: 'json',
                limit: 1,
            },
        });

        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { latitude: lat, longitude: lon };
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}