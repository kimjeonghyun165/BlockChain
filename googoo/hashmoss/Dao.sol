// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "./Ballot.sol";
import "./Vote.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface Votefunction {
    function withdrawResult() external;
}

contract MainDao is ReentrancyGuard {
    using Address for address;
    using Address for address payable;

    address payable public owner;

    uint8 public quorum;
    uint public ballotId = 0;
    uint public voteId = 0;
    mapping(uint => address) public Ballots;
    mapping(uint => address) public Votes;

    constructor(string memory _name, string memory _symbol, uint8 _quorum) {
        require(
            _quorum >= 1 && _quorum <= 100,
            "DAO: quorum should be 1 <= q <= 100"
        );

        quorum = _quorum;

        owner = payable(msg.sender);
    }

    //receive() external payable {}

    function contractBalance(
        address tokenContract
    ) public view returns (uint _amount) {
        _amount = IERC20(tokenContract).balanceOf(address(this));
    }

    function createElection(
        string[] memory _nda,
        bytes32[] memory _proposalName,
        address _tokenContract
    ) public {
        Ballot ballot = new Ballot(_nda, _proposalName, _tokenContract);
        Ballots[ballotId] = address(ballot);
        ballotId++;
    }

    function createVote(
        string[] memory _nda,
        address _tokenContract,
        uint256 _sendAmount
    ) public nonReentrant {
        require(msg.sender == owner);
        Vote vote = new Vote(_nda, _tokenContract, _sendAmount);
        Votes[voteId] = address(vote);
        voteId++;
        // payable(vote).sendValue(_sendAmount);
    }

    function withdrawToken(address _tokenContract, uint256 _amount) internal {
        require(msg.sender == owner);
        require(
            Votefunction.withdrawResult() = true,
            "Error: function 'withdrawResult' returned false"
        );
        IERC20 tokenContract = IERC20(_tokenContract);
        tokenContract.transfer(msg.sender, _amount);
    }
}

// function getUserBalance() public view returns(uint) {
//  return users[msg.sender];
// }}
