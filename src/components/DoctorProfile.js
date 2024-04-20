import React, {useState, useEffect} from "react";
import '../styles/doctorprofile.css';

function DoctorProfile(){
    return (
        <div className="doctor-profile-wrapper">
            <h1>Doctor Details</h1>
            <div className="doctor-profile">
                <section>
                    <label>Email</label>
                    <input type="email" disabled={true} value="doctor1@gmail.com"></input>
                </section>
                <section>
                    <label>Name</label>
                    <input type="text" value="Name"></input>
                </section>
                <section>
                    <label>Specilization</label>
                    <input type="text" value="Cardiology"></input>
                </section>
                <button>Update details</button>
            </div>
        </div>
    )
}

export default DoctorProfile;