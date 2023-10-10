import axios from "axios";

const URL = 'https://api.openweathermap.org/data/2.5/weather';

const API_KEY = '254414c344bfd127a52b8bf0f699db7c';

export const fetchWeather = async(query) => {
    const {data} = await axios.get(URL, {
        params:{
            q: query,
            units:'metric',
            APPID: API_KEY,
        }
    });

    return data;
}