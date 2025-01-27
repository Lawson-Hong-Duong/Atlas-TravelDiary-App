const mongoose = require('mongoose');

const InformationSchema = new mongoose.Schema({
  type: String,
  data: mongoose.Schema.Types.Mixed, 
});

const TripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  tripName: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  photoUrl: {
    type: String,
  },
  budget: {
    type: Number,
    default: 1000, 
  },
  information: [InformationSchema],
});

module.exports = mongoose.model('Trip', TripSchema);
