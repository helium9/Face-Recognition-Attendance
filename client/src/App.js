import { Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import HomePage from "./pages/HomePage";
import Courses from "./pages/Courses";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/courses" element={<Courses />}></Route>
        <Route path="/takeattendance" element={<UploadPage />}></Route>
      </Routes>
    </>
  );
}

export default App;

