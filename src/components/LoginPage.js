import React, {useState, useEffect} from "react";
import '../styles/loginpage.css';
import {useNavigate} from "react-router-dom";

function LoginPage(){
    const [formType, setFormType] = useState("login")
    const [userType, setUserType] = useState("doctor")
    const [doctorBtnClass, setDoctorBtnClass] = useState("button-active")
    const [patientBtnClass, setPatientBtnClass] = useState("button-inactive")
    const navigate = useNavigate();
    useEffect(() => {
        if (userType === "doctor"){
            setDoctorBtnClass("button-active")
            setPatientBtnClass("button-inactive")
        } else {
            setDoctorBtnClass("button-inactive")
            setPatientBtnClass("button-active")
        }
    }, [userType])

    const handleBtn = (e, type) => {
        e.preventDefault()
        setUserType(type)
    }

    const handleSubmit = async (e) => {
        const BASE = process.env.REACT_APP_BASE_URL
        e.preventDefault();
        if (formType === "register"){
            if (userType === "doctor"){
                const payload = {
                    email: e.target[2].value,
                    password: e.target[3].value,
                    name: e.target[4].value,
                    specialization: e.target[5].value,
                    phone_number: e.target[6].value
                }
                try {
                    const res = await fetch(BASE + "/doctor/register", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(payload)
                    })
                    const jsonRes = await res.json()
                    console.log(jsonRes)
                    if (jsonRes.error !== undefined){
                        alert(jsonRes.error)
                    } else {
                        window.localStorage.setItem("doctor_uid", jsonRes.uid)
                        alert("Registration successful")
                        navigate("/doctor/profile")
                    }
                } catch {
                    alert("Some error occured")
                }
            } else if (userType === "patient"){
                const payload = {
                    email: e.target[2].value,
                    password: e.target[3].value,
                    name: e.target[4].value,
                    phone_number: e.target[5].value,
                    age: e.target[6].value,
                    gender: e.target[7].value,
                    weight: e.target[8].value,
                    height: e.target[9].value,
                    blood_group: e.target[10].value
                }
                try {
                    const res = await fetch(BASE + "/patient/register", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(payload)
                    })
                    const jsonRes = await res.json()
                    console.log(jsonRes)
                    if (jsonRes.error !== undefined){
                        alert(jsonRes.error)
                    } else {
                        window.localStorage.setItem("patient_uid", jsonRes.uid)
                        alert("Registration successful")
                        navigate("/patient/profile")
                    }
                } catch {
                    alert("Some error occured")
                }
            }
        } else if (formType === "login"){
            if (userType === "doctor"){
                const payload = {
                    email: e.target[2].value,
                    password: e.target[3].value
                }
                try {
                    const res = await fetch(BASE + "/doctor/login", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(payload)
                    })
                    const jsonRes = await res.json()
                    if (jsonRes.error !== undefined){
                        alert(jsonRes.error)
                    } else {
                        window.localStorage.setItem("doctor_uid", jsonRes.doctor_id)
                        alert("Login successful")
                        navigate("/doctor/profile")
                    }
                } catch {
                    alert("Some error occured")
                }
            } else if (userType === "patient"){
                const payload = {
                    email: e.target[2].value,
                    password: e.target[3].value
                }
                try {
                    const res = await fetch(BASE + "/patient/login", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(payload)
                    })
                    const jsonRes = await res.json()
                    if (jsonRes.error !== undefined){
                        alert(jsonRes.error)
                    } else {
                        window.localStorage.setItem("patient_uid", jsonRes.patient_id)
                        alert("Login successful")
                        navigate("/patient/profile")
                    }
                } catch {
                    alert("Some error occured")
                }
            }
        }
    }
    return (
        <div className="login-wrapper">
            <form id="login-form" className={formType === "login" ? "form-active" : "form-inactive"} onSubmit={(e) => handleSubmit(e)}>
                <h1>Login</h1>
                <div className="login-as-wrapper">
                    <button className={doctorBtnClass} onClick={(e) => handleBtn(e, "doctor")}>Doctor</button>
                    <button className={patientBtnClass} onClick={(e) => handleBtn(e, "patient")}>Patient</button>
                </div>
                <div className="form-inputs">
                    <input type="email"placeholder="Email"></input>
                    <input type="password"placeholder="Password"></input>
                    <button type="submit">Login</button>
                </div>
                <p onClick={() => setFormType("register")}>Don't have an account?</p>
            </form>
            <form id="register-form" className={formType === "register" ? "form-active" : "form-inactive"} onSubmit={(e) => handleSubmit(e)}>
                <h1>Register</h1>
                <div className="register-as-wrapper">
                    <button className={doctorBtnClass} onClick={(e) => handleBtn(e, "doctor")}>Doctor</button>
                    <button className={patientBtnClass} onClick={(e) => handleBtn(e, "patient")}>Patient</button>
                </div>
                <div className="form-inputs">
                    <input type="email"placeholder="Email"></input>
                    <input type="password"placeholder="Password"></input>
                    <input type="text" placeholder="Name"></input>
                    {
                        userType === "doctor"
                        ? <>
                            <input type="text" placeholder="Specialization"></input>
                            <input type="number" placeholder="Phone Number"></input>
                        </>
                        : <>
                            <input type="number" placeholder="Phone Number"></input>
                            <input type="number" placeholder="Age"></input>
                            <select>
                                <option selected={true} value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <input type="number" placeholder="Weight (kg)"></input>
                            <input type="number" placeholder="Height (cm)"></input>
                            <input type="text" placeholder="Blood Group"></input>
                        </>
                    }
                    <button type="submit">Register</button>
                </div>
                <p onClick={() => setFormType("login")}>Already have an account?</p>
            </form>
        </div>
    )
}

export default LoginPage;