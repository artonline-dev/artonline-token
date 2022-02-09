const ARTFToken = artifacts.require("ARTFToken");

module.exports = async function (deployer, network, accounts) {
  deployer.deploy(ARTFToken, 'ART ONLINE', 'ARTF', 18, '150000000000000000000000000');
};
