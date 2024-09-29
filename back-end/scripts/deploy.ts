import { ethers } from "hardhat";
import {NonPayableOverrides} from "../typechain-types/common";

async function main() {

        const [deployer] = await ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);

        // Deploy the NFT contract
        const NFTFactory = await ethers.getContractFactory("NFT");
        const nftContract = await NFTFactory.deploy(deployer.address);
        await nftContract.waitForDeployment();
        const nftAddress = await nftContract.getAddress();
        console.log("NFT contract deployed at:", nftAddress);

        // Deploy the MarketNFT contract passing the NFT contract address and specifying the deployer
        const MarketNFTFactory = await ethers.getContractFactory("MarketNFT");
        // const marketNFT = await MarketNFTFactory.deploy(nftAddress);
        const marketNFT = await MarketNFTFactory.deploy();
        await marketNFT.waitForDeployment();
        const marketNFTAddress = await marketNFT.getAddress();
        console.log("MarketNFT contract deployed at:", marketNFTAddress);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//  FIRST OPTION

// import { ethers } from "hardhat";
//
// async function main() {
//     // Get the ContractFactory for the NFT contract
//     const NFT = await ethers.getContractFactory("MarketNFT");
//
//     // Deploy the contract
//     const nft = await NFT.deploy();
//
//     // Wait for the deployment to complete
//     await nft.waitForDeployment();
//
//     // Log the address of the deployed contract
//     const nftAddress = await nft.getAddress();  // Usa questa riga per ottenere l'indirizzo
//     console.log("NFT contract deployed to:", nftAddress);
// }
//
// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });


//  SECOND OPTION

/*
*  const [deployer] = await ethers.getSigners();

    // Deploy the NFT contract
    const NFTFactory = await ethers.getContractFactory("NFT");
    const nftContract = await NFTFactory.deploy(deployer.address);
    await nftContract.waitForDeployment()
    console.log("NFT deployed to:", nftContract.getAddress);

    // Deploy the MarketNFT contract with the deployed NFT contract's address
    const MarketNFTFactory = await ethers.getContractFactory("MarketNFT");
    const marketNFT = await MarketNFTFactory.deploy();
    await marketNFT.waitForDeployment();
    console.log("MarketNFT deployed to:", marketNFT.getAddress);
*
*
* */