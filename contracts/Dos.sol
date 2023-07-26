
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DosUnexpectedRevert{
  mapping(address => uint) public balances;
  address[] public voters;


  function vote() public payable{
    balances[msg.sender] += msg.value;
    voters.push(msg.sender);
  }

  function endVote() public{
    for(uint i = 0; i < voters.length; i++){
      address currentVoter = voters[i];
      uint currentVoterBalance = balances[currentVoter];
      if(currentVoterBalance > 0){
          balances[currentVoter] -= 100;
          payable(currentVoter).transfer(100);
      }
    }
  }
}

contract DosUnexpectedRevertAttack{
  DosUnexpectedRevert unexpectedRevert;

  constructor(address _unexpectedRevert){
    unexpectedRevert = DosUnexpectedRevert( _unexpectedRevert);
  }

  function vote() public payable {
    unexpectedRevert.vote{value: msg.value}();
  }

  receive() external payable{

  }
}