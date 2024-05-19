pragma solidity ^0.5.0;

contract RWD {
    //정적타입 선언
    string public name = 'Reward Token';
    string public symbol = 'RWD';
    uint256 public totalSupply = 1000000000000000000000000 ;  //100만개 뒤에 0은 소수점 18개를 말함.
    uint8 public decimals = 18;


    //indexed를 선언함으로서 인덱싱할 수 있는 파라미터가 생김.
    event Transfer(
        address indexed _from,   
        address indexed _to,
        uint _value
    );

    event Approval(
        address indexed _owner,   
        address indexed _spender,
        uint _value

    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }


    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value; //발신자의 남은 토큰 수량
        balanceOf[_to] += _value;   //수신자의 토큰 수량
        emit Transfer(msg.sender, _to, _value); //이벤트를 실행
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[msg.sender][_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
        
    }
} 