const ARFToken = artifacts.require("ARFToken");

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

contract('ARFToken', (accounts) => {
  it('name, symbol, decimals, totalSupply', async () => {
    const arfTokenInstance = await ARFToken.deployed();

    assert.equal(await arfTokenInstance.name(), 'ARTRAP FLOW', "name is not ARTRAP FLOW");
    assert.equal(await arfTokenInstance.symbol(), 'ARF', "symbol is not ARF");
    assert.equal(await arfTokenInstance.decimals(), 0, "decimals is not 0");
    assert.equal(await arfTokenInstance.totalSupply(), 300000000, "totalSupply is not 300000000");
  });
  it('should put 300000000 ARFToken in the first account', async () => {
    const arfTokenInstance = await ARFToken.deployed();
    const balance = await arfTokenInstance.balanceOf(accounts[0]);

    assert.equal(balance.toNumber(), 300000000, "300000000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const arfTokenInstance = await ARFToken.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await arfTokenInstance.balanceOf(accountOne)).toNumber();
    const accountTwoStartingBalance = (await arfTokenInstance.balanceOf(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await arfTokenInstance.transfer(accountTwo, amount);

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await arfTokenInstance.balanceOf(accountOne)).toNumber();
    const accountTwoEndingBalance = (await arfTokenInstance.balanceOf(accountTwo)).toNumber();

    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
  it('can transfer with lock', async () => {
    const arfTokenInstance = await ARFToken.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await arfTokenInstance.balanceOf(accountOne)).toNumber();
    const accountTwoStartingBalance = (await arfTokenInstance.balanceOf(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await arfTokenInstance.transferWithLock(accountTwo, web3.utils.utf8ToHex('Initial Offering'), amount, 1);

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await arfTokenInstance.balanceOf(accountOne)).toNumber();
    const accountTwoEndingBalance = (await arfTokenInstance.balanceOf(accountTwo)).toNumber();

    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance, "Amount wasn't correctly locked");

    await sleep(1000);

    // unlock
    await arfTokenInstance.unlock(accountTwo);

    const accountTwoFinalBalance = (await arfTokenInstance.balanceOf(accountTwo)).toNumber();

    assert.equal(accountTwoFinalBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly unlocked to the receiver");
  });
});