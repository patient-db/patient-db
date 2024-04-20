pragma solidity 0.5.16;

contract Patient {
  uint256 public count = 0;
 
  mapping(address => Sender) public senders;
  mapping(uint => PatientReport) public reports;

  mapping(uint => string) hashes;
  uint hashCount = 0;

  struct PatientData {
    string patientId;
    uint reportNum;
  }

  struct PatientReport {
    address senderId;
    string medReportId;
    string patientId;
    uint weight;
    uint height;
    string bloodGroup;
    string diseaseName;
    string diseaseDescription;
    string diseaseStartedOn;
  }

  struct Sender {
    string name;
    string institutionName;
    string institutionCode;
    uint patientCount;
    mapping(uint => string) patientsArray;
    mapping(string => PatientData) patients;
  }

  constructor() public {
  }

  function addMedicalReport(
    string memory patientId,
    string memory reportId,
    uint weight,
    uint height,
    string memory bloodGroup,
    string memory diseaseName,
    string memory diseaseDescription,
    string memory diseaseStartedOn
  ) public {
    bytes memory _patientId = bytes(senders[msg.sender].patients[patientId].patientId); 
    if(_patientId.length == 0){
      senders[msg.sender].patientsArray[senders[msg.sender].patientCount++] = patientId; 
      senders[msg.sender].patients[patientId] = PatientData(patientId, count);
      reports[count++] = PatientReport(msg.sender, reportId, patientId, weight, height, bloodGroup, diseaseName, diseaseDescription, diseaseStartedOn);
  
    } else {
      PatientData memory patientBio = senders[msg.sender].patients[patientId];
      senders[msg.sender].patients[patientId] = PatientData(patientId, patientBio.reportNum);
      reports[patientBio.reportNum] = PatientReport(msg.sender, reportId, patientId, weight, height, bloodGroup, diseaseName, diseaseDescription, diseaseStartedOn);
  
    }
  }

//   function getPatientsList(uint index) public view returns (
//     string memory,
//     string memory, 
//     string memory, 
//     string memory, 
//     uint) {
//     PatientData memory patientBio = senders[msg.sender].patients[senders[msg.sender].patientsArray[index]];
//     return (
//       patientBio.name,
//       patientBio.birthDate,
//       patientBio.phoneNumber,
//       patientBio._address,
//       patientBio.reportNum
//     );
//   }
}
