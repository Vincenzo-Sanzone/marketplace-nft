import {expect} from "chai";
import hre from "hardhat";

describe("Validation mint", () => {
    it("Should mint a new NFT", async () => {
        const tokenUri = "https://example.org";
        const address = "0x" + "1".repeat(40);

        const contract = await hre.ethers.deployContract("NFT");
        const response = await contract.mint(address, tokenUri);
        await response.wait();

        expect(await contract.ownerOf(0)).to.be.equal(address);
        expect(await contract.tokenURI(0)).to.be.equal(tokenUri);
    });
})