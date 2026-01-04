import domains from "../utils/domain.js";
import {automobile_courses} from "../utils/courses.js";
import Course from "../models/course.js";

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

export const getCourses = async (req, res) => {
  try {
    // Start with static domains structure
    const domainsWithCourses = {...domains};
    
    // Add static automobile courses to Automobile branch
    if (domainsWithCourses.Mechanical?.branches?.Automobile) {
      domainsWithCourses.Mechanical.branches.Automobile.courses = 
        convertTopicsToLessons(automobile_courses);
    }
    
    // Fetch courses from database and merge them
    try {
      const dbCourses = await Course.find().sort({ domain: 1, branch: 1, name: 1 });
      
      dbCourses.forEach((course) => {
        // Ensure domain exists
        if (!domainsWithCourses[course.domain]) {
          domainsWithCourses[course.domain] = {
            name: course.domain,
            branches: {},
          };
        }
        
        // Ensure branch exists
        if (!domainsWithCourses[course.domain].branches[course.branch]) {
          domainsWithCourses[course.domain].branches[course.branch] = {
            name: course.branch,
            courses: {},
          };
        }
        
        // Add or merge course (database courses take precedence over static)
        const courseData = convertTopicsToLessons({
          [course.courseKey]: {
            name: course.name,
            topics: course.topics || [],
          },
        });
        
        domainsWithCourses[course.domain].branches[course.branch].courses = {
          ...domainsWithCourses[course.domain].branches[course.branch].courses,
          ...courseData,
        };
      });
    } catch (dbError) {
      // If database query fails, continue with static files only
      console.error("Error fetching courses from database:", dbError);
    }
    
    res.status(200).json({domains: domainsWithCourses});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
