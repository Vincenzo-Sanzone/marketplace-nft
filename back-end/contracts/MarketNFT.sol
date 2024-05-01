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
    uint8 private _feePercentage = 5;
    NFT private immutable _nft;

    constructor() Ownable(msg.sender){
        _nft = new NFT(address(this));
    }

    function mintAndList(string memory tokenURI, uint256 price) public {
        uint256 tokenId = mint(msg.sender, tokenURI);
        listNFT(tokenId, price);
    }

    function mint(address to, string memory tokenURI) public returns (uint256){
        uint256 tokenId = _nft.mint(to, tokenURI);
        return tokenId;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(price > 0, Errors.ERROR_PRICE_ZERO);

        address nftOwner;
        try _nft.ownerOf(tokenId) returns (address _nftOwner) {
            nftOwner = _nftOwner;
        } catch {
            revert(Errors.ERROR_TOKEN_NOT_PRESENT);
        }

        require(nftOwner == msg.sender, Errors.ERROR_NOT_OWNER);

        _nft.getApproval(tokenId);
        _nft.transferFrom(msg.sender, address(this), tokenId);
        _listings[tokenId] = NFTListing(price, msg.sender);
    }

    function buyNFT(uint256 tokenId) public payable {
        NFTListing memory listing = _listings[tokenId];
        require(listing.price > 0, Errors.ERROR_NFT_NOT_FOR_SALE);
        require(msg.value == listing.price, Errors.ERROR_PRICE_PAID);
        require(msg.sender != listing.seller, Errors.ERROR_YOU_ARE_OWNER);

        (bool success, uint256 ethToSeller) = Math.tryMul(listing.price, Constants.PERCENTAGE_BASE - _feePercentage);
        assert(success);
        (success, ethToSeller) = Math.tryDiv(ethToSeller, Constants.PERCENTAGE_BASE);
        assert(success);

        (bool successSeller,) = payable(listing.seller).call{value: ethToSeller}("");

        if (!successSeller) {
            revert(Errors.ERROR_TRANSFER_FAILED);
        }

        _nft.transferFrom(address(this), msg.sender, tokenId);
        clearListing(tokenId);
    }

    function cancelListing(uint256 tokenId) public {
        NFTListing memory listing = _listings[tokenId];
        require(listing.price > 0, Errors.ERROR_NFT_NOT_FOR_SALE);
        require(listing.seller == msg.sender, Errors.ERROR_NOT_SELLER);

        _nft.transferFrom(address(this), msg.sender, tokenId);
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

    function updateFeePercentage(uint8 feePercentage) public onlyOwner {
        require(feePercentage <= 100, Errors.ERROR_FEE_PERCENTAGE);
        _feePercentage = feePercentage;
    }
}