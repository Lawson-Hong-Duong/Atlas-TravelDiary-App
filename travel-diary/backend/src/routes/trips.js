const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Trip = require('../models/Trip');
const multer = require('multer');
const path = require('path');

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Create a new trip
router.post('/', auth, upload.single('photo'), async (req, res) => {
  const { tripName, destination, startDate, endDate } = req.body;
  const photoUrl = req.file
    ? `/uploads/${req.file.filename}`
    : '';

  try {
    const newTrip = new Trip({
      user: req.user.id,
      tripName,
      destination,
      startDate,
      endDate,
      photoUrl,
    });

    const trip = await newTrip.save();

    res.json(trip);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id });
    res.json(trips);
  } catch (err) {
    res.status(500);
  }
});

// Get a trip
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404);
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401);
    }

    res.json(trip);
  } catch (err) {
    res.status(500);
  }
});

// Delete a trip
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404);
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401);
    }

    await trip.deleteOne();

    res.json({ msg: 'deleted' });
  } catch (err) {
    res.status(500);
  }
});

// Add info to a trip
router.post('/:id/information', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404);
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401);
    }

    const { type, ...data } = req.body;
    const newInfo = {
      type,
      data,
    };

    trip.information.push(newInfo);
    await trip.save();

    res.json(trip);
  } catch (err) {
    res.status(500);
  }
});

router.delete('/:tripId/information/:infoId', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404);
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401);
    }

    trip.information = trip.information.filter(
      (info) => info._id.toString() !== req.params.infoId
    );

    await trip.save();

    res.json(trip);
  } catch (err) {
    res.status(500);
  }
}); 
  
// Get information
router.get('/:tripId/information/:infoId', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404);
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401);
    }

    const infoItem = trip.information.id(req.params.infoId);
    if (!infoItem) {
      return res.status(404);
    }

    res.json(infoItem);
  } catch (err) {
    res.status(500);
  }
});

// Update information
router.put('/:tripId/information/:infoId', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404);
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401);
    }

    const infoItem = trip.information.id(req.params.infoId);
    if (!infoItem) {
      return res.status(404);
    }

    infoItem.data = req.body;
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500);
  }
});

// Update budget
router.put('/:id/budget', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404);
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401);
    }

    trip.budget = req.body.budget;
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
