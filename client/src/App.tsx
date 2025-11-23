import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Main from "@/pages/Main";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/" index element={<Main />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
