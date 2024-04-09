// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/NFT.sol";
import "truffle/DeployedAddresses.sol";
import "truffle/Assert.sol";

contract TestNFT {
    NFT private nft;

    function beforeEach() public{
        nft = new NFT();
    }


    function testMintNFT() public {
        address to = msg.sender;
        string memory tokenURI = "https://ipfs.io/ipfs/QmZ4tDuPZ9Z1";

        nft.mint(to, tokenURI);

        Assert.equal(nft.ownerOf(0), to, "Owner of token 0 should be the sender");
        Assert.equal(nft.tokenURI(0), tokenURI, "Token URI of token 0 should be the same as the one passed in");
    }
}
