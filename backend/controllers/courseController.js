import domains from "../utils/domain.js";
import {automobile_courses} from "../utils/courses.js";

// Convert topics to lessons structure
const convertTopicsToLessons = (courses) => {
  const converted = {};
  Object.entries(courses).forEach(([courseKey, courseData]) => {
    converted[courseKey] = {
      id: courseKey,
      name: courseData.name,
      description: `Learn about ${courseData.name}`,
      modules: [
        {
          id: `${courseKey}-module-1`,
          title: "Main Topics",
          lessons: courseData.topics.map((topic, index) => ({
            id: `${courseKey}-lesson-${index + 1}`,
            title: topic,
            duration: "15 min",
          })),
        },
      ],
    };
  });
  return converted;
};

export const getCourses = (req, res) => {
  try {
    // Add courses to branches
    const domainsWithCourses = {...domains};
    
    // Add automobile courses to Automobile branch
    if (domainsWithCourses.Mechanical?.branches?.Automobile) {
      domainsWithCourses.Mechanical.branches.Automobile.courses = 
        convertTopicsToLessons(automobile_courses);
    }
    
    res.status(200).json({domains: domainsWithCourses});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
