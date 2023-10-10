import React, { useState, useEffect } from 'react';
import { fetchWeather } from './api/fetchWeather';
import { fetchClothesWithImages } from './api/fetchClothes';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Paper, Typography } from '@mui/material';
import { Photo } from '@mui/icons-material';
import './App.css';

function ImageCarousel({ clothingRecommendations }) {
    return (
        <div className="carousel-container">
            <Carousel showStatus={false} showArrows={true} showThumbs={false} infiniteLoop autoPlay>
                {clothingRecommendations.map((item, index) => (
                    <Paper key={item.name} className="carousel-item">
                        <img
                            src={item.imageURL}
                            alt={item.name}
                            className='carousel-image'
                        />
                        <Typography variant="h6" component="div">
                            {item.name}
                        </Typography>
                    </Paper>
                ))}
            </Carousel>
        </div>
    );
}

function App() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [clothingRecommendations, setClothingRecommendations] = useState([]);
    const [error, setError] = useState('');

    const search = async (e) => {
        if (e.key === 'Enter') {
            if (!query) {
                setError('Please enter a city.');
                return;
            }

            try {
                const weatherData = await fetchWeather(query);

                if (weatherData.cod !== 200) {
                    setError('City not found. Please enter a valid city.');
                    return;
                }

                setWeather(weatherData);

                // Fetch clothing recommendations based on weather data
                const temperature = weatherData.main.temp;
                const conditions = weatherData.weather.map((w) => w.description.toLowerCase());

                const clothingData = await fetchClothesWithImages(temperature, conditions);
                setClothingRecommendations(clothingData);
                setError(''); // Clear any previous error messages
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred. Please try again later or search another city.');
            }
        }
    };

    useEffect(() => {
        console.log(clothingRecommendations, "From App");
    }, [clothingRecommendations]);



    return (
        <div className='main-container'>
            <div className='title-container'>
                <h1>FITCAST</h1>
                <h3>Look Fine, Rain or Shine</h3>
            </div>
            <input
                type='text'
                className='search'
                placeholder='Enter City'
                value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={search}
            />
            {error && <div className="error-message">{error}</div>}
            {weather.main && (
                <div className='city-card'>
                    <h2 className='city-name'>
                        <span>
                            {weather.name}, {weather.sys.country}
                        </span>
                    </h2>
                    <div className='city-temperature'>
                        {Math.round(weather.main.temp)}
                        <sup>&deg;C</sup>&nbsp;/&nbsp;
                        {Math.round(weather.main.temp * 1.8 + 32)}
                        <sup>&deg;F</sup>
                    </div>
                    <div className='info'>
                        <img
                            className='city-icon'
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                        />
                        <p style={{ textTransform: 'capitalize' }}>
                            {weather.weather[0].description}
                        </p>
                    </div>
                    <h2> Clothes to Potentially Wear</h2>
                    <ImageCarousel clothingRecommendations={clothingRecommendations} />
                </div>
            )}
        </div>
    )
}

export default App;
