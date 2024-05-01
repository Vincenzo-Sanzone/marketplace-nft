// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library Errors {
    string internal constant ERROR_NOT_OWNER = "You're not the owner of the NFT";
    string internal constant ERROR_TOKEN_NOT_PRESENT = "NFT is not present in the contract";
    string internal constant ERROR_PRICE_PAID = "The price paid is not the value of the NFT";
    string internal constant ERROR_TRANSFER_FAILED = "Transfer failed";
    string internal constant ERROR_NOT_SELLER = "You're not the seller of the NFT";
    string internal constant ERROR_NFT_NOT_FOR_SALE = "NFT is not for sale";
    string internal constant ERROR_PRICE_ZERO = "Price must be greater than 0";
    string internal constant ERROR_BALANCE_ZERO = "Balance must be greater than 0";
    string internal constant ERROR_ONLY_MARKET = "Only the market can approve the transfer";
}
