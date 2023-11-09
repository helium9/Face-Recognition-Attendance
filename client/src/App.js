import { Routes, Route } from "react-router-dom";
import AttendanceUploadPage from "./pages/AttendanceUploadPage";
import HomePage from "./pages/HomePage";
import Courses from "./pages/Courses";
import Config from "./pages/Config";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/courses" element={<Courses />}></Route>
        <Route path="/takeattendance" element={<AttendanceUploadPage />}></Route>
        <Route path="/config" element={<Config />}></Route>
      </Routes>
    </>
  );
}

export default App;

