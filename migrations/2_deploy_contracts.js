const ATCToken = artifacts.require("ATCToken");

module.exports = async function (deployer, network, accounts) {
  // mint
  deployer.deploy(ATCToken, 3000000000);
};
