import {PolymathMap} from "@/components/PolymathMap";
import StreakWidget from "@/components/Streaks";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import {Settings} from "lucide-react";

const Main = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="absolute left-1/2 top-10 z-100 -translate-x-1/2 -translate-y-1/2 transform">
        <StreakWidget />
      </div>
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Admin Panel
        </Button>
      </div>
      <PolymathMap courses={[]} />
    </div>
  );
};

export default Main;
