const ARTFToken = artifacts.require("ARTFToken");
const TokenLocker = artifacts.require("TokenLocker");

const expectThrow = require('../helpers/expectThrow');

const { fromWei } = web3.utils;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

contract('TokenLocker', (accounts) => {
  let lockId;
  const lockAmount = web3.utils.toBN(web3.utils.toWei('100'));

  it('can lock token', async () => {
    const artf = await ARTFToken.deployed();
    const locker = await TokenLocker.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = await artf.balanceOf(accountOne);
    const accountTwoStartingBalance = await artf.balanceOf(accountTwo);

     // Make transaction from first account to second.
    const releaseTime = Math.floor(new Date().getTime() / 1000) + 10;  // After 10 seconds
    await artf.approve(locker.address, lockAmount);
    const lockReceipt = await locker.lock(accountTwo, lockAmount, releaseTime);
    const LockedEvent = lockReceipt.logs[0];
    lockId = LockedEvent.args.id;
    assert.equal(lockId.toNumber(), 1, "Lock ID increment is not working");

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = await artf.balanceOf(accountOne);
    const accountTwoEndingBalance = await artf.balanceOf(accountTwo);

    assert.equal(fromWei(accountOneEndingBalance), fromWei(accountOneStartingBalance.sub(lockAmount)), "Amount wasn't correctly taken from the sender");
    assert.equal(fromWei(accountTwoEndingBalance), fromWei(accountTwoStartingBalance), "Amount wasn't correctly locked");

    // 잠긴 금액 확인
    const lockInfo = await locker.getLockedInfo(lockId);
    assert.equal(fromWei(lockAmount), fromWei(lockInfo.amount), "Locked amount is not correct");

    const lockedAmount = await locker.getLockedAmount(accountTwo);
    assert.equal(fromWei(lockAmount), fromWei(lockedAmount), "Locked total amount is not correct");
  });
  it('cannot unlock before release time', async () => {
    const artf = await ARTFToken.deployed();
    const locker = await TokenLocker.deployed();

    const accountTwo = accounts[1];

    // unlock 시도
    await expectThrow(locker.unlock(lockId, {from: accountTwo}), "Release Time has not been reached");
  });
  it('can unlock after release time', async () => {
    const artf = await ARTFToken.deployed();
    const locker = await TokenLocker.deployed();

    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountTwoStartingBalance = await artf.balanceOf(accountTwo);

    // unlock
    await sleep(1000 * 10);
    await locker.unlock(lockId, {from: accountTwo});

    const accountTwoEndingBalance = await artf.balanceOf(accountTwo);

    assert.equal(fromWei(accountTwoEndingBalance), fromWei(accountTwoStartingBalance.add(lockAmount)), "Amount wasn't correctly locked");
  });
  it('can cancel before release time', async () => {
    const artf = await ARTFToken.deployed();
    const locker = await TokenLocker.deployed();

    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // lock
    const releaseTime = Math.floor(new Date().getTime() / 1000) + 30;  // After 30 seconds
    await artf.approve(locker.address, lockAmount);
    const lockReceipt = await locker.lock(accountTwo, lockAmount, releaseTime);
    const LockedEvent = lockReceipt.logs[0];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = await artf.balanceOf(accountOne);
    const accountTwoStartingBalance = await artf.balanceOf(accountTwo);

    // cancel
    await locker.cancel(LockedEvent.args.id, {from: accountTwo});

    const accountOneEndingBalance = await artf.balanceOf(accountOne);
    const accountTwoEndingBalance = await artf.balanceOf(accountTwo);

    assert.equal(fromWei(accountOneEndingBalance), fromWei(accountOneStartingBalance.add(lockAmount)), "Amount wasn't correctly refunded");
    assert.equal(fromWei(accountTwoEndingBalance), fromWei(accountTwoStartingBalance), "Amount wasn't correctly cancelled");
  });

});