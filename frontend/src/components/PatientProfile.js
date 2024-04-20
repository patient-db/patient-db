import React, {useState, useEffect, useRef} from "react";
import '../styles/patientprofile.css';

function PatientProfile({patientId}){
    const [loading, setLoading] = useState(true)
    const [patientData, setPatientData] = useState({})
    const [patientName, setPatientName] = useState("")
    const [age, setAge] = useState("")
    const [bloodGroup, setBloodGroup] = useState("")
    const [weight, setWeight] = useState(0)
    const [height, setHeight] = useState(0)
    const [phoneNum, setPhoneNum] = useState(0)
    const [gender, setGender] = useState("")
    useEffect(() => {
        async function onInit(){
            try {
                const BASE = process.env.REACT_APP_BASE_URL
                const res = await fetch(BASE + "/patient?patient_id=" + patientId)
                const jsonRes = await res.json()
                if (jsonRes.error !== undefined){
                    alert(jsonRes.error)
                } else {
                    setPatientData(jsonRes)
                    setPatientName(jsonRes.name)
                    setAge(jsonRes.age)
                    setBloodGroup(jsonRes.blood_group)
                    setWeight(jsonRes.weight)
                    setHeight(jsonRes.height)
                    setPhoneNum(jsonRes.phone_number)
                    setGender(jsonRes.gender)
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
            "patient_id": patientId,
            "name": patientName,
            "phone_number": phoneNum,
            "age": age,
            "weight": weight,
            "height": height,
            "blood_group": bloodGroup,
            "gender": gender
        }
        try {
            const res = await fetch(BASE + "/patient", {
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
        <div className="patient-profile-wrapper">
            <h1>Patient Details</h1>
            <div className="patient-profile">
                <section>
                    <label>Email</label>
                    <input type="email" disabled={true} value={patientData["email"]}></input>
                </section>
                <section>
                    <label>Name</label>
                    <input type="text" defaultValue={patientData["name"]} onChange={(e) => {
                        setPatientName(e.target.value)
                    }} value={patientName}></input>
                </section>
                <section>
                    <label>Phone Number</label>
                    <input type="number" defaultValue={patientData["phone_number"]} onChange={(e) => {
                        setPhoneNum(e.target.value)
                    }} value={phoneNum}></input>
                </section>
                <section>
                    <label>Age</label>
                    <input type="number" defaultValue={patientData["age"]} onChange={(e) => {
                        setAge(e.target.value)
                    }} value={age} ></input>
                </section>
                <section>
                    <label>Gender</label>
                    <select value={gender} onchange={(e) => setGender(e.target.value)}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </section>
                <section>
                    <label>Weight (kg)</label>
                    <input type="number" defaultValue={patientData["weight"]} onChange={(e) => {
                        setWeight(e.target.value)
                    }} value={weight}></input>
                </section>
                <section>
                    <label>Height (cm)</label>
                    <input type="number" defaultValue={patientData["height"]} onChange={(e) => {
                        setHeight(e.target.value)
                    }} value={height}></input>
                </section>
                <section>
                    <label>Blood Group</label>
                    <input type="text" defaultValue={patientData["blood_group"]} onChange={(e) => {
                        setBloodGroup(e.target.value)
                    }} value={bloodGroup}></input>
                </section>
                <button onClick={handleUpdateDetails}>Update details</button>
            </div>
        </div>
        }
        </>
    )
}

export default PatientProfile;