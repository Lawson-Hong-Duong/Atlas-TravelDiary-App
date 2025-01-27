const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const { lat, lng } = req.query;

  const apiKey = process.env.MAPS_API_KEY;

  if (!apiKey) {
    return res.status(500);
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${lat},${lng}`,
          key: apiKey,
        },
      }
    );

    if (response.data.status !== 'OK') {
      return res
        .status(400);
        }

    const addressComponents = response.data.results[0].address_components;

    let country = '';
    let state = '';
    let city = '';
    let suburb = '';

    addressComponents.forEach((component) => {
      if (component.types.includes('country')) {
        country = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (
        component.types.includes('sublocality') ||
        component.types.includes('sublocality_level_1')
      ) {
        suburb = component.long_name;
      }
    });

    res.json({ country, state, city, suburb });
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
