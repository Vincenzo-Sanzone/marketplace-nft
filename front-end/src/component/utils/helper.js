import {ethers} from "ethers";



export const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const abi = require("../../contracts/MarketplaceNFT.json").abi;


    return new ethers.Contract(
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
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