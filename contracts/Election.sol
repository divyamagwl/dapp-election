// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Election {

    uint public candidatesCount;

    struct Candidate {
        uint id;
        string name;
        uint votecount;
    }

    event electionupdated (
        uint id
    );

    
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public votedornot;
    
    constructor(){
        addCandidate("Donald Trump");
        addCandidate("Barack Obama");
    }
    
    function addCandidate(string memory name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    }
    
    function Vote(uint _id) public {
        require(!votedornot[msg.sender], "You have already voted");
        require(_id > 0 && _id <= candidatesCount, "The candidate id does not exist");
         
        candidates[_id].votecount++;
        votedornot[msg.sender] = true;
        
        emit electionupdated(_id);
    }
    
} 