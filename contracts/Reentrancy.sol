
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//!
// 1 - Модификатор
// 2 - Отнимать выше чем транза
// 3 - трансфер вместо колл
// 4 - отнимать а не присваивать 0
// 5 - использовать сейфмес
// мое - отнять от макс юинт 100
// 6 - использовать solidity > 0.8
// 7 - ревью код
// 8 - я вроде нормальный(но не точно) (собеседование)
// 9 - кто-то еще думает что я нормальный(мама) (внешний аудит)
// 10 - тестнет и тесты



contract Voting{
    mapping(address => uint) public balances;
    mapping(uint => uint) public votesForPrice;
    bool locked = false;


    function vote(uint price) external payable{
      balances[msg.sender] += msg.value;
      votesForPrice[price] += msg.value;
    }

    function refund() external nonReentrant {
      require(balances[msg.sender] > 100, "Not enough funds to refund");
      balances[msg.sender] -= 100;
      (payable(msg.sender)).transfer(100);
    }

    modifier nonReentrant(){
      require(!locked, 'locked!');
      locked = true;
      _;
      locked = false;
    }
}


contract Attack{
  Voting voting;

  constructor(address _voting){
    voting = Voting(_voting);
  }

  function vote(uint price) public payable {
    voting.vote{value: msg.value}(price);
  }

  function getRefund() public {
    voting.refund();
  }

  receive() external payable{
    if(address(this).balance < 300){
      voting.refund();
    }
  }
}

