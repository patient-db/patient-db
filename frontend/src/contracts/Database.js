export const DATABASE_ABI = [
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "data",
      "outputs": [
        {
          "internalType": "string",
          "name": "patientData",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "reportId",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "reports",
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
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "senders",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "reports",
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
          "name": "patientData",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "reportId",
          "type": "string"
        }
      ],
      "name": "saveData",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export const DATABASE_ADDRESS = "0x7f84D752F91fB955F03F1057816846c58A62CDf0";
