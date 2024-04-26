// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {NFT} from "./NFT.sol";

//memorize the address of the people who list a NFT with price
    struct NFTListing {
        uint256 price;
        address seller;
    }

contract MarketNFT is ERC721URIStorage, Ownable {

    //create the variable _owner
    // address private _owner;

    //create a map with the token id mapped with NFTListing (aka memorize also the price and seller)
    mapping(uint256 => NFTListing) private _listings;

    constructor() ERC721("MarketNFT", "NFT") Ownable(msg.sender){
        //we can suppose the one who deployed the contract is the owner
        //_owner = msg.sender;
    }

    function mint(address to, string memory tokenURI) public {
        new NFT().mint(to, tokenURI);
    }

    //list NFT
    function listNFT(uint256 tokenID, uint256 price) public {
        //check that the price is greater than 0
        require(price > 0, "MarketNFT: price must be greater than 0");
        //only the owner of the NFT can transfer the ownership
        //Gives permission to 'to' to transfer tokenId token to another account.
        //address(this) ??? -> https://ethereum.stackexchange.com/questions/40018/what-is-addressthis-in-solidity
        approve(address(this), tokenID);
        //transfer th ownership of NFT to the contract(?)
        transferFrom(msg.sender, address(this), tokenID);
        // memorize the price and the address of who list the NFT
        _listings[tokenID] = NFTListing(price, msg.sender);
    }

    //buy NFT
    function buyNFT(uint256 tokenID) public payable {
        //check if the NFT with that tokenID is for sale
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, "MarketNFT: NFT not for sale");
        //control if the price paid is the price of the NFT
        require(msg.value == listing.price, "MarketNFT: the price paid is not the value of the NFT");
        //transfer the ownership from the contract to the msg.sender
        payable(listing.seller).transfer(listing.price * 95 / 100); // !! we should use save-math !!
        transferFrom(address(this), msg.sender, tokenID);
        //we take 5% of the price
        // eliminate the NFT from listing
        clearListing(tokenID);
    }

    //cancel listing
    function cancelListing(uint256 tokenID) public {
        //check if the NFT with that tokenID is for sale
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, "MarketNFT: NFT is not for sale");
        //check if who want to cancel the listing is the one who owen the NFT
        require(listing.seller == msg.sender, "MarketNFT: you're not the seller of the NFT");
        //re-transfer the ownership from the contract to the msg.sender
        transferFrom(address(this), msg.sender, tokenID);
        // eliminate the NFT from listing
        clearListing(tokenID);
    }

    function withdrawFunds() public onlyOwner {
        //if we implement manually the variable _owner
        //require(_owner == msg.sender, "MarketNFT: you are not the owenr!");
        //if we import Ownable.sol
        uint256 balance = address(this).balance;

        require(balance > 0, "NFTMarket: balance is zero");
        payable(msg.sender).transfer(balance);
    }

    // eliminate the NFT with that tokenID from listing
    function clearListing(uint256 tokenID) private {
        _listings[tokenID].price = 0;
        _listings[tokenID].seller = address(0);
    }

    function getListingByTokenID(uint256 tokenID) public returns (uint256, address){
        return (_listings[tokenID].price, _listings[tokenID].seller);
    }
}