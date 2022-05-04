// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.13.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HeroToken is ERC20 {

    address public owner;

    constructor() ERC20("HeroToken", "HT"){
        owner = msg.sender;
        _mint(msg.sender, 100000);
    }

    modifier onlyWinner(bool isWin){
        require(isWin == true);
        _;
    }

    function sendTokeToWinner(uint256 amount, address to, bool isWin) external onlyWinner(isWin) {
        _transfer(owner, to, amount);
    }
}