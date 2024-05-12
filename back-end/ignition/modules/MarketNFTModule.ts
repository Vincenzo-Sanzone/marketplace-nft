import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const MarketNFTModule = buildModule("MarketNFTModule", (m) => {

    const MarketNFT = m.contract("MarketNFT");

    return { MarketNFT};
});

export default MarketNFTModule;