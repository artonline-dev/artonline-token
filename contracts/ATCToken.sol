// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "@klaytn/contracts/token/KIP7/KIP7.sol";

contract ATCToken is KIP7 {
    constructor(uint256 initialSupply) public {
        _mint(msg.sender, initialSupply);
    }
}