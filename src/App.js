import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import MeetingRoom from "./Pages/MeetingRoom";
import PageNotFound from "./Pages/PageNotFound";
import Namecheck from "./Hooks/Namecheck";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />

        <Route element={<Namecheck />}>
          <Route exact path="/Meet" element={<MeetingRoom />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
