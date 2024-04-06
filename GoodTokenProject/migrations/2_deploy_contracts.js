const SafeToken = artifacts.require("SafeToken.sol");

module.exports = function (deployer) {
  deployer.deploy(SafeToken, 1000000);
};
