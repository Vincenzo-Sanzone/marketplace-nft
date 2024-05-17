import {useAccount} from "@metamask/sdk-react-ui";
import {ethers} from "ethers";
import React from "react";
import {BodyComponent} from "../../component/body/Body.component";

export const BodyContainer = () => {
    const account = useAccount();

    return (
        <BodyComponent isConnected={account.isConnected} onList={onList} onShowListed={onShowListed}/>
    );
}

async function onShowListed() {
    console.log(" showListedNFT CLICKED\n");
    const contract = getContract();
    const result = await contract.getListing(0); // for now tokeId = 0
    console.log("i am here");
    const price = result[0];
    const seller = result[1];
    console.log("Price:", price);
    console.log("Seller:", seller);
}

async function onList() {
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

function getContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const abi = require("../../contracts/MarketplaceNFT.json").abi;

    console.log(abi);
    const contract = new ethers.Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi,
        signer
    );

    return contract
}