// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import {NFT} from "./NFT.sol";
import "./Constants.sol";
import "./Errors.sol";

    struct NFTListing {
        uint256 price;
        address seller;
    }

contract MarketNFT is Ownable {

    mapping(uint256 => NFTListing) private _listings;
    mapping(uint256 => NFT) private _AllNFT;
    uint8 private _feePercentage = 5;

    constructor() Ownable(msg.sender){}

    function mintAndList(address to, string memory tokenURI, uint256 price) public {
        uint256 tokenId = mint(to, tokenURI);
        listNFT(tokenId, price);
    }

    function mint(address to, string memory tokenURI) public returns (uint256){
        NFT nft = new NFT(address(this));
        uint256 tokenId = nft.mint(to, tokenURI);
        _AllNFT[tokenId] = nft;
        return tokenId;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(price > 0, Errors.ERROR_PRICE_ZERO);
        NFT nft = _AllNFT[tokenId];
        require(address(nft) != address(0), Errors.ERROR_TOKEN_NOT_PRESENT);
        require(nft.ownerOf(tokenId) == msg.sender, Errors.ERROR_NOT_OWNER);

        nft.getApproval(tokenId);
        nft.transferFrom(msg.sender, address(this), tokenId);
        _listings[tokenId] = NFTListing(price, msg.sender);
    }

    function buyNFT(uint256 tokenId) public payable {
        NFTListing memory listing = _listings[tokenId];
        require(listing.price > 0, Errors.ERROR_NFT_NOT_FOR_SALE);
        require(msg.value == listing.price, Errors.ERROR_PRICE_PAID);

        (bool success, uint256 ethToSeller) = Math.tryMul(listing.price, Constants.PERCENTAGE_BASE - _feePercentage);
        assert(success);
        (success, ethToSeller) = Math.tryDiv(ethToSeller, Constants.PERCENTAGE_BASE);
        assert(success);
        uint256 ethToOwner;
        (success, ethToOwner) = Math.trySub(listing.price, ethToSeller);
        assert(success);

        (bool successOwner,) = payable(address(this)).call{value: ethToOwner}("");
        if (!successOwner) {
            revert(Errors.ERROR_TRANSFER_FAILED);
        }

        (bool successSeller,) = payable(listing.seller).call{value: ethToSeller}("");

        if (!successSeller) {
            revert(Errors.ERROR_TRANSFER_FAILED);
        }

        NFT nft = _AllNFT[tokenId];
        nft.transferFrom(address(this), msg.sender, tokenId);
        clearListing(tokenId);
    }

    function cancelListing(uint256 tokenId) public {
        NFTListing memory listing = _listings[tokenId];
        require(listing.price > 0, Errors.ERROR_NFT_NOT_FOR_SALE);
        require(listing.seller == msg.sender, Errors.ERROR_NOT_SELLER);
        NFT nft = _AllNFT[tokenId];

        nft.transferFrom(address(this), msg.sender, tokenId);
        clearListing(tokenId);
    }

    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;

        require(balance > 0, Errors.ERROR_BALANCE_ZERO);

        (bool success,) = payable(msg.sender).call{value: balance}("");
        if (!success) {
            revert(Errors.ERROR_TRANSFER_FAILED);
        }
    }

    function clearListing(uint256 tokenId) private {
        _listings[tokenId].price = 0;
        _listings[tokenId].seller = address(0);
    }

    function getListingByTokenID(uint256 tokenId) external view returns (uint256, address){
        return (_listings[tokenId].price, _listings[tokenId].seller);
    }

    function updateFeePercentage(uint8 feePercentage) public onlyOwner {
        _feePercentage = feePercentage;
    }
}