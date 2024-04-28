import { expect } from "chai";
import hre from "hardhat";
import {NFT} from "../typechain-types";

describe("TestNFT", () => {
    it("should mint a new NFT", async () => {
        const tokenUri: string = "https://example.org"
        const address: string = "0x1234567890123456789012345678901234567890"

        const contract: Promise<NFT> = hre.ethers.deployContract("NFT", [])
        console.log("TEST3")

        await contract.then(async (nft) => {
            expect(await nft.mint(address, tokenUri)).to.equal(0)
        })
        console.log("TEST6")
    })
})