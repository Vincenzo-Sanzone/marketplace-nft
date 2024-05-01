import {expect} from "chai";
import hre from "hardhat";
import {MarketNFT} from "../typechain-types";
import {BigNumberish} from "ethers";

const itParam = require('mocha-param').itParam;

let market: MarketNFT
beforeEach(async function () {
    market = await hre.ethers.deployContract("MarketNFT")
})

describe("Validation mint and list", () => {
    it("Should revert when price equal to 0", async () => {
        const url = "https://example.org";
        const price = 0;
        const [owner] = await hre.ethers.getSigners();

        await expect(market.mintAndList(owner.address, url, price)).to.be.revertedWith("Price must be greater than 0");
    })

    it("Should list nft when everything is ok", async () => {
        const url = "https://example.org";
        const price = 10;

        const [owner] = await hre.ethers.getSigners();

        await expect(market.mintAndList(owner.address, url, price)).to.not.be.reverted;
    })
})

describe("Validation list NFT", () => {

    it("Should revert when token id doesn't exist", async () => {
        const tokenId = 0;
        const price = 10;

        await expect(market.listNFT(tokenId, price)).to.be.revertedWith("NFT is not present in the contract");
    })

    it("Should revert when address isn't the same of NFT's owner", async () => {
        const tokenId = 0;
        const price = 10;

        const [owner, other] = await hre.ethers.getSigners();

        await market.mint(other.address, "https://example.org");

        await expect(market.listNFT(tokenId, price)).to.be.revertedWith("You're not the owner of the NFT");
    })
})

describe("Validation buy NFT", () => {
    it("Should revert when nft is not for sale", async () => {
        const tokenId = 0

        await expect(market.buyNFT(tokenId)).to.be.revertedWith("NFT is not for sale");
    })


    itParam("Should revert when price is not same than the NFT's price", [9, 11], async (offeredPrice: BigNumberish) => {
        const url = "https://example.org";
        const price = 10;

        const [owner] = await hre.ethers.getSigners();

        await market.mintAndList(owner.address, url, price);

        await expect(market.buyNFT(0, {value: offeredPrice})).to.be.revertedWith("The price paid is not the value of the NFT");
    })

    it("Should revert when the sender is who listed nft", async () => {
        const url = "https://example.org";
        const price = 10;

        const [owner] = await hre.ethers.getSigners();

        await market.mintAndList(owner.address, url, price);

        await expect(market.buyNFT(0, {value: 10})).to.be.revertedWith("The owner can't buy his own NFT");
    })

    it("Should update balance when the nft is sold", async () => {
        const url = "https://example.org";
        const price = 10;

        const [owner, other] = await hre.ethers.getSigners();

        await market.mintAndList(owner.address, url, price);

        await expect(market.connect(other).buyNFT(0, {value: 10})).to.changeEtherBalances([owner, other, market], [price - 1, -price, 1])
    })

    it("Should revert when another request is sent after buying ", async () => {
        const url = "https://example.org";
        const price = 10;

        const [owner, other] = await hre.ethers.getSigners();

        await market.mintAndList(owner.address, url, price);

        await expect(market.connect(other).buyNFT(0, {value: 10})).to.not.reverted;
        await expect(market.buyNFT(0)).to.be.revertedWith("NFT is not for sale");
    })
})