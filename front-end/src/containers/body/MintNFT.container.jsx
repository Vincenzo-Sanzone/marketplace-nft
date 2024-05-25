import React from "react";
import { MintNFTComponent } from "../../component/body/MintNFT.component";
import {getContract, handleErrorDuringContractCall} from "../../component/utils/helper";
import {ethers} from "ethers";
import {useAccount} from "@metamask/sdk-react-ui";
export const MintNFTContainer = ({setSnackMessage, setSeverity, setOpenSnack}) => {
    const [url, setUrl] = React.useState("");
    const [isImage, setIsImage] = React.useState(false);
    const [price, setPrice] = React.useState(0);
    const account = useAccount();
    const onNewInput = async (e) => {
        const newUrl = e.target.value;
        try{
            const res = await fetch(newUrl);
            const buff = await res.blob();

            if(buff.type.startsWith('image/')) {
                setIsImage(true);
                setUrl(newUrl);
            }
            else {
                setIsImage(false);
            }
        } catch (e) {
            setIsImage(false);
        }

    }

    const onMintNFT = async () => {
        await handleMintNFT(setSnackMessage, setSeverity, setOpenSnack, url, account);
    }

    const onList = async () => {
        await handleList(setSnackMessage, setSeverity, setOpenSnack, price, url);
    }


    return (
        <MintNFTComponent
            isImage={isImage}
            url={url}
            onNewInput={onNewInput}
            onMintNFT={onMintNFT}
            onList={onList}
            setPrice={setPrice}
        />
    );
}

async function handleList(setSnackMessage, setSeverity, setOpenSnack, price, url) {
    const contract = getContract();
    try {
        await contract.mintAndList(url, ethers.utils.parseEther(price));

        contract.on("Listed", () => {
            setSnackMessage("NFT Minted and Listed at price: " + parseFloat(price) + " ETH.");
            setSeverity("success");
            setOpenSnack(true);
        });
    } catch (error) {
        handleErrorDuringContractCall(error, setSnackMessage, setSeverity, setOpenSnack);
    }
}

async function handleMintNFT(setSnackMessage, setSeverity, setOpenSnack, url, account) {
    const contract = getContract();

    try {
        await contract.mint(account.address, url);

        contract.on("Minted", () => {
            setSnackMessage("NFT Minted.");
            setSeverity("success");
            setOpenSnack(true);
        });
    } catch (error) {
        handleErrorDuringContractCall(error, setSnackMessage, setSeverity, setOpenSnack);
    }
}