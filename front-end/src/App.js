import { MetaMaskButton } from "@metamask/sdk-react-ui";
import React, {useState} from "react";
import { Contract, ethers } from  "ethers";

export const App = () => {
   // const tokeID = 0;
    const [connectWithMetaMask, setconnectWithMetaMask] = useState(false);

    const showMetaMaskButton = () => {
        setconnectWithMetaMask(true);
    };

    return (
        <div className="App">
            { !connectWithMetaMask && <button onClick={showMetaMaskButton} >connect With Meta Mask</button> }
            <br/>
            {connectWithMetaMask && <ViewMetaMaskButton/>}
            <br/>
            <br/>
            {/*<MetaMaskButton theme={"light"} color="white"></MetaMaskButton>*/}
            <button onClick={() => call()}>List & mint NFT</button>
            <br/>
            <br/>
            <button onClick={() => showListedNFT()}>show Listed NFT</button>

        </div>
    );
};

async function showListedNFT(){
    console.log(" showListedNFT CLICKED\n");
    const contract = getContract();
    const result = await contract.getListing(0); // for now tokeId = 0
    console.log("i am here");
    const price = result[0];
    const seller = result[1];
    console.log("Price:", price);
    console.log("Seller:", seller);
}

function ViewMetaMaskButton(){
    return (<MetaMaskButton theme={"light"} color="white"></MetaMaskButton>);
}

async function call(){
    console.log("CLICKED");
    const contract = getContract();

     await contract.mintAndList("https://gateway.pinata.cloud/ipfs/QmZQ5", 10);
    console.log("BEFORE CONTRACT ON\n");
    contract.on("Listed", () => {
        console.log("INSIDE CONTRACT ON\n");
        console.log("DONE");
    })
    console.log("AFTER CONTRACT ON\n");
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