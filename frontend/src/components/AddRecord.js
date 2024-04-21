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
    const [memberNames, setMemberNames] = useState([])
    const [memberIds, setMemberIds] = useState([])
    const [currMember, setCurrMember] = useState("Yourself")
    useEffect(() => {
        async function onInit(){
            const BASE = process.env.REACT_APP_BASE_URL
            const patId = localStorage.getItem("patient_uid")
            if (patId === "" || !patId){
                navigate("/")
                return
            }
            setPatientId(patId);
            try {
                const res = await fetch(BASE + "/family?owner_id=" + patId)
                const jsonRes = await res.json()
                if (jsonRes.error){
                    alert(jsonRes.error)
                } else {
                    const _memberNames = []
                    const _memberIds = []
                    var count = 0
                    jsonRes.members.forEach(i => {
                        _memberNames.push(i[1])
                        _memberIds.push(i[7])
                        count++;
                        if (count === jsonRes.members.length){
                            setMemberNames(_memberNames)
                            setMemberIds(_memberIds)
                        }
                    })
                } 
            } catch {
                alert("Some error occured")
            }
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
        const _patientId = currMember === "Yourself" ? patientId : memberIds[memberNames.indexOf(currMember)]
        const patientData = {"patientId": _patientId}
        const diseaseName = e.target[1].value;
        const diseaseDescription = e.target[2].value;
        const diseaseStartedOn = e.target[3].value;
        const recordData = {"diseaseName": diseaseName, "diseaseDescription": diseaseDescription, "diseaseStartedOn": diseaseStartedOn, "patientId": _patientId}
        const jsonString = JSON.stringify({patientData, recordData})
        databaseContract.methods.saveData(jsonString, parseInt(Math.random() * 1000000).toString()).send({from: account})
        .once('receipt', receipt => {
            alert("Record stored successfully")
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

    return (
        <div className="add-record-wrapper">
            <form onSubmit={addRecord}>
                <h1>Add a record</h1>
                <select onChange={(e) => setCurrMember(e.target.value)}>
                    <option selected={true}>Yourself</option>
                    {
                        [...Array.from(memberNames.map(i => <option>{i}</option>))]
                    }
                </select>
                <input type="text" placeholder="Disease Name" />
                <textarea type="text" placeholder="Disease Description" />
                <input type="date" placeholder="Disease started from" />
                <button type="submit">Add Record</button>
            </form>
        </div>
    )
}

export default AddRecord;