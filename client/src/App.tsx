import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Profile from "pages/profile";
import Dashboard from "pages/Dashboard";
import Main from "pages/Main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/" index element={<Main />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
