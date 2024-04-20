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
    useEffect(() => {
        async function onInit(){
            const patId = localStorage.getItem("patientId")
            if (patId === "" || !patId){
                // navigate to login page
            }
            // setPatientId(patId);
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
            if (originalDataObject.patientData.patientId === parseInt(patientIdRef.current.value)){
                let rowData = {...originalDataObject.patientData, ...originalDataObject.recordData}
                records.push(rowData)
            }
        }
        setAllData(records)
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

export default ShowRecordsDoctor;