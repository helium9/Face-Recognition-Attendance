import { Routes, Route } from "react-router-dom";
import AttendanceUploadPage from "./pages/AttendanceUploadPage";
import HomePage from "./pages/HomePage";
import Courses from "./pages/Courses";
import Config from "./pages/Config";
import Config3 from "./pages/Config3";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/courses" element={<Courses />}></Route>
        <Route path="/takeattendance" element={<AttendanceUploadPage />}></Route>
        <Route path="/config" element={<Config />}></Route>
        <Route path="/config2" element={<Config3 />}></Route>
      </Routes>
    </>
  );
}

export default App;

