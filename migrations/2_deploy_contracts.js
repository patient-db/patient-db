const Patient = artifacts.require("Patient");
const Database = artifacts.require("Database");

module.exports = function(deployer) {
  deployer.deploy(Patient);
  deployer.deploy(Database);
  deployer.link(Patient, Database);
};
