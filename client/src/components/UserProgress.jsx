import React from "react";
import {useUserProgress} from "../contexts/UserProgressContext";

const UserProgress = () => {
  const {progress, loading, error, updateProgress} = useUserProgress();

  const handleCompleteActivity = async () => {
    try {
      await updateProgress(10);
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  if (loading)
    return (
      <div className="text-slate-200 text-lg font-medium">
        Loading progress...
      </div>
    );
  if (error)
    return <div className="text-red-400 font-medium">Error: {error}</div>;
  if (!progress)
    return <div className="text-slate-200">No progress data found</div>;

  const level = Math.floor((progress.xp || 0) / 100) + 1;
  const xpInLevel = (progress.xp || 0) % 100;
  const progressPercent = (xpInLevel / 100) * 100;

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Your Progress</h2>
          <p className="text-sm text-slate-400 mt-1">
            Keep riding daily to increase your streak and level up.
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-400/40">
            <span className="mr-1">🔥</span>
            {progress.currentStreak || 0}-day streak
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Best: {progress.longestStreak || 0} days
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
          <span>Level {level}</span>
          <span>{xpInLevel}/100 XP to next level</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all"
            style={{width: `${progressPercent}%`}}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 text-center text-slate-200">
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-3">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            Total XP
          </div>
          <div className="text-xl font-semibold">{progress.xp}</div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-3">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            Level
          </div>
          <div className="text-xl font-semibold">{level}</div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-3">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            Current streak
          </div>
          <div className="text-xl font-semibold">
            {progress.currentStreak || 0}d
          </div>
        </div>
      </div>

      <button
        onClick={handleCompleteActivity}
        className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0"
      >
        Complete Activity
        <span className="ml-2 rounded-full bg-black/20 px-2 py-0.5 text-xs font-medium">
          +10 XP
        </span>
      </button>
    </div>
  );
};

export default UserProgress;
