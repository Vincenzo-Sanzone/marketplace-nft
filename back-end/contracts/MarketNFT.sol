// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import {NFT} from "./NFT.sol";
import "./Constants.sol";
import "./Errors.sol";
import "./Event.sol";
import "./Event.sol";

    struct NFTListing {
        uint256 price;
        address owner;
        string url;
    }

contract MarketNFT is Ownable {

    mapping(uint256 => NFTListing) private _NFTInMarket;
    uint256 private _tokenIdCounter;
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
        _NFTInMarket[tokenId] = NFTListing(0, to, tokenURI);
        _tokenIdCounter++;
        emit Event.Minted(tokenId, to, tokenURI);
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
        _NFTInMarket[tokenId].price = price;
        emit Event.Listed(tokenId, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        NFTListing memory listing = _NFTInMarket[tokenId];
        require(listing.price > 0, Errors.ERROR_NFT_NOT_FOR_SALE);
        require(msg.value == listing.price, Errors.ERROR_PRICE_PAID);
        require(msg.sender != listing.owner, Errors.ERROR_YOU_ARE_OWNER);

        (bool success, uint256 ethToSeller) = Math.tryMul(listing.price, Constants.PERCENTAGE_BASE - _feePercentage);
        assert(success);
        (success, ethToSeller) = Math.tryDiv(ethToSeller, Constants.PERCENTAGE_BASE);
        assert(success);

        (bool successSeller,) = payable(listing.owner).call{value: ethToSeller}("");

        if (!successSeller) {
            revert(Errors.ERROR_TRANSFER_FAILED);
        }

        _nft.transferFrom(address(this), msg.sender, tokenId);
        _NFTInMarket[tokenId].price = 0;
        _NFTInMarket[tokenId].owner = msg.sender;
        emit Event.Bought(tokenId, msg.sender);
    }

    function cancelListing(uint256 tokenId) public {
        NFTListing memory listing = _NFTInMarket[tokenId];
        require(listing.price > 0, Errors.ERROR_NFT_NOT_FOR_SALE);
        require(listing.owner == msg.sender, Errors.ERROR_NOT_SELLER);

        _nft.transferFrom(address(this), msg.sender, tokenId);
        _NFTInMarket[tokenId].price = 0;
        emit Event.Cancelled(tokenId);
    }

    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;

        require(balance > 0, Errors.ERROR_BALANCE_ZERO);

        (bool success,) = payable(msg.sender).call{value: balance}("");
        if (!success) {
            revert(Errors.ERROR_TRANSFER_FAILED);
        }
    }

    function updateFeePercentage(uint8 feePercentage) public onlyOwner {
        require(feePercentage <= 100, Errors.ERROR_FEE_PERCENTAGE);
        _feePercentage = feePercentage;
    }

    function getLastTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getNFT(uint256 tokenId) external view returns (uint256, address, string memory) {
        NFTListing memory nft = _NFTInMarket[tokenId];
        return (nft.price, nft.owner, nft.url);
    }
}