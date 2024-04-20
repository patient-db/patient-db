import React, {useState, useEffect} from "react";
import '../styles/doctorhome.css';
import DoctorProfile from "./DoctorProfile";
import ShowRecordsDoctor from "./ShowResultsDoctor";
import { useNavigate } from "react-router-dom";

function DoctorHomePage(){
    const navigate = useNavigate();
    const [docId, setDocId] = useState(null)
    const [activeSection, setActiveSection] = useState("medical-history")
    useEffect(() => {
        const uid = window.localStorage.getItem("doctor_uid")
        if (uid === "" || !uid){
            navigate("/")
        } else {
            setDocId(uid)
        }
    }, [])
    return (
        <>
            {
                docId === null ? <div>Loading</div>:
            <div className="doctor-home-wrapper">
                <div className="menu-wrapper">
                    <div className="menu">
                        <div onClick={() => setActiveSection("medical-history")}>
                            <h3>Medical history</h3>
                        </div>
                        <div onClick={() => setActiveSection("patient-profile")}>
                            <h3>Profile</h3>
                        </div>
                    </div>
                    <div className="menu-separator"></div>
                </div>
                <div className="main-content">
                    {
                        activeSection === "medical-history" 
                        ? <ShowRecordsDoctor />
                        : <DoctorProfile />
                    }
                </div>
            </div>
            }
        </>
    )
}

export default DoctorHomePage;