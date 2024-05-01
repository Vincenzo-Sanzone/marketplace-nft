import {expect} from "chai";
import hre from "hardhat";
import {MarketNFT} from "../typechain-types";

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