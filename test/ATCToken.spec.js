const ATCToken = artifacts.require("ATCToken");

contract('ATCToken', (accounts) => {
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
});