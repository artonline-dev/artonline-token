const ATCToken = artifacts.require("ATCToken");

module.exports = async function (deployer, network, accounts) {
  // mint
  deployer.deploy(ATCToken, 'Art Culture Token', 'ATC', 0, 300000000);
};
