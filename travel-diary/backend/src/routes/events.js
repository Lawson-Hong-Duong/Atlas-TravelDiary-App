const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get events
router.get('/', async (req, res) => {
  try {
    const { city, date, eventType } = req.query;

    let params = {
      apikey: process.env.EVENT_API_KEY,
      locale: '*',
    };

    if (city) params.city = city;
    if (eventType) params.classificationName = eventType;
    if (date) {
      params.startDateTime = new Date(date).toISOString().split('T')[0] + 'T00:00:00Z';
      params.endDateTime = new Date(date).toISOString().split('T')[0] + 'T23:59:59Z';
    }

    const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
    const response = await axios.get(url, { params });
    const events = response.data._embedded?.events || [];

    const formattedEvents = events.map((event) => ({
      id: event.id,
      name: event.name,
      start: event.dates.start.dateTime,
      url: event.url,
      images: event.images,
      venue: event._embedded?.venues[0]?.name,
      location: event._embedded?.venues[0]?.address?.line1,
      city: event._embedded?.venues[0]?.city?.name,
      priceRanges: event.priceRanges || [],
      classifications: event.classifications || [],
    }));

    res.json(formattedEvents);
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;