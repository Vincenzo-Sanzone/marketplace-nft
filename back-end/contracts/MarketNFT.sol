// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import {NFT} from "./NFT.sol";
import "./Constants.sol";
import "./Errors.sol";

    struct NFTListing {
        uint256 price;
        address seller;
    }

contract MarketNFT is ERC721URIStorage, Ownable {

    mapping(uint256 => NFTListing) private _listings;

    constructor() ERC721(Constants.MARKET_NFT_NAME, Constants.MARKET_NFT_SYMBOL) Ownable(msg.sender){}

    function mint(address to, string memory tokenURI) public {
        new NFT().mint(to, tokenURI);
    }

    function listNFT(uint256 tokenID, uint256 price) public {
        require(price > 0, Errors.ERROR_PRICE_ZERO);
        require(ownerOf(tokenID) == msg.sender, Errors.ERROR_NOT_OWNER);

        approve(address(this), tokenID);
        transferFrom(msg.sender, address(this), tokenID);
        _listings[tokenID] = NFTListing(price, msg.sender);
    }

    function buyNFT(uint256 tokenID) public payable {
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, Errors.ERROR_NFT_NOT_FOR_SALE);
        require(msg.value == listing.price, Errors.ERROR_PRICE_PAID);

        (bool success, uint256 ethToSeller) = listing.price.tryMul(95);
        assert(success);
        (success, ethToSeller) = ethToSeller.tryDiv(100);
        assert(success);
        (bool success, uint256 ethToOwner) = listing.price.trySub(ethToSeller);
        assert(success);

        (bool successOwner,) = payable(address(this)).call{value: ethToOwner}("");
        (bool successSeller,) = payable(listing.seller).call{value: ethToSeller}("");

        if (!successOwner || !successSeller) {
            revert(Errors.ERROR_TRANSFER_FAILED);
        }

        transferFrom(address(this), msg.sender, tokenID);
        clearListing(tokenID);
    }

    function cancelListing(uint256 tokenID) public {
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, Errors.ERROR_NFT_NOT_FOR_SALE);
        require(listing.seller == msg.sender, Errors.ERROR_NOT_SELLER);

        transferFrom(address(this), msg.sender, tokenID);
        clearListing(tokenID);
    }

    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;

        require(balance > 0, Errors.ERROR_BALANCE_ZERO);

        (bool success,) = payable(msg.sender).call{value: balance}("");
        if (!success) {
            revert(Errors.ERROR_TRANSFER_FAILED);
        }
    }

    function clearListing(uint256 tokenID) private {
        _listings[tokenID].price = 0;
        _listings[tokenID].seller = address(0);
    }

    function getListingByTokenID(uint256 tokenID) public returns (uint256, address){
        return (_listings[tokenID].price, _listings[tokenID].seller);
    }
}