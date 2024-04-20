import React from "react";
import LoginPage from "./components/LoginPage";
import AddRecord from "./components/AddRecord";
import ShowRecords from "./components/ShowRecords";
import PatientHomePage from "./components/PatientHomePage";
import PatientProfile from "./components/PatientProfile";
import DoctorProfile from "./components/DoctorProfile";
import DoctorHomePage from "./components/DoctorHomePage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/doctor/profile" element={<DoctorHomePage />} />
        <Route path="/patient/profile" element={<PatientHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
