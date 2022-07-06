const ARTFToken = artifacts.require("ARTFToken");
const TokenLocker = artifacts.require("TokenLocker");

module.exports = async function (deployer, network, accounts) {
  if(network === 'development') {
    await deployer.deploy(TokenLocker, ARTFToken.address);
  }
  if(network === 'testnet') {
    await deployer.deploy(TokenLocker, '0x3a463d97f5afe3032016fc1b1946eb56855651c5');
  }
  if(network === 'mainnet') {
    await deployer.deploy(TokenLocker, '0xdd0b971bc6f5964af9493d4137f47cc5ee39ed3d');
  }
};
