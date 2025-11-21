import UserProgress from "../models/userProgress.js";

// Get user progress or create if not exists
export const getUserProgress = async (req, res) => {
  try {
    let progress = await UserProgress.findOne({userId: req.params.userId});

    if (!progress) {
      progress = new UserProgress({userId: req.params.userId});
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

// Update user progress
export const updateUserProgress = async (req, res) => {
  try {
    let progress = await UserProgress.findOne({userId: req.params.userId});

    if (!progress) {
      progress = new UserProgress({userId: req.params.userId});
    }

    const xpEarned = req.body.xpEarned || 10;
    await progress.updateProgress(xpEarned);

    res.json(progress);
  } catch (error) {
    console.error("Error updating user progress:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

// Get user streak information
export const getUserStreak = async (req, res) => {
  try {
    const progress = await UserProgress.findOne({userId: req.params.userId});

    if (!progress) {
      return res.status(404).json({error: "User progress not found"});
    }

    res.json({
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      lastActiveDate: progress.lastActiveDate,
    });
  } catch (error) {
    console.error("Error fetching user streak:", error);
    res.status(500).json({error: "Internal server error"});
  }
};
