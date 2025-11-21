// Sample courses data
export const automobile_courses = {
  "intro-to-cars": {
    id: "intro-to-cars",
    title: "Introduction to Automobiles",
    description: "Learn the basics of how cars work",
    modules: [
      {
        id: "module-1",
        title: "Car Basics",
        lessons: [
          {id: "lesson-1", title: "How Engines Work", duration: "10 min"},
          {id: "lesson-2", title: "Transmission Systems", duration: "12 min"},
        ],
      },
      {
        id: "module-2",
        title: "Car Maintenance",
        lessons: [
          {id: "lesson-3", title: "Oil Change Basics", duration: "8 min"},
          {id: "lesson-4", title: "Tire Care", duration: "10 min"},
        ],
      },
    ],
  },
  "car-electronics": {
    id: "car-electronics",
    title: "Car Electronics",
    description: "Understanding modern car electronics",
    modules: [
      {
        id: "module-1",
        title: "Electrical Systems",
        lessons: [
          {id: "lesson-1", title: "Battery Fundamentals", duration: "15 min"},
          {id: "lesson-2", title: "Wiring Basics", duration: "12 min"},
        ],
      },
    ],
  },
};

export default {
  automobile_courses,
};
