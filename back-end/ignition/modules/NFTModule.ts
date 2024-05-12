import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MarketNFTModule from "./MarketNFTModule";


const NFTModule = buildModule("NFTModule", (m) => {
    const market = m.useModule(MarketNFTModule)
    const NFT = m.contract("NFT", [market.MarketNFT]);
    return { NFT};
});

export default NFTModule;

/*
* MarketNFTModule#MarketNFT - 0x5FbDB2315678afecb367f032d93F642f64180aa3
 NFTModule#NFT - 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
* */

