const ATCToken = artifacts.require("ATCToken");

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

contract('ATCToken', (accounts) => {
  it('name, symbol, decimals, totalSupply', async () => {
    const atcTokenInstance = await ATCToken.deployed();

    assert.equal(await atcTokenInstance.name(), 'Art Culture Token', "name is not Art Culture Token");
    assert.equal(await atcTokenInstance.symbol(), 'ATC', "symbol is not ATC");
    assert.equal(await atcTokenInstance.decimals(), 0, "decimals is not 0");
    assert.equal(await atcTokenInstance.totalSupply(), 300000000, "totalSupply is not 300000000");
  });
  it('should put 300000000 ATCToken in the first account', async () => {
    const atcTokenInstance = await ATCToken.deployed();
    const balance = await atcTokenInstance.balanceOf(accounts[0]);

    assert.equal(balance.toNumber(), 300000000, "300000000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const atcTokenInstance = await ATCToken.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await atcTokenInstance.balanceOf(accountOne)).toNumber();
    const accountTwoStartingBalance = (await atcTokenInstance.balanceOf(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await atcTokenInstance.transfer(accountTwo, amount);

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await atcTokenInstance.balanceOf(accountOne)).toNumber();
    const accountTwoEndingBalance = (await atcTokenInstance.balanceOf(accountTwo)).toNumber();

    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
  it('can transfer with lock', async () => {
    const atcTokenInstance = await ATCToken.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await atcTokenInstance.balanceOf(accountOne)).toNumber();
    const accountTwoStartingBalance = (await atcTokenInstance.balanceOf(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await atcTokenInstance.transferWithLock(accountTwo, web3.utils.utf8ToHex('Initial Offering'), amount, 1);

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await atcTokenInstance.balanceOf(accountOne)).toNumber();
    const accountTwoEndingBalance = (await atcTokenInstance.balanceOf(accountTwo)).toNumber();

    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance, "Amount wasn't correctly locked");

    sleep(1);

    // unlock
    await atcTokenInstance.unlock(accountTwo);

    const accountTwoFinalBalance = (await atcTokenInstance.balanceOf(accountTwo)).toNumber();

    assert.equal(accountTwoFinalBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly unlocked to the receiver");
  });
});