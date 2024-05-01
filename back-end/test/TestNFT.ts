import {expect} from "chai";
import hre from "hardhat";
import {NFT} from "../typechain-types";

let nft: NFT
beforeEach(async function () {
    const [owner] = await hre.ethers.getSigners();
    nft = await hre.ethers.deployContract("NFT", [owner.address])
})

describe("Deployment", () => {
    it("Should track NFT's name", async () => {
        expect(await nft.name()).to.be.equal("NFTToken")
    })

    it("Should track NFT's symbol", async () => {
        expect(await nft.symbol()).to.be.equal("NFT")
    })
})

describe("Validation mint", () => {
    it("Should mint a new NFT", async () => {
        const tokenUri = "https://example.org";
        const address = "0x" + "1".repeat(40);

        const response = await nft.mint(address, tokenUri);
        await response.wait();

        expect(await nft.ownerOf(0)).to.be.equal(address);
        expect(await nft.tokenURI(0)).to.be.equal(tokenUri);
    })
})

describe("Validation getApproval", () => {
    it("Should revert when the sender isn't the address specified in the constructor", async () => {
        const tokenUri = "https://example.org";
        const address = "0x" + "1".repeat(40);

        const [owner, other] = await hre.ethers.getSigners();
        nft = await hre.ethers.deployContract("NFT", [other]);
        const response = await nft.mint(address, tokenUri);
        await response.wait();

        await expect(nft.getApproval(0)).to.be.revertedWith("Only the market can approve the transfer");
    })

    it("Shouldn't revert when the sender is the address specified in the constructor", async () => {
        const tokenUri = "https://example.org";
        const address = "0x" + "1".repeat(40);

        const response = await nft.mint(address, tokenUri);
        await response.wait();

        await expect(nft.getApproval(0)).to.not.be.reverted;
    })
})