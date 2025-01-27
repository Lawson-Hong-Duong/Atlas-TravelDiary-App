require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const auth = require('./middleware/authMiddleware');
const geocodeRouter = require('./routes/geocode');
const weatherRouter = require('./routes/weather'); 
const diariesRouter = require('./routes/diaries');
const tripsRouter = require('./routes/trips');
const eventsRouter = require('./routes/events');

const app = express();
app.use(cors({
  origin: 'https://group-project-gwdp-monday-12pm-biggroup-1.onrender.com',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/uploads', express.static('uploads'));
app.use('/api/geocode', geocodeRouter);
app.use('/api/weather', weatherRouter); 
app.use('/api/diaries', diariesRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/events', eventsRouter);

const path = require('path');
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  }
});

connectDB();

app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/api/protected', auth, (req, res) => {
  res.send('This is a protected route');
});
