import {useAccount} from "@metamask/sdk-react-ui";
import {ethers} from "ethers";
import React from "react";
import {BodyComponent} from "../../component/body/Body.component";
import {SnackAlert} from "../../component/utils/SnackAlert";
import {useTabContext} from "../../context/TabProvider";

export const BodyContainer = () => {
    const account = useAccount();
    const [openListSnack, setOpenListSnack] = React.useState(false);
    const [severity, setSeverity] = React.useState("success");
    const [snackMessage, setSnackMessage] = React.useState("");
    const {tabChosen} = useTabContext();

    const onList = async () => {
        await handleList(setOpenListSnack, setSeverity, setSnackMessage);
    };

    return (
        <div>
            <BodyComponent value = {tabChosen} isConnected={account.isConnected} onList={onList} onShowListed={onShowListed}/>
            <SnackAlert open={openListSnack} message={snackMessage} severity={severity}
                        onClose={() => setOpenListSnack(false)}/>
        </div>
    );
};

async function onShowListed() {
    console.log("showListedNFT CLICKED\n");
    const contract = getContract();
    const result = await contract.getListing(0); // per ora tokeId = 0
    console.log("i am here");
    const price = result[0];
    const seller = result[1];
    console.log("Price:", price);
    console.log("Seller:", seller);
}

async function handleList(setOpenListSnack, setSeverity, setSnackMessage) {
    const contract = getContract();

    try {
        await contract.mintAndList("https://gateway.pinata.cloud/ipfs/QmZQ5", 10);

        contract.on("Listed", () => {
            setSnackMessage("NFT Minted and Listed");
            setSeverity("success");
            setOpenListSnack(true);
        });
    } catch (error) {


        if (error.reason) {
            const regex = /reverted with reason string '(.+?)'/;
            const match = error.reason.match(regex);
            console.log(match)
            if (match && match[1]) {
                setSnackMessage(`Error: ${match[1]}`);
            }
        } else {
            setSnackMessage("Transaction failed");
        }
        setSeverity("error");
        setOpenListSnack(true);
    }
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

    return contract;
}
