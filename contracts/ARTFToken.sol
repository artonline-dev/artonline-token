// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "@klaytn/contracts/token/KIP7/KIP7Token.sol";

contract ARTFToken is KIP7Token {
    constructor(string memory name, string memory symbol, uint8 decimals, uint256 initialSupply) KIP7Token(name, symbol, decimals, initialSupply) public {}
}