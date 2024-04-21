import React, {useState, useEffect} from "react";
import {json, useNavigate} from "react-router-dom";
import '../styles/managefamily.css';
import Modal from 'react-modal';

function ManageFamily(){
    const navigate = useNavigate();
    const [patientId, setPatientId] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [patientName, setPatientName] = useState("")
    const [age, setAge] = useState(0)
    const [weight, setWeight] = useState(0)
    const [height, setHeight] = useState(0)
    const [gender, setGender] = useState("Male")
    const [bloodGroup, setBloodGroup] = useState("")
    const [members, setMembers] = useState([])

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }
    useEffect(() => {
        const BASE = process.env.REACT_APP_BASE_URL
        const patId = window.localStorage.getItem("patient_uid")
        if (patId === "" || !patId){
            navigate("/")
            return
        } else {
            setPatientId(patId)
            fetch(BASE + "/family?owner_id=" + patId)
            .then(res => res.json())
            .then(data => {
                if (data.error){
                    alert(data.error)
                } else {
                    setMembers(data.members)
                }
            })
            .catch(e => alert("Some error occured"))
        }
    }, [])
    const addMember = async () => {
        const BASE = process.env.REACT_APP_BASE_URL
        const payload = {
            "name": patientName,
            "age": age,
            "weight": weight,
            "height": height,
            "blood_group": bloodGroup,
            "gender": gender,
            "owner_id": patientId
        }

        try {
            const res = await fetch(BASE + "/family", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            })
            const jsonRes = await res.json()
            if (jsonRes.error !== undefined) {
                alert(jsonRes.error)
            } else {
                alert(jsonRes.message)
            }
        } catch {
            alert("Some error occured")
        }
    }
    return ( 
        <div className="manage-family-wrapper">
            <h1>Manage Family</h1>
            <h2>Family Members</h2>
            <div className="family-members">
                {
                    [...Array.from(members.map(i => {
                        return (
                            <div className="family-member">
                                <h3>{i[1]}</h3>
                                <p>Age: {i[2]}</p>
                                <p>Gender: {i[6]}</p>
                                <p>Weight (kg): {i[3]}</p>
                                <p>Height (cm): {i[4]}</p>
                                <p>Blood Group: {i[5]}</p>
                            </div>
                        )
                    }))]
                }
            </div>
            <button id="add-member-btn" onClick={openModal}>Add Member</button>
            <Modal isOpen={modalOpen} onRequestClose={closeModal}>
                {
                    <div className="add-member-form">
                        <h1>Add Member</h1>
                        <input type="text" placeholder="Name" onChange={(e) => setPatientName(e.target.value)}></input>
                        <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)}></input>
                        <select onChange={(e) => setGender(e.target.value)}>
                            <option selected={true}>Male</option>
                            <option>Female</option>
                        </select>
                        <input type="number" placeholder="Weight (kg)" onChange={(e) => setWeight(e.target.value)}></input>
                        <input type="number" placeholder="Height (cm)" onChange={(e) => setHeight(e.target.value)}></input>
                        <input type="text" placeholder="Blood Group" onChange={(e) => setBloodGroup(e.target.value)}></input>
                        <button onClick={addMember}>Add Member</button>
                    </div>
                }
            </Modal>
        </div>
    )
}

export default ManageFamily