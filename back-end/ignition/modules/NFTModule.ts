import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const NFTModule = buildModule("NFTModule", (m) => {
    const addressMarket = m.getParameter("market", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
    const NFT = m.contract("NFT", [addressMarket]);
   // const MarketNFT = m.contract("MarketNFT");
    return { NFT};
});

export default NFTModule;

/*
* MarketNFTModule#MarketNFT - 0x5FbDB2315678afecb367f032d93F642f64180aa3
 NFTModule#NFT - 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
* */

