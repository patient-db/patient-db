import React, {useState, useEffect} from "react";
import '../styles/doctorhome.css';
import DoctorProfile from "./DoctorProfile";
import ShowRecordsDoctor from "./ShowResultsDoctor";
import { useNavigate } from "react-router-dom";

function DoctorHomePage(){
    const navigate = useNavigate();
    const [docId, setDocId] = useState(null)
    const [docName, setDocName] = useState("")
    const [activeSection, setActiveSection] = useState("medical-history")
    
    useEffect(() => {
        const BASE = process.env.REACT_APP_BASE_URL
        const uid = window.localStorage.getItem("doctor_uid")
        if (uid === "" || !uid){
            navigate("/")
        } else {
            setDocId(uid)
            fetch(BASE + "/doctor?doctor_id=" + uid)
            .then(res => res.json())
            .then(data => {
                if (data.error !== undefined){
                    alert(data.error)
                } else {
                    setDocName(data.name)
                }
            })
        }
    }, [])

    const handleLogout = () => {
        window.localStorage.removeItem("doctor_uid")
        navigate("/")
    }
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
                        <div onClick={handleLogout}>
                            <h3>Logout</h3>
                        </div>
                    </div>
                    <div className="menu-separator"></div>
                </div>
                <div className="main-content">
                    {
                        activeSection === "medical-history" 
                        ? <ShowRecordsDoctor />
                        : <DoctorProfile doctorId={docId} />
                    }
                </div>
                <div id="uid-data-wrapper">
                    <p>Hello, {docName}</p>
                    <p>Doctor ID: {docId}</p>
                </div>
            </div>
            }
        </>
    )
}

export default DoctorHomePage;