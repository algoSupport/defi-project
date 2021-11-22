// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;

contract Certification {
    
    struct Certificate {
        string id;
        string email;
        string candidateName;
        string orgName;
        string courseName;
        string ipfsHash;
    }
    
    mapping(string => Certificate) public certificates;
    mapping(string => bool) private ipfs_Hash;
    
    function generateId(string memory _email) public pure returns (string memory) {
        return uint2str(uint(keccak256(abi.encode(_email))));
    }
    
    function generateCertificate(
        string memory _email,
        string memory _candidate_name,
        string memory _org_name,
        string memory _course_name,
        string memory _ipfs_hash 
    ) public returns (string memory) {
        string memory _id = generateId(_email);
        certificates[_email] = Certificate(
            _id,
            _email,
            _candidate_name,
            _org_name,
            _course_name,
            _ipfs_hash
            );
        ipfs_Hash[_id] = true;
        //emit certificateGenerated(_id, _ipfs_hash);
        return _id;
    }
    
    function getId(string memory _email) public view returns (string memory) {
        return certificates[_email].id;
    }
    
    function isVerified(string memory _id) public view returns (bool) {
        if (ipfs_Hash[_id]) {
            return true;
        }
        return false;
    }
    
    
    function getHash(string memory _email) public view returns (string memory) {
        
        return certificates[_email].ipfsHash;
    }
    

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

}