// SPDX-License-Identifier: MIT
pragma solidity >=0.4.20;
contract SendHash {
    string ipfsHash;
    
    function sendHash(string memory x) public {
        ipfsHash = x;
    }
    
    function getHash() public view returns (string memory) {
        return ipfsHash;
    }
}