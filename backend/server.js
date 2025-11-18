const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import courses data
const { automobile_courses } = require('./courses');

// API Routes
app.get('/api/courses', (req, res) => {
  res.json(automobile_courses);
});

app.get('/api/courses/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  const course = automobile_courses[courseId];
  
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  
  res.json(course);
});

// Serve static React frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Catch all handler - send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
