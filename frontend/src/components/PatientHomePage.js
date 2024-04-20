import React, {useState, useEffect} from "react";
import AddRecord from "./AddRecord";
import ShowRecords from "./ShowRecords";
import '../styles/patienthome.css';
import PatientProfile from "./PatientProfile";
import { useNavigate } from "react-router-dom";
import ManageFamily from "./ManageFamily";

function PatientHomePage(){
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState("add-record")
    const [patientId, setPatientId] = useState(null)
    const [patientName, setPatientName] = useState("")
    useEffect(() => {
        const BASE = process.env.REACT_APP_BASE_URL
        const patId = window.localStorage.getItem("patient_uid")
        if (patId === "" || !patId){
            navigate("/")
        } else {
            setPatientId(patId)
            fetch(BASE + "/patient?patient_id=" + patId)
            .then(res => res.json())
            .then(data => {
                if (data.error !== undefined){
                    alert(data.error)
                } else {
                    setPatientName(data.name)
                }
            })
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
                    <div onClick={() => setActiveSection("manage-family")}>
                        <h3>Manage Family</h3>
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
                    : activeSection === "patient-profile" 
                    ? <PatientProfile patientId={patientId} />
                    : <ManageFamily />
                }
            </div>
            <div id="uid-data-wrapper">
                <p>Hello, {patientName}</p>
                <p>Patient ID: {patientId}</p>
            </div>
        </div>
            }
            </>
    )
}

export default PatientHomePage;