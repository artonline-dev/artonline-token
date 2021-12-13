const ARFToken = artifacts.require("ARFToken");

module.exports = async function (deployer, network, accounts) {
  // mint
  deployer.deploy(ARFToken, 'ARTRAP FLOW', 'ARF', 0, 300000000);
};
