//// SPDX-License-Identifier: MIT
//pragma solidity ^0.8.0;
//
//import "../contracts/MarketNFT.sol";
//import "truffle/DeployedAddresses.sol";
//import "truffle/Assert.sol";
//
//contract TestMarketNFT{
//    MarketNFT private marketNFT;
//
//    function beforeEach() public{
//        marketNFT = new MarketNFT();
//    }
//
//    function testlistNFT() public{
////        bool r;
////        (r, ) =  marketNFT.listNFT(0, 0);
////        Assert.isFalse(r, "MarketNFT: price must be greater than 0");
//        marketNFT.listNFT(0, 10);
//        uint256 _price;
//        address _seller;
//        (_price, _seller) = marketNFT.getListingByTokenID(0);
//
//        Assert.equal(_price, 10, "the price is not equal to 10");
//
//
//
//    }
//
//
//}