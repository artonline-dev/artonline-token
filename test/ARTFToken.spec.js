const ARTFToken = artifacts.require("ARTFToken");

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

contract('ARTFToken', (accounts) => {
  it('name, symbol, decimals, totalSupply', async () => {
    const tokenInstance = await ARTFToken.deployed();
    
    assert.equal(await tokenInstance.name(), 'ART ONLINE', "name is not ART ONLINE");
    assert.equal(await tokenInstance.symbol(), 'ARTF', "symbol is not ARTF");
    assert.equal(await tokenInstance.decimals(), 18, "decimals is not 18");
    assert.equal(await tokenInstance.totalSupply(), '150000000000000000000000000', "totalSupply is not 150000000");
  });
  it('should put 150000000 ARFToken in the first account', async () => {
    const tokenInstance = await ARTFToken.deployed();
    const balance = await tokenInstance.balanceOf(accounts[0]);

    assert.equal(balance, '150000000000000000000000000', "150000000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const tokenInstance = await ARTFToken.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await tokenInstance.balanceOf(accountOne));
    const accountTwoStartingBalance = (await tokenInstance.balanceOf(accountTwo));

    // Make transaction from first account to second.
    const amount = web3.utils.toBN('10000000000000000000');
    await tokenInstance.transfer(accountTwo, amount);

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await tokenInstance.balanceOf(accountOne));
    const accountTwoEndingBalance = (await tokenInstance.balanceOf(accountTwo));

    assert.equal(accountOneEndingBalance, accountOneStartingBalance.sub(amount).toString(), "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance.add(amount).toString(), "Amount wasn't correctly sent to the receiver");
  });
});