import UserProgress from "./components/UserProgress";
import {UserProgressProvider} from "./contexts/UserProgressContext";

function App() {
  const userId = "demo-user"; // replace with real user id when you add auth

  return (
    <div className="page-bg flex items-center justify-center px-4 py-10">
      <UserProgressProvider userId={userId}>
        <UserProgress />
      </UserProgressProvider>
    </div>
  );
}

export default App;
