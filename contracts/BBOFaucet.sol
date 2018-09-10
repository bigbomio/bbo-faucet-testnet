pragma solidity ^0.4.24;

import './zeppelin/ownership/Ownable.sol';
import './zeppelin/token/ERC20/ERC20.sol';

contract BBOFaucet is Ownable{
    
      ERC20 public bbo = ERC20(0x0);

      uint public maxFaucetAmount =  50000 * 1e18; //500 token
      uint public faucetAmount  =  1000 * 1e18; //100 token


     function setMaxFaucet(uint value) onlyOwner public {
        require(value > 0);
        maxFaucetAmount = value;
        
     }

    function setFaucetAmount(uint value) onlyOwner public {
        require(value > 0);
        faucetAmount = value;
        
     }

    function setBBO(address BBOAddress) onlyOwner public {
        require(BBOAddress != address(0));
        bbo = ERC20(BBOAddress);
     }

    function faucet() public {
    	require(bbo.balanceOf(msg.sender) < maxFaucetAmount);
     	bbo.transfer(msg.sender, faucetAmount);
    }

    function () external payable {
        faucet();
    }

  
}