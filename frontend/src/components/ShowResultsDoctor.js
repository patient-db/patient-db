import React, {useState, useEffect, useRef} from "react";
import Web3 from 'web3';
import { PATIENT_ABI, PATIENT_ADDRESS } from "../contracts/Patient";
import { DATABASE_ABI, DATABASE_ADDRESS } from "../contracts/Database";
import '../styles/showrecords.css';

function ShowRecordsDoctor(){
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [databaseContract, setDatabaseContract] = useState(null);
    const [allData, setAllData] = useState([])
    const patientIdRef = useRef(null)
    const [patientDataReady, setPatientDataReady] = useState(false)
    const [patientData, setPatientData] = useState({})
    const [dataReady, setDataReady] = useState(false)
    const [specialization, setSpecialization] = useState(null);
    useEffect(() => {
        async function onInit(){
            const BASE = process.env.REACT_APP_BASE_URL;
            await window.ethereum.enable();
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            setAccount(account);
            window.ethereum.on('accountsChanged', function (accounts) {
            setAccount(accounts[0])
            });
            const web3 = new Web3(window.ethereum)
            const databaseContractCopy = new web3.eth.Contract(
                DATABASE_ABI,
                DATABASE_ADDRESS,
            )
            setDatabaseContract(databaseContractCopy)
            try {
                const res = await fetch(BASE + "/doctor?doctor_id=" + window.localStorage.getItem("doctor_uid"))
                const jsonRes = await res.json()
                if (jsonRes.error !== undefined){
                    alert(jsonRes.error)
                } else {
                    setSpecialization(jsonRes.specialization)
                }
            } catch {
                alert("Error fetching doctor specialization")
            }
        }
        onInit()
        return () => {}
    }, [])

    const getAllData = async (databaseContract) => {
        let records = []
        const BASE = process.env.REACT_APP_BASE_URL;
        const HUGGING_TOKEN = process.env.REACT_APP_HUGGING_TOKEN;
        const HUGGING_URL = process.env.REACT_APP_HUGGING_URL;

        try {
            const res = await fetch(BASE + "/patient?patient_id=" + patientIdRef.current.value)
            const jsonRes = await res.json()
            if (jsonRes.error !== undefined){
                alert(jsonRes.error)
            } else {
                setPatientData(jsonRes)
                setPatientDataReady(true)
            }
        } catch {
            alert("Profile details could not be fetched")
        }

        const reports = await databaseContract.methods.reports().call()
        for(let i = 0; i < reports; ++i)
        {
            const {
                patientData,
                sender,
                medReportId
            } = await databaseContract.methods.data(i).call()
            const originalDataObject = JSON.parse(patientData)
            if (originalDataObject.patientData.patientId === patientIdRef.current.value){
                let rowData = {...originalDataObject.patientData, ...originalDataObject.recordData}
                records.push(rowData)
            }
        }
        const payload = {
            "inputs": {
                "source_sentence": specialization,
                "sentences": Array.from(records.map(i => i.diseaseDescription))
            }
        }
        const hugRes = await fetch(HUGGING_URL, {
            headers: {"Authorization": "Bearer " + HUGGING_TOKEN, "Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify(payload)
        })
        const hugJsonRes = await hugRes.json()
        var count = 0;
        records.forEach(record => {
            record.similarity = hugJsonRes[count]
            count++;
            if (count === records.length){
                records.sort((a, b) => b.similarity - a.similarity)
                setAllData(records)
                setDataReady(true)
            }
        })
    }

    const handleGetRecords = () => {
        getAllData(databaseContract)
    }

    return (
        <div className="show-records-wrapper">
            <h1>Medical Records</h1>
            <div className="patient-details-input">
                <input type="number" placeholder="Enter patient's id" ref={patientIdRef} />
                <button onClick={handleGetRecords}>Get Records</button>
            </div>
            {
                !dataReady ? <div>Data will appear here</div> :
                <>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Weight (kg)</th>
                            <th>Height (cm)</th>
                            <th>Blood Group</th>
                        </tr>
                        {
                            patientDataReady
                            ? <tr>
                                <td>{patientData["name"]}</td>
                                <td>{patientData["age"]}</td>
                                <td>{patientData["gender"]}</td>
                                <td>{patientData["weight"]}</td>
                                <td>{patientData["height"]}</td>
                                <td>{patientData["blood_group"]}</td>
                            </tr>
                            : ""
                        }
                    </table>
                    <table>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Disease</th>
                            <th>Description</th>
                            <th>Started From</th>
                        </tr>
                        {
                            [...Array.from(allData.map(record => {
                                return (
                                    <tr>
                                        <td>{allData.indexOf(record) + 1}</td>
                                        <td>{record["diseaseName"]}</td>
                                        <td>{record["diseaseDescription"]}</td>
                                        <td>{record["diseaseStartedOn"]}</td>
                                    </tr>
                                )
                            }))]
                        }
                    </table>
                </>
                }
        </div>
    )
}

export default ShowRecordsDoctor;