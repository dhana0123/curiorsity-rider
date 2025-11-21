import React, {createContext, useContext, useState, useEffect} from "react";
import api from "../services/api";

const UserProgressContext = createContext();

export const UserProgressProvider = ({children, userId}) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const data = await api.getUserProgress(userId);
      setProgress(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching progress:", err);
      setError("Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (xpEarned = 10) => {
    try {
      const updatedProgress = await api.updateUserProgress(userId, xpEarned);
      setProgress(updatedProgress);
      return updatedProgress;
    } catch (err) {
      console.error("Error updating progress:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  return (
    <UserProgressContext.Provider
      value={{
        progress,
        loading,
        error,
        updateProgress,
        refreshProgress: fetchProgress,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error(
      "useUserProgress must be used within a UserProgressProvider"
    );
  }
  return context;
};
