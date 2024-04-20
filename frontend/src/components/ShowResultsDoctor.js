import React, {useState, useEffect, useRef} from "react";
import Web3 from 'web3';
import { PATIENT_ABI, PATIENT_ADDRESS } from "../contracts/Patient";
import { DATABASE_ABI, DATABASE_ADDRESS } from "../contracts/Database";
import Modal from 'react-modal';
import '../styles/showrecords.css';
import { Oval } from 'react-loader-spinner';
import { useReactToPrint } from "react-to-print";
import { FaFileDownload } from "react-icons/fa";

Modal.setAppElement("#root")
function ShowRecordsDoctor(){
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
    };
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [databaseContract, setDatabaseContract] = useState(null);
    const [allData, setAllData] = useState([])
    const patientIdRef = useRef(null)
    const [patientDataReady, setPatientDataReady] = useState(false)
    const [patientData, setPatientData] = useState({})
    const [dataReady, setDataReady] = useState(false)
    const [specialization, setSpecialization] = useState(null);
    const [modalOpen, setModalOpen] = useState(false)
    const [summaryLoading, setSummaryLoading] = useState(false)
    const [summaryText, setSummaryText] = useState("")
    const pdfRef = useRef(null)
    const openModal = () => {
        setModalOpen(true)
    }
    const closeModal = () => {
        setModalOpen(false)
    }
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
        try {
            const hugRes = await fetch(HUGGING_URL, {
                headers: {"Authorization": "Bearer " + HUGGING_TOKEN, "Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify(payload)
            })
            const hugJsonRes = await hugRes.json()
            if (hugJsonRes.error !== undefined){
                setAllData(records)
                setDataReady(true)
                return
            }
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
        } catch {
            setAllData(records)
            setDataReady(true)
        }
    }

    const handleGetRecords = () => {
        getAllData(databaseContract)
    }

    const handleSummarize = async (e) => {
        setSummaryLoading(true)
        openModal()
        const BASE = process.env.REACT_APP_BASE_URL;
        const payload = {
            "text": e.target.innerText
        }
        try {
            const res = await fetch(BASE + "/summary", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            })
            const jsonRes = await res.json()
            if (jsonRes.error !== undefined){
                alert(jsonRes.error)
            } else {
                setSummaryText(jsonRes.summary)
                setSummaryLoading(false)
            }
        } catch {
            alert("Summarization could not be done")
        }
    }

    const generatePDF = useReactToPrint({
        content: () => pdfRef.current,
        documentTitle: "Records_" + patientIdRef.current?.value.toString()
    })

    return (
        <div className="show-records-wrapper">
            <h1>Medical Records</h1>
            <div className="patient-details-input">
                <input type="number" placeholder="Enter patient's id" ref={patientIdRef} />
                <button onClick={handleGetRecords}>Get Records</button>
                { dataReady ? <FaFileDownload onClick={generatePDF} id="pdf-download-btn" title="Download Records PDF" /> : ""}
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
                    <div ref={pdfRef}>
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
                                            <td onClick={(e) => handleSummarize(e)} id="disease-desc" title="Generate Summary">{record["diseaseDescription"]}</td>
                                            <td>{record["diseaseStartedOn"]}</td>
                                        </tr>
                                    )
                                }))]
                            }
                        </table>
                    </div>
                </>
                }
            <Modal isOpen={modalOpen} onRequestClose={closeModal}>
                {
                    summaryLoading 
                    ? <div className="summary-loading">
                        <h1>Generating Summary</h1>
                        <Oval height="50"
                            width="50"
                            radius="5"
                            color="#57a2ff"
                            ariaLabel="oval-loading"
                        />
                    </div>
                    : <div className="summary-wrapper">
                        <h1>Summary</h1>
                        <p>{summaryText}</p>
                    </div>
                }
            </Modal>
        </div>
    )
}

export default ShowRecordsDoctor;