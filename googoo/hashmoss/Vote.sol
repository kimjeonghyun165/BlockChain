// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Vote {
    string public name; // 의제 제목
    string public description; // 의제 내용
    address public tokenContract; // 토큰홀더
    uint256 public sentAmount;
    // uint256 _timestamp;
    uint32 public constant VOTING_DURATION = 3 minutes;
    uint public agree = 0;
    uint public disagree = 0;

    struct Voter {
        uint weight; // 투표지분
        bool voted; // 투표여부
        //  uint vote;   // 투표된 제안의 인덱스 데이터 값
    }

    mapping(address => Voter) public voters;

    constructor(
        string[] memory _nda,
        address _tokenContract,
        uint256 _sentAmount
    ) public {
        name = _nda[0];
        description = _nda[1];
        sentAmount = _sentAmount;
        tokenContract = _tokenContract;
        voters[msg.sender].weight = IERC721(tokenContract).balanceOf(
            msg.sender
        );
    }

    // function createBallot(bytes32[] memory _proposalName) public {
    //     for (uint i = 0; i < _proposalName.length; i++) {
    //         proposals.push(Proposal({
    //             name: _proposalName[i],
    //             voteCount: 0
    //         }));
    //     }
    // }

    function Agreevote() private {
        // require(block.number + VOTING_DURATION >= block.timestamp, "DAO: voting is over");
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Voter has already Voted!");
        require(
            IERC721(tokenContract).balanceOf(msg.sender) > 0,
            "you dont have Governace token in your wallet"
        );
        sender.voted = true;
        agree += sender.weight;
    }

    function Disagreevote() private {
        //  require(block.number + VOTING_DURATION >= block.timestamp, "DAO: voting is over");
        Voter storage sender = voters[msg.sender];
        sender.weight = IERC721(tokenContract).balanceOf(msg.sender);
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Voter has already Voted!");
        require(
            IERC721(tokenContract).balanceOf(msg.sender) > 0,
            "you dont have Governace token in your wallet"
        );
        sender.voted = true;
        disagree += sender.weight;
    }

    // function winningProposal() public view returns (uint winningProposal_) {
    //     require(disagree != agree, "equal voting result");
    //     uint winningVoteCount = 0;
    //     // for (uint p = 0; p < proposals.length; p++) {
    //     //     if (proposals[p].voteCount > winningVoteCount) {
    //     //         winningVoteCount = proposals[p].voteCount;
    //     //         winningProposal_ = p;
    //     //     }
    //     // }
    //     if (disagree > agree) {
    //         winningVoteCount == disagree;
    //     }
    //     else if (disagree < agree) {
    //     winningVoteCount == agree;
    //     }
    // }

    function withdrawResult() external view returns (bool) {
        require(disagree != agree, "equal voting result");
        if (disagree > agree) {
            //winnerName_ = "Disagree";
            return false;
        } else if (disagree < agree) {
            //winnerName_ = "Agree";
            return true;
        }
    }

    //event howMuch(uint256 _value);

    // function callNow(address payable _recipient) public payable {
    //     _recipient = recipient;
    //     (bool sent, ) = _recipient.call{value: msg.value , gas:1000}("");
    //     require(sent, "Failed to send Ether");
    //     //emit howMuch(_sendAmount);
    // }

    // function withdrawToken(address _tokenContract, uint256 _amount) external {
    //     require(msg.sender == owner);
    //     IERC20 tokenContract = IERC20(_tokenContract);
    //     // transfer the token from address of this contract
    //     // to address of the user (executing the withdrawToken() function)
    //     //require()
    //     tokenContract.transfer(msg.sender, _amount);
    // }
}
