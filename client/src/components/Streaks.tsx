import {useQuery} from "@tanstack/react-query";
import {getUserStats} from "../api/axiosConfig";

type UserStats = {
  name: string;
  streak: number;
  longestStreak: number;
  xp: number;
};

const FALLBACK_STATS: UserStats = {
  name: "Santhosh Naik",
  streak: 1,
  longestStreak: 2,
  xp: 10,
};

function StreakWidget() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<UserStats>({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    initialData: FALLBACK_STATS,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="rounded-xl border border-border/70 bg-white/95 px-4 py-3 text-xs shadow-[0_4px_0_0_var(--tw-shadow-color)] shadow-primary/30 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
            Streaks & XP
          </span>
          <span className="text-sm font-semibold text-foreground">
            {isLoading ? "Loading..." : stats?.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[0.7rem] text-muted-foreground">Streak</span>
            <span className="text-base font-bold text-primary">
              {isLoading ? "-" : stats?.streak} 🔥
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[0.7rem] text-muted-foreground">XP</span>
            <span className="text-base font-bold text-accent">
              {isLoading ? "-" : stats?.xp}
            </span>
          </div>
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-[0.7rem] text-muted-foreground">Longest</span>
            <span className="text-base font-semibold text-foreground">
              {isLoading ? "-" : stats?.longestStreak}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakWidget;
