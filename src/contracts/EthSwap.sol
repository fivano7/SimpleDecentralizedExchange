pragma solidity ^0.5.0;

import "./Token.sol"; //omogućuje da jedan contract priča s drugim

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100; //1 eth za 100 tokena

    event TokensPurchased(address account, address token, uint amount, uint rate);
    event TokensSold(address account, address token, uint amount, uint rate);

    constructor(Token _token) public {
        token = _token;
    }

    //Transfer tokens from EthSwap to person who is buying them
    function buyTokens() public payable {
        //amount of eth * redemption rate (number of tokens they receive for 1 ether)
        //calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;

        //sam contract mora imati više tokena od količine koju user želi swappati
        require(token.balanceOf(address(this)) >= tokenAmount);

        //na tokenu zovemo funkciju transfer
        token.transfer(msg.sender, tokenAmount);

        //Emit an event - sender, token address, amount, rate
        emit TokensPurchased(msg.sender,address(token),tokenAmount, rate);
    }

    //transfer tokens from investor to ethSwap for ETH
    function sellTokens(uint _amount) public {
        //User can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);

        //Calculate the amount of ether to redeem
        uint etherAmount = _amount / rate;

        //require EthSwap has enough ether
        require(address(this).balance >= etherAmount);

        //send ether to the person calling this function (količina)
        token.transferFrom(msg.sender, address(this), _amount); //from, to, amount
        msg.sender.transfer(etherAmount);

        //Emit an event - sender, token address, amount, rate
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }


}
