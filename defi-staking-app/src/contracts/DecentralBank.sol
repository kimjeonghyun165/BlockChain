pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public  name = 'DecentralBank';
    address public owner;
    RWD public rwd;
    Tether public tether;

    address[] public stakers;


    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;    //스테이킹 이력
    mapping(address => bool) public isStaking;   // 스테이킹 중인지


    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    function depositToken(uint _amount) public {
        require(_amount > 0, 'amount cannot be 0');
        //예금을 위한 테더 토큰을 여기 컨트렉으로 이동
        tether.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] += _amount;  // 얼마나 스테이킹 하고 있는지..

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueTokens() public {
        require(msg.sender == owner, 'caller must be the owner');
        for(uint i =0; i<stakers.length; i++) {
        address recipient = stakers[i];
        uint balance = stakingBalance[recipient] / 9;  // 인센티브 비율에 따라 9로 나눔.
        if(balance > 0) {
        rwd.transfer(recipient, balance);
        }
        }
    }

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];   //msg.sender의 스테이킹 잔액...
        require(balance >0);
        
        //지정된 컨트렉으로 은행이 토큰을 다시 전송시켜줘야함. 스테이킹이 얼마 되었든간에 ㅇㅇ 출금해줘야지
        // 이자금과 원금을 돌려줘야함. 테더를 다시 돌려줘야지
        tether.transfer(msg.sender, balance);  // 은행이 -> 예금주소한테 -> amount만큼      
        stakingBalance[msg.sender] = 0; // 스테이킹 금액 리셋
        isStaking[msg.sender] = false;
    }

}