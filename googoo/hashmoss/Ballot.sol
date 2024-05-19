// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Ballot {
    string public name; // 의제 제목
    string public description; // 의제 내용
    address public tokenContract; // 토큰홀더
    uint256 public sentAmount;
    uint256 _timestamp;
    uint32 public constant VOTING_DURATION = 3 days;

    struct Voter {
        uint weight; // 투표지분
        bool voted; // 투표여부
        uint vote; // 투표된 제안의 인덱스 데이터 값
    }

    struct Proposal {
        bytes32 proposalName;
        uint voteCount;
    }

    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    constructor(
        string[] memory _nda,
        bytes32[] memory _proposalName,
        address _tokenContract
    ) public {
        require(
            _proposalName.length > 0,
            "There should be atleast 1 proposla."
        );
        name = _nda[0];
        description = _nda[1];
        tokenContract = _tokenContract;
        for (uint i = 0; i < _proposalName.length; i++) {
            proposals.push(
                Proposal({proposalName: _proposalName[i], voteCount: 0})
            );
        }
    }

    // function createBallot(bytes32[] memory _proposalName) public {
    //     for (uint i = 0; i < _proposalName.length; i++) {
    //         proposals.push(Proposal({
    //             name: _proposalName[i],
    //             voteCount: 0
    //         }));
    //     }
    // }

    function vote(uint proposal) public {
        require(
            _timestamp + VOTING_DURATION >= block.timestamp,
            "DAO: voting is over"
        );
        Voter storage sender = voters[msg.sender];
        sender.weight = IERC721(tokenContract).balanceOf(msg.sender);
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Voter has already Voted!");
        require(
            IERC721(tokenContract).balanceOf(msg.sender) > 0,
            "you dont have Governace token in your wallet"
        );
        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() public view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].proposalName;
    }

    // function sendValue(address payable _recipient, uint256 amount) {

    // }

    //event howMuch(uint256 _value);

    // function callNow(address payable _recipient) public payable {
    //     _recipient = recipient;
    //     (bool sent, ) = _recipient.call{value: msg.value , gas:1000}("");
    //     require(sent, "Failed to send Ether");
    //     //emit howMuch(_sendAmount);
    // }
}
