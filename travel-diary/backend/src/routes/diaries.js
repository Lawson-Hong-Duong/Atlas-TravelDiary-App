const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Diary = require('../models/Diary');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const authOptional = require('../middleware/authOptional');

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
const uploadMultiple = multer({ storage: storage }).any();

// Create a new diary
router.post('/', auth, upload.single('photo'), async (req, res) => {
  const { diaryName } = req.body;
  const photoUrl = req.file
    ? `/uploads/${req.file.filename}`
    : '';

  try {
    const newDiary = new Diary({
      user: req.user.id,
      diaryName,
      photoUrl,
    });

    const diary = await newDiary.save();

    res.json(diary);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all diaries for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const diaries = await Diary.find({ user: req.user.id });
    res.json(diaries);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all chapters with location data
router.get('/chapters-with-location', authOptional, async (req, res, next) => {
  try {
    let query;
    if (req.user && req.user.id) {
      query = {
        $or: [
          { visibility: 'public' },
          { user: req.user.id },
        ],
      };
    } else {
      query = { visibility: 'public' };
    }

    const diaries = await Diary.find(query);

    let chaptersWithLocation = [];
    diaries.forEach((diary) => {
      diary.chapters.forEach((chapter) => {
        if (
          chapter.latitude != null &&
          chapter.longitude != null &&
          !isNaN(chapter.latitude) &&
          !isNaN(chapter.longitude)
        ) {
          chaptersWithLocation.push({
            _id: chapter._id,
            title: chapter.title,
            date: chapter.date,
            latitude: chapter.latitude, 
            longitude: chapter.longitude,
            diaryId: diary._id,
          });
        }
      });
    });

    res.json(chaptersWithLocation);
  } catch (err) {
    next(err); 
  }
});

// Get a specific diary
router.get('/:id', authOptional, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);

    if (!diary) {
      return res.status(404).json({ msg: 'Diary not found' });
    }

    const isOwner = req.user && diary.user.toString() === req.user.id;

    if (diary.visibility === 'private' && !isOwner) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json({
      ...diary.toObject(),
      isOwner,
    });
  } catch (err) {
    res.status(500);
  }
});

// Delete a diary
router.delete('/:id', auth, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);

    if (!diary) {
      return res.status(404).json({ msg: 'Diary not found' });
    }

    if (diary.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorised' });
    }

    await diary.deleteOne();

    res.json({ msg: 'Diary deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a chapter from a diary
router.delete('/:diaryId/chapters/:chapterId', auth, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.diaryId);

    if (!diary) {
      return res.status(404).json({ msg: 'Diary not found' });
    }

    if (diary.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorised' });
    }

    const updatedDiary = await Diary.findByIdAndUpdate(
      req.params.diaryId,
      { $pull: { chapters: { _id: req.params.chapterId } } },
      { new: true }
    );

    res.json({ msg: 'Chapter removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});


// Create a new empty chapter
router.post('/:diaryId/chapters/new', auth, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.diaryId);

    if (!diary) {
      return res.status(404).json({ msg: 'Diary not found' });
    }

    if (diary.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorised' });
    }

    const { title, date, content, latitude, longitude } = req.body;

    let weatherData = null;
    if (latitude && longitude) {
      weatherData = await getWeatherData(latitude, longitude);
    }

    const newChapter = {
      title: title || 'Untitled Chapter',
      content: content || '',
      date: date || new Date(),
      photos: [],
      latitude: latitude || null,
      longitude: longitude || null,
      weather: weatherData,
    };

    diary.chapters.push(newChapter);
    await diary.save();

    const addedChapter = diary.chapters[diary.chapters.length - 1];
    res.json(addedChapter);
  } catch (err) {
    res.status(500);
  }
});

async function getWeatherData(lat, lon) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric',
        },
      }
    );

    const data = response.data;

    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (err) {
    return null;
  }
}

// Get all chapters of a diary
router.get('/:diaryId/chapters', authOptional, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.diaryId);

    if (!diary) {
      return res.status(404).json({ msg: 'Diary not found' });
    }

    const isOwner = req.user && diary.user.toString() === req.user.id;

    if (diary.visibility === 'private' && !isOwner) {
      return res.status(403);
    }

    res.json(diary.chapters);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get a specific chapter
router.get('/:diaryId/chapters/:chapterId', authOptional, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.diaryId);

    if (!diary) {
      return res.status(404).json({ msg: 'Diary not found' });
    }

    const isOwner = req.user && diary.user.toString() === req.user.id;
    const isPublic = diary.visibility === 'public';

    if (!isOwner && !isPublic) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const chapter = diary.chapters.id(req.params.chapterId);

    if (!chapter) {
      return res.status(404).json({ msg: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update a chapter in a diary
router.put(
  '/:diaryId/chapters/:chapterId',
  auth,
  uploadMultiple,
  async (req, res) => {
    console.log('req.body:', req.body);
    console.log('latitude:', req.body.latitude);
    console.log('longitude:', req.body.longitude);

    const { title, content, date, backgroundColor } = req.body;
    const latitude = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude = req.body.longitude ? parseFloat(req.body.longitude) : null;

    try {
      const diary = await Diary.findById(req.params.diaryId);

      if (!diary) {
        return res.status(404).json({ msg: 'Diary not found' });
      }

      if (diary.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorised' });
      }

      const chapter = diary.chapters.id(req.params.chapterId);

      if (!chapter) {
        return res.status(404).json({ msg: 'Chapter not found' });
      }

      if (title) chapter.title = title;
      if (content) chapter.content = content;
      if (date) chapter.date = date;
      if (backgroundColor) chapter.backgroundColor = backgroundColor;
      if (!isNaN(latitude)) chapter.latitude = latitude;
      if (!isNaN(longitude)) chapter.longitude = longitude;

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const weatherData = await getWeatherData(latitude, longitude);
        chapter.weather = weatherData;
      }

      if (req.files && req.files.length > 0) {
        const photoUrls = req.files
          .filter((file) => file.fieldname === 'photos')
          .map((file) => `/uploads/${file.filename}`);
        chapter.photos = chapter.photos.concat(photoUrls);
      }

      await diary.save();

      res.json(chapter);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// Update diary visibility
router.put('/:id/visibility', auth, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);

    if (!diary) {
      return res.status(404);
    }

    if (diary.user.toString() !== req.user.id) {
      return res.status(403);
    }

    const { visibility } = req.body;
    if (!['public', 'private'].includes(visibility)) {
      return res.status(400);
    }

    diary.visibility = visibility;
    await diary.save();

    res.json({ visibility: diary.visibility });
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
