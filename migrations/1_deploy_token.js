const ARTFToken = artifacts.require("ARTFToken");

module.exports = async function (deployer, network, accounts) {
  if(network === 'development') {
    await deployer.deploy(ARTFToken, 'ART ONLINE', 'ARTF', 18, '150000000000000000000000000');
  }
  // Already deployed
};
