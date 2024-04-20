import React, {useState, useEffect} from "react";
import Web3 from 'web3';
import { PATIENT_ABI, PATIENT_ADDRESS } from "../contracts/Patient";
import { DATABASE_ABI, DATABASE_ADDRESS } from "../contracts/Database";
import { useNavigate } from "react-router-dom";
import '../styles/showrecords.css';

function ShowRecords(){
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [databaseContract, setDatabaseContract] = useState(null);
    const [allData, setAllData] = useState([])
    const [patientId, setPatientId] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        async function onInit(){
            const patId = localStorage.getItem("patient_uid")
            if (patId === "" || !patId){
                navigate("/")
                return;
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
            const databaseContractCopy = new web3.eth.Contract(
                DATABASE_ABI,
                DATABASE_ADDRESS,
            )
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
        const weight = e.target[0].value;
        const height = e.target[1].value;
        const bloodGroup = e.target[2].value;
        const diseaseName = e.target[3].value;
        const diseaseDescription = e.target[4].value;
        const diseaseStartedOn = e.target[5].value;
        const recordData = {"weight": weight, "height": height, "bloodGroup": bloodGroup, "diseaseName": diseaseName, "diseaseDescription": diseaseDescription, "diseaseStartedOn": diseaseStartedOn, "patientId": patientId}
        const jsonString = JSON.stringify({patientData, recordData})
        databaseContract.methods.saveData(jsonString, "111").send({from: account})
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
            if (originalDataObject.patientData.patientId === patientId){
                let rowData = {...originalDataObject.patientData, ...originalDataObject.recordData}
                records.push(rowData)
            }
        }
        setAllData(records)
    }

    return (
        <div className="show-records-wrapper">
            <h1>Medical Records</h1>
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
        </div>
    )
}

export default ShowRecords;