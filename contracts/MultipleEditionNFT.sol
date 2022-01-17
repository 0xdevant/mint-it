// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract MultipleEditionNFT is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    address contractAddress;

    constructor(address _marketplaceAddress)
        ERC1155("https://ipfs.infura.io:5001/{id}.json")
    {
        contractAddress = _marketplaceAddress;
    }

    function createToken(uint256 _numberOfEditions) public returns (uint256) {
        tokenIds.increment();
        uint256 newTokenTypeId = tokenIds.current();

        _mint(msg.sender, newTokenTypeId, _numberOfEditions, "");
        setApprovalForAll(contractAddress, true);
        return newTokenTypeId;
    }

    function uri(uint256 _tokenId)
        public
        pure
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "https://ipfs.infura.io:5001/",
                    Strings.toString(_tokenId),
                    ".json"
                )
            );
    }
}
