import {API_BASE_URL} from "../config";

const api = {
  // Get user progress
  async getUserProgress(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user progress");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user progress:", error);
      throw error;
    }
  },

  // Update user progress
  async updateUserProgress(userId, xpEarned = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/progress/${userId}/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({xpEarned}),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user progress");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating user progress:", error);
      throw error;
    }
  },

  // Get user streak information
  async getUserStreak(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/${userId}/streak`);
      if (!response.ok) {
        throw new Error("Failed to fetch user streak");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user streak:", error);
      throw error;
    }
  },
};

export default api;
