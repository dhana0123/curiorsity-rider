import domains from "../utils/domain.js";

export const getCourses = (req, res) => {
  try {
    res.status(200).json({domains});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
