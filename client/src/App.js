import { Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import HomePage from "./pages/HomePage";
// import Add_student from "./pages/Add_student";
import Student_details from "./pages/Student_details.js";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/upload" element={<UploadPage />}></Route>
        <Route path="/Student_Details" element={<Student_details/>}></Route>
      </Routes>
    </>
  );
}

export default App;

