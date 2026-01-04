import Course from "../models/course.js";

// Get all courses, optionally filtered by domain and/or branch
export const getCourses = async (req, res) => {
  try {
    const { domain, branch } = req.query;
    const query = {};
    
    if (domain) query.domain = domain;
    if (branch) query.branch = branch;
    
    const courses = await Course.find(query).sort({ createdAt: -1 });
    
    // Group by domain and branch
    const grouped = {};
    courses.forEach((course) => {
      if (!grouped[course.domain]) {
        grouped[course.domain] = {};
      }
      if (!grouped[course.domain][course.branch]) {
        grouped[course.domain][course.branch] = [];
      }
      grouped[course.domain][course.branch].push(course);
    });
    
    res.status(200).json({ courses: grouped, raw: courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new course
export const createCourse = async (req, res) => {
  try {
    const { domain, branch, courseKey, name, topics } = req.body;
    
    if (!domain || !branch || !courseKey || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Check if courseKey already exists
    const existing = await Course.findOne({ courseKey });
    if (existing) {
      return res.status(400).json({ error: "Course key already exists" });
    }
    
    const course = new Course({
      domain,
      branch,
      courseKey,
      name,
      topics: topics || [],
    });
    
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Course key already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update entire course
export const updateCourse = async (req, res) => {
  try {
    const { name, topics } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    if (name) course.name = name;
    if (topics !== undefined) course.topics = topics;
    
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Partial update
export const patchCourse = async (req, res) => {
  try {
    const updates = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        course[key] = updates[key];
      }
    });
    
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add topic to course
export const addTopic = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    course.topics.push(topic);
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Replace all topics
export const replaceTopics = async (req, res) => {
  try {
    const { topics } = req.body;
    if (!Array.isArray(topics)) {
      return res.status(400).json({ error: "Topics must be an array" });
    }
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    course.topics = topics;
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete topic by index
export const deleteTopic = async (req, res) => {
  try {
    const topicIndex = parseInt(req.params.topicIndex);
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    if (topicIndex < 0 || topicIndex >= course.topics.length) {
      return res.status(400).json({ error: "Invalid topic index" });
    }
    
    course.topics.splice(topicIndex, 1);
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all courses as JSON (for export)
export const getCoursesAsJson = async (req, res) => {
  try {
    const courses = await Course.find().sort({ domain: 1, branch: 1, name: 1 });
    
    // Format as nested structure similar to static files
    const formatted = {};
    courses.forEach((course) => {
      if (!formatted[course.domain]) {
        formatted[course.domain] = {};
      }
      if (!formatted[course.domain][course.branch]) {
        formatted[course.domain][course.branch] = {};
      }
      formatted[course.domain][course.branch][course.courseKey] = {
        name: course.name,
        topics: course.topics,
      };
    });
    
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk import/update from JSON
export const bulkImportCourses = async (req, res) => {
  try {
    const { courses } = req.body; // Expected format: { domain: { branch: { courseKey: { name, topics } } } }
    
    if (!courses || typeof courses !== "object") {
      return res.status(400).json({ error: "Invalid courses format" });
    }
    
    const results = { created: 0, updated: 0, errors: [] };
    
    for (const [domain, branches] of Object.entries(courses)) {
      for (const [branch, courseList] of Object.entries(branches)) {
        for (const [courseKey, courseData] of Object.entries(courseList)) {
          try {
            const existing = await Course.findOne({ courseKey });
            
            if (existing) {
              existing.name = courseData.name;
              existing.topics = courseData.topics || [];
              existing.domain = domain;
              existing.branch = branch;
              await existing.save();
              results.updated++;
            } else {
              const newCourse = new Course({
                domain,
                branch,
                courseKey,
                name: courseData.name,
                topics: courseData.topics || [],
              });
              await newCourse.save();
              results.created++;
            }
          } catch (error) {
            results.errors.push({ courseKey, error: error.message });
          }
        }
      }
    }
    
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

