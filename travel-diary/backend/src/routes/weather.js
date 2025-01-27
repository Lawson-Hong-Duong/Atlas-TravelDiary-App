const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not found' });
  }

  try {
    const currentWeatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric',
      },
    });

    const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric',
      },
    });

    const currentWeather = currentWeatherResponse.data;
    const forecast = forecastResponse.data.list.filter((item, index) => {
      // Show forecast at 12:00 PM (or any consistent time you prefer) for each day
      return item.dt_txt.includes("12:00:00");
    }).map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    const weatherData = {
      current: {
        temperature: currentWeather.main.temp,
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon,
      },
      forecast,
    };

    res.json(weatherData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;