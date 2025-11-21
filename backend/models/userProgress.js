import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
    xp: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Method to update streak and XP
userProgressSchema.methods.updateProgress = async function (xpEarned = 10) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = this.lastActiveDate ? new Date(this.lastActiveDate) : null;
  const lastActiveDate = lastActive
    ? new Date(lastActive.setHours(0, 0, 0, 0))
    : null;

  // Check if this is a new day
  if (!lastActiveDate || lastActiveDate < today) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset streak if more than one day has passed
    if (lastActiveDate && lastActiveDate < yesterday) {
      this.currentStreak = 1;
    } else {
      // Increment streak
      this.currentStreak += 1;
    }

    // Update longest streak if needed
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
  }

  // Update XP and last active date
  this.xp += xpEarned;
  this.lastActiveDate = new Date();
  this.lastLogin = new Date();

  return this.save();
};

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

export default UserProgress;
