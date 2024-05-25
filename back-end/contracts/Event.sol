// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library Event {
    event Minted(uint256 tokenId, address owner);
    event Listed(uint256 tokenId, uint256 price, address seller);
    event Bought(uint256 tokenId, uint256 price, address buyer);
    event Cancelled(uint256 tokenId, address seller);
}
