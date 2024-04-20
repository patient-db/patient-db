import React, {useState, useEffect} from "react";
import '../styles/doctorprofile.css';

function DoctorProfile({doctorId}){
    const [loading, setLoading] = useState(true)
    const [doctorData, setDoctorData] = useState({})
    const [doctorName, setDoctorName] = useState("")
    const [phoneNum, setPhoneNum] = useState(0)
    const [specialization, setSpecialization] = useState("")

    useEffect(() => {
        async function onInit(){
            try {
                const BASE = process.env.REACT_APP_BASE_URL
                const res = await fetch(BASE + "/doctor?doctor_id=" + doctorId)
                const jsonRes = await res.json()
                if (jsonRes.error !== undefined){
                    alert(jsonRes.error)
                } else {
                    setDoctorData(jsonRes)
                    setDoctorName(jsonRes.name)
                    setSpecialization(jsonRes.specialization)
                    setPhoneNum(jsonRes.phone_number)
                    setLoading(false)
                }
            } catch {
                alert("Some error occured")
            }

        }
        onInit()
    }, [])

    const handleUpdateDetails = async () => {
        const BASE = process.env.REACT_APP_BASE_URL
        const payload = {
            "doctor_id": doctorId,
            "name": doctorName,
            "phone_number": phoneNum,
            "specialization": specialization
        }
        try {
            const res = await fetch(BASE + "/doctor", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            })
            const jsonRes = await res.json()
            if (jsonRes.error !== undefined){
                alert(jsonRes.error)
            } else {
                alert(jsonRes.message)
                window.location.reload()
            }
        } catch {
            alert("Some error occured. Please try again later")
        }
    }
    return (
        <>
        {
            loading ? <div>Loading</div> : 
        <div className="doctor-profile-wrapper">
            <h1>Doctor Details</h1>
            <div className="doctor-profile">
                <section>
                    <label>Email</label>
                    <input type="email" disabled={true} defaultValue={doctorData["email"]}></input>
                </section>
                <section>
                    <label>Name</label>
                    <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} defaultValue={doctorData["name"]}></input>
                </section>
                <section>
                    <label>Phone Number</label>
                    <input type="text" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} defaultValue={doctorData["phone_number"]}></input>
                </section>
                <section>
                    <label>Specilization</label>
                    <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} defaultValue={doctorData["specialization"]}></input>
                </section>
                <button onClick={handleUpdateDetails}>Update details</button>
            </div>
        </div>
        }
        </>
    )
}

export default DoctorProfile;