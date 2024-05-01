import {expect} from "chai";
import hre from "hardhat";
import {MarketNFT} from "../typechain-types";
import {BigNumberish} from "ethers";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";

const itParam = require('mocha-param').itParam;

let market: MarketNFT
const TOKEN_ID = 0;
const PRICE = 10;
const URL = "https://example.org";
let owner: HardhatEthersSigner, other: HardhatEthersSigner;

beforeEach(async function () {
    market = await hre.ethers.deployContract("MarketNFT");
    [owner, other] = await hre.ethers.getSigners();
})

describe("Validation mint and list", () => {
    it("Should revert when price equal to 0", async () => {
        const price = 0;

        await expect(market.mintAndList(URL, price)).to.be.revertedWith("Price must be greater than 0");
    })

    it("Should list nft when everything is ok", async () => {
        await expect(market.mintAndList(URL, PRICE)).to.not.be.reverted;
    })
})

describe("Validation list NFT", () => {
    it("Should revert when token id doesn't exist", async () => {
        await expect(market.listNFT(TOKEN_ID, PRICE)).to.be.revertedWith("NFT is not present in the contract");
    })

    it("Should revert when address isn't the same of NFT's owner", async () => {
        await market.mint(other.address, "https://example.org");

        await expect(market.listNFT(TOKEN_ID, PRICE)).to.be.revertedWith("You're not the owner of the NFT");
    })
})

describe("Validation buy NFT", () => {
    it("Should revert when nft is not for sale", async () => {
        await expect(market.buyNFT(TOKEN_ID)).to.be.revertedWith("NFT is not for sale");
    })


    itParam("Should revert when price is not same than the NFT's price", [9, 11], async (offeredPrice: BigNumberish) => {
        await market.mintAndList(URL, PRICE);

        await expect(market.buyNFT(0, {value: offeredPrice})).to.be.revertedWith("The price paid is not the value of the NFT");
    })

    it("Should revert when the sender is who listed nft", async () => {
        await market.mintAndList(URL, PRICE);

        await expect(market.buyNFT(0, {value: PRICE})).to.be.revertedWith("The owner can't buy his own NFT");
    })

    it("Should update balance when the nft is sold", async () => {
        await market.mintAndList(URL, PRICE);

        await expect(market.connect(other).buyNFT(TOKEN_ID, {value: PRICE})).to.changeEtherBalances([owner, other, market], [PRICE - 1, -PRICE, 1])
    })

    it("Should revert when another request is sent after buying ", async () => {
        await market.mintAndList(URL, PRICE);

        await expect(market.connect(other).buyNFT(TOKEN_ID, {value: PRICE})).to.not.reverted;
        await expect(market.buyNFT(TOKEN_ID)).to.be.revertedWith("NFT is not for sale");
    })
})

describe("Validation cancel listing", async () => {
    it("Should revert when nft doesn't exist", async () => {
        await expect(market.cancelListing(TOKEN_ID)).to.be.revertedWith("NFT is not for sale");
    })

    it("Should revert when the nft exists but it's not for sale", async () => {
        await market.mint(owner.address, URL);

        await expect(market.cancelListing(TOKEN_ID)).to.be.revertedWith("NFT is not for sale");
    })

    it("Should revert when the sender is not the owner of the NFT", async () => {
        await market.mintAndList(URL, PRICE);

        await expect(market.connect(other).cancelListing(TOKEN_ID)).to.be.revertedWith("You're not the seller of the NFT");
    })

    it("Should cancel listing when everything is ok", async () => {
        await market.mintAndList(URL, PRICE);

        await expect(market.cancelListing(TOKEN_ID)).to.not.be.reverted;
        await expect(market.listNFT(TOKEN_ID, PRICE)).to.not.be.reverted;
    })
})

describe("Validation withdraw funds", async () => {
    it("Should revert when the sender is not the owner of the contract", async () => {
        await expect(market.connect(other).withdrawFunds()).to.be.revertedWithCustomError(market, "OwnableUnauthorizedAccount");
    })

    it("Should revert when there are no funds to withdraw", async () => {
        await expect(market.withdrawFunds()).to.be.revertedWith("Balance must be greater than 0");
    })

    it("Should withdraw funds when funds are present", async () => {
        await market.mintAndList(URL, PRICE);
        await market.connect(other).buyNFT(TOKEN_ID, {value: PRICE});

        await expect(market.withdrawFunds()).to.changeEtherBalances([owner, market], [1, -1]);
    })
})

describe("Validation update fee percentage", async () => {
    it("Should revert when the sender is not the owner of the contract", async () => {
        await expect(market.connect(other).updateFeePercentage(1)).to.be.revertedWithCustomError(market, "OwnableUnauthorizedAccount");
    })

    it("Should revert when the fee percentage is greater than 100", async () => {
        await expect(market.updateFeePercentage(101)).to.be.revertedWith("Fee percentage must be less than or equal to 100");
    })

    it("Should update fee percentage when everything is ok", async () => {
        await expect(market.updateFeePercentage(20)).to.not.be.reverted;

        await market.mintAndList(URL, PRICE);
        await expect(market.connect(other).buyNFT(TOKEN_ID, {value: PRICE})).to.changeEtherBalance(market, 2);
    })
})