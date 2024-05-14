import { MetaMaskButton } from "@metamask/sdk-react-ui";
import React from "react";
import { Contract, ethers } from  "ethers";

export const App = () => {
    return (
        <div className="App">
            <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
            <button onClick={() => call()}>Click me</button>
        </div>
    );
};

async function call(){
    console.log("CLICKED");
    const contract = getContract();

    await contract.mintAndList("https://gateway.pinata.cloud/ipfs/QmZQ5", 10);

    contract.on("Listed", () => {
        console.log("DONE");
    })
}

export default function getContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const abi = require("./contracts/MarketplaceNFT.json").abi;

    console.log(abi);
    const contract = new ethers.Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi,
        signer
    );

    return contract
}