const ARTFToken = artifacts.require("ARTFToken");
const TokenLocker = artifacts.require("TokenLocker");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(TokenLocker, ARTFToken.address);
};
