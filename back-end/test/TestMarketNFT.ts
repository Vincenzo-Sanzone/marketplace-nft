import {expect} from "chai";
import hre from "hardhat";
import {address} from "hardhat/internal/core/config/config-validation";

describe("Validation list NFT", () => {
    it("Should revert when price equal to 0", async () => {
        const tokenId = 0;
        const price = 0;

        const contract = await hre.ethers.deployContract("MarketNFT");

        await expect(contract.listNFT(tokenId, price)).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should revert when token id doesn't exist", async () => {
        const tokenId = 0;
        const price = 10;

        const contract = await hre.ethers.deployContract("MarketNFT");

        await expect(contract.listNFT(tokenId, price)).to.be.revertedWith("You're not the owner of the NFT");
    });

    it("Should revert when address isn't the same of NFT's owner", async () => {
        const tokenId = 0;
        const price = 10;

        const [owner, other] = await hre.ethers.getSigners();

        const contractNFT = await hre.ethers.deployContract("NFT");
        await contractNFT.mint(other, "https://example.org");

        const contract = await hre.ethers.deployContract("MarketNFT");

        await expect(contract.listNFT(tokenId, price)).to.be.revertedWith("You're not the owner of the NFT");
    });
})