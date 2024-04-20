pragma solidity 0.5.16;

contract Database {
  uint public reports = 0;
  mapping(uint => Data) public data;
  mapping(address => Sender) public senders;

  struct Sender {
    uint reports;
    mapping(uint => uint) data;
  }

  struct Data {
    string patientData;
    address sender;
    string reportId;
  }

  function saveData(
    string memory patientData,
    string memory reportId
  ) public {
    data[reports].patientData = patientData;
    data[reports].sender = msg.sender;
    data[reports].reportId = reportId;

    senders[msg.sender].data[senders[msg.sender].reports++] = reports++;
  }
}
