// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@klaytn/contracts/token/KIP7/IKIP7.sol";

contract TokenLocker {

  IKIP7 private _token;

  uint256 private _lastId;

  struct LockInfo {
    address sender;
    address receiver;
    uint256 amount;
    uint256 releaseTime;
  }

  event Locked(uint256 id, address receiver, uint256 amount);
  event UnLocked(uint256 id, address receiver, uint256 amount);
  event Cancelled(uint256 id, address sender, uint256 amount);

  mapping(uint256 => LockInfo) private _locks;
  mapping(address => uint256) private _lockAmounts;

  constructor(IKIP7 token) public {
      _token = token;
  }

  function _nextId() private returns(uint256) {
    _lastId = _lastId + 1;
    return _lastId;
  }

  function getLockedInfo(uint256 id) public view returns(LockInfo memory) {
    return _locks[id];
  }

  function getLockedAmount(address receiver) public view returns(uint256) {
    return _lockAmounts[receiver];
  }

  function lock(address receiver, uint256 amount, uint256 releaseTime) public returns(uint256) {
    require(receiver != msg.sender, "Cannot transfer to self");
    require(block.timestamp < releaseTime, "Release Time must be future");
    require(amount > 0, "Amount must be larger than zero");

    _token.transferFrom(msg.sender, address(this), amount);

    uint256 newId = _nextId();
    _locks[newId] = LockInfo({
      sender: msg.sender,
      receiver: receiver,
      amount: amount,
      releaseTime: releaseTime
    });

    _lockAmounts[receiver] += amount;

    emit Locked(newId, receiver, amount);
  }

  function unlock(uint256 id) public {
    LockInfo memory lockInfo = _locks[id];

    require(lockInfo.receiver != address(0), "LockInfo is empty");
    require(block.timestamp >= lockInfo.releaseTime, "Release Time has not been reached");

    _token.safeTransfer(lockInfo.receiver, lockInfo.amount);

    removeLock(id, lockInfo.receiver, lockInfo.amount);

    emit UnLocked(id, lockInfo.receiver, lockInfo.amount);
  }

  function cancel(uint256 id) public {
    LockInfo memory lockInfo = _locks[id];

    require(lockInfo.receiver != address(0), "LockInfo is empty");
    require(lockInfo.receiver == msg.sender, "Only receiver can cancel lock");

    _token.safeTransfer(lockInfo.sender, lockInfo.amount);

    removeLock(id, lockInfo.receiver, lockInfo.amount);

    emit Cancelled(id, lockInfo.sender, lockInfo.amount);
  }

  function removeLock(uint256 id, address receiver, uint256 amount) private {
    _lockAmounts[receiver] -= amount;

    delete _locks[id];
  }

}