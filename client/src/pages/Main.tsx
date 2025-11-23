import {PolymathMap} from "@/components/PolymathMap";
import StreakWidget from "@/components/Streaks";
const Main = () => {
  return (
    <div>
      <div className="absolute left-1/2 top-10 z-100 -translate-x-1/2 -translate-y-1/2 transform">
        <StreakWidget />
      </div>
      <PolymathMap courses={[]} />
    </div>
  );
};

export default Main;
