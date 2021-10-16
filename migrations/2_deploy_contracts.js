var SendHash = artifacts.require("./SendHash.sol");

module.exports = function(deployer) {
  deployer.deploy(SendHash);
};
