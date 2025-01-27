const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  photos: [
    {
      type: String,
    },
  ],
  backgroundColor: String,
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  weather: {
    temperature: Number,
    description: String,
    icon: String,
  },
});

const DiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  diaryName: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
  },
  chapters: [ChapterSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private',
  },
});

module.exports = mongoose.model('Diary', DiarySchema);
