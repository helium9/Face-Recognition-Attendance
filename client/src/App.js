import { Routes, Route } from "react-router-dom";
import AttendanceUploadPage from "./pages/AttendanceUploadPage";
import HomePage from "./pages/HomePage";
import Courses from "./pages/Courses";
import Config from "./pages/Config";
// import Add_student from "./pages/Add_student";
import Student_details from "./pages/Student_details.js";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/courses" element={<Courses />}></Route>
        <Route path="/takeattendance" element={<AttendanceUploadPage />}></Route>
        <Route path="/config" element={<Config />}></Route>
        <Route path="/Student_Details" element={<Student_details/>}></Route>
      </Routes>
    </>
  );
}

export default App;

