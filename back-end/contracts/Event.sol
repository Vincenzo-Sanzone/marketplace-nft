// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library Event {
    event Minted(uint256 tokenId, address owner, string url);
    event Listed(uint256 tokenId, uint256 price);
    event Bought(uint256 tokenId, address buyer);
    event Cancelled(uint256 tokenId);
}
