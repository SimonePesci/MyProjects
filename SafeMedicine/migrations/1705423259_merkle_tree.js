const Migrations = artifacts.require("MerkleTree");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Migrations);
};