// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../contracts/MarketNFT.sol";

contract TestMarketNFT {
    MarketNFT private marketNFT;

    function beforeEach() public{
        marketNFT = new MarketNFT();
    }

    function testMintAndList() public {
        marketNFT.mintAndList(msg.sender, "https://ipfs.io/ipfs/QmZ4tDuPZ9Z1", 100);
    }
}
