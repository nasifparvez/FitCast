import axios from "axios";
const PEXELS_API_KEY = 'AV92fWeGz3xTdXGJJvFxHjSuGPMP7Gvx4w5U7RKEsgaWGXHxcdO9wx1R';



const fetchClothingImages = async (clothingName) => {
    try {
        const response = await axios.get(`https://api.pexels.com/v1/search?query=${clothingName}&per_page=1`, {
            headers: {
                'Authorization': PEXELS_API_KEY,
            },
        });

        if (response.data.photos && response.data.photos.length > 0) {
            // Extract the first image URL
            const imageURL = response.data.photos[0].src.original;
            console.log(`Image found for ${clothingName}: ${imageURL}`); // Debugging
            return imageURL;
        } else {
            console.log(`No image found for ${clothingName}`); // Debugging
        }
    } catch (error) {
        console.error('Error fetching image from Pexels:', error);
    }

    return null; // Return null if no image is found
};

export const fetchClothesWithImages = async (temperature, conditions) => {
    try {
        let searchRecommendations = [];
        const currentMonth = new Date().getMonth() + 1;
        let season = '';

        if (currentMonth >= 3 && currentMonth <= 5) {
            season = 'spring';
        } else if (currentMonth >= 6 && currentMonth <= 8) {
            season = 'summer';
        } else if (currentMonth >= 9 && currentMonth <= 11) {
            season = 'fall';
        } else {
            season = 'winter';
        }

        switch (season) {
            case 'spring':
                searchRecommendations.push('Light jacket', 'Umbrella');
                break;
            case 'summer':
                searchRecommendations.push('T-shirt', 'Shorts', 'Sunglasses', 'Sunscreen');
                break;
            case 'fall':
                searchRecommendations.push('Sweater', 'Jeans', 'Boots');
                break;
            case 'winter':
                searchRecommendations.push('Heavy jacket', 'Scarf', 'Gloves', 'Boots');
                break;
            default:
                break;
        }

        if (conditions.includes('rain')) {
            searchRecommendations.push('Raincoat', 'Waterproof shoes');
        }
        if (conditions.includes('snow')) {
            searchRecommendations.push('Snow boots', 'Thermal layers');
        }
        if (temperature < 0) {
            searchRecommendations.push('Extreme cold gear', 'Insulated gloves');
        } else if (temperature >= 0 && temperature < 10) {
            searchRecommendations.push('Thermal undergarments', 'Warm hat');
        } else if (temperature >= 10 && temperature < 20) {
            searchRecommendations.push('Light jacket', 'Sweatshirt', 'Long pants');
        } else if (temperature >= 20 && temperature < 30) {
            searchRecommendations.push('T-shirt', 'Shorts', 'Sandals');
        } else if (temperature >= 30) {
            searchRecommendations.push('Swimwear', 'Flip-flops', 'Sunglasses');
        } else {
            searchRecommendations.push('Regular clothing');
        }

        // Fetch clothing images and create an array of objects
        const clothingObjectsWithImages = await Promise.all(searchRecommendations.map(async (clothingName) => {
            const imageURL = await fetchClothingImages(clothingName);
            return { name: clothingName, imageURL };
        }));
        console.log(clothingObjectsWithImages)
        return clothingObjectsWithImages;
    } catch (error) {
        console.error('Error in fetchClothesWithImages:', error);
        return [];
    }
};