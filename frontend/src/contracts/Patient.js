export const PATIENT_ABI = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "count",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "reports",
      "outputs": [
        {
          "internalType": "address",
          "name": "senderId",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "medReportId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "patientId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "weight",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "height",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "bloodGroup",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "diseaseName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "diseaseDescription",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "diseaseStartedOn",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "senders",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "institutionName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "institutionCode",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "patientCount",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "patientId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "reportId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "weight",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "height",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "bloodGroup",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "diseaseName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "diseaseDescription",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "diseaseStartedOn",
          "type": "string"
        }
      ],
      "name": "addMedicalReport",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export const PATIENT_ADDRESS = "0xD622d53DfEF08D36082A436D184954f831dBb414";