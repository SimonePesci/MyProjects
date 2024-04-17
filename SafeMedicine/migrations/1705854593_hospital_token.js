const Migrations = artifacts.require("HospitalToken");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Migrations);
};