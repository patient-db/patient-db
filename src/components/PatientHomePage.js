import React, {useState, useEffect} from "react";
import AddRecord from "./AddRecord";
import ShowRecords from "./ShowRecords";
import '../styles/patienthome.css';
import PatientProfile from "./PatientProfile";
import { useNavigate } from "react-router-dom";

function PatientHomePage(){
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState("add-record")
    const [patientId, setPatientId] = useState(null)
    useEffect(() => {
        const patId = window.localStorage.getItem("patient_uid")
        if (patId === "" || !patId){
            navigate("/")
        } else {
            setPatientId(patId)
        }
    }, [])

    const handleLogout = () => {
        window.localStorage.removeItem("patient_uid")
        navigate("/")
    }
    return (
        <>
        {
            patientId === null ? <div>Loading</div> : 
        <div className="patient-home-wrapper">
            <div className="menu-wrapper">
                <div className="menu">
                    <div onClick={() => setActiveSection("add-record")}>
                        <h3>Add a record</h3>
                    </div>
                    <div onClick={() => setActiveSection("medical-history")}>
                        <h3>Medical history</h3>
                    </div>
                    <div onClick={() => setActiveSection("patient-profile")}>
                        <h3>Profile</h3>
                    </div>
                    <div onClick={handleLogout}>
                        <h3>Logout</h3>
                    </div>
                </div>
                <div className="menu-separator"></div>
            </div>
            <div className="main-content">
                {
                    activeSection === "add-record" 
                    ? <AddRecord />
                    : activeSection === "medical-history" 
                    ? <ShowRecords />
                    : <PatientProfile patientId={patientId} />
                }
            </div>
        </div>
            }
            </>
    )
}

export default PatientHomePage;