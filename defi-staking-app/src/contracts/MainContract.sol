// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;

import './Election.sol';

contract MainContract {
  uint public electionId = 0;
  mapping (uint => address) public Elections;

  function createElection (string[] memory _nda, string[] memory _candidates) public {
    Election election = new Election(_nda, _candidates);
    Elections[electionId] = address(election);
    electionId++;
  }
}