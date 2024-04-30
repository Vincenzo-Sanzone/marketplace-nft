// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Constants.sol";

contract NFT is ERC721URIStorage{
    uint256 private _nextTokenId;

    constructor() ERC721(Constants.NFT_NAME, Constants.NFT_SYMBOL){}

    function mint(address to, string memory tokenURI) public returns (uint256){
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }
}
