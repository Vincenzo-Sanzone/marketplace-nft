import {ethers} from "ethers";



export const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const abi = require("../../contracts/MarketplaceNFT.json").abi;


    return new ethers.Contract(
        "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
        abi,
        signer
    );
}

export const handleErrorDuringContractCall = (error, setSnackMessage, setSeverity, setOpenSnack) => {
    if (error.reason) {
        const regex = /reverted with reason string '(.+?)'/;
        const match = error.reason.match(regex);
        if (match && match[1]) {
            setSnackMessage(`Error: ${match[1]}`);
        } else {
            setSnackMessage("Transaction failed");
        }
    } else {
        setSnackMessage("Transaction failed");
    }
    setSeverity("error");
    setOpenSnack(true);
}