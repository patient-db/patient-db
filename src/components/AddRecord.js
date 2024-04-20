import React, {useState, useEffect} from "react";
import Web3 from 'web3';
import { PATIENT_ABI, PATIENT_ADDRESS } from "../contracts/Patient";
import { DATABASE_ABI, DATABASE_ADDRESS } from "../contracts/Database";
import { useNavigate } from "react-router-dom";
import '../styles/addrecord.css';

function AddRecord(){
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [patientContract, setPatientContract] = useState(null);
    const [databaseContract, setDatabaseContract] = useState(null);
    const [allData, setAllData] = useState([])
    const [patientId, setPatientId] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        async function onInit(){
            const BASE = process.env.REACT_APP_BASE_URL
            const patId = localStorage.getItem("patient_uid")
            if (patId === "" || !patId){
                navigate("/")
                return
            }
            setPatientId(patId);
            await window.ethereum.enable();
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            setAccount(account);
            window.ethereum.on('accountsChanged', function (accounts) {
            setAccount(accounts[0])
            });
            const web3 = new Web3(window.ethereum)
            const patientContractCopy = new web3.eth.Contract(
                PATIENT_ABI,
                PATIENT_ADDRESS,
            )
            const databaseContractCopy = new web3.eth.Contract(
                DATABASE_ABI,
                DATABASE_ADDRESS,
            )
            setPatientContract(patientContractCopy)
            setDatabaseContract(databaseContractCopy)
        }
        onInit()
        return () => {}
    }, [])

    useEffect(() => {
        if (databaseContract){
            getAllData(databaseContract)
        }
    }, [databaseContract])

    const addRecord = (e) => {
        e.preventDefault()
        console.log(e)
        console.log(patientId)
        const patientData = {"patientId": patientId}
        const diseaseName = e.target[0].value;
        const diseaseDescription = e.target[1].value;
        const diseaseStartedOn = e.target[2].value;
        const recordData = {"diseaseName": diseaseName, "diseaseDescription": diseaseDescription, "diseaseStartedOn": diseaseStartedOn, "patientId": patientId}
        const jsonString = JSON.stringify({patientData, recordData})
        databaseContract.methods.saveData(jsonString, parseInt(Math.random() * 1000000).toString()).send({from: account})
        .once('receipt', receipt => {
            console.log("saved", receipt)
        })
    }

    const getAllData = async (databaseContract) => {
        let records = []

        const reports = await databaseContract.methods.reports().call()
        for(let i = 0; i < reports; ++i)
        {
            const {
                patientData,
                sender,
                medReportId
            } = await databaseContract.methods.data(i).call()
            const originalDataObject = JSON.parse(patientData)
            let rowData = {...originalDataObject.patientData, ...originalDataObject.recordData}
            records.push(rowData)
        }
        setAllData(records)
    }

    useEffect(() => {
        console.log("All Data Changed: ", allData)
    }, [allData])

    return (
        <div className="add-record-wrapper">
            <form onSubmit={addRecord}>
                <h1>Add a record</h1>
                <input type="text" placeholder="Disease Name" />
                <input type="text" placeholder="Disease Description" />
                <input type="text" placeholder="Disease started from" />
                <button type="submit">Add Record</button>
            </form>
        </div>
    )
}

export default AddRecord;