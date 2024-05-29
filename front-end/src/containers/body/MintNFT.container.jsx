import React from "react";
import { MintNFTComponent } from "../../component/body/MintNFT.component";
import { getContract, handleErrorDuringContractCall } from "../../component/utils/helper";
import { ethers } from "ethers";
import { useAccount } from "@metamask/sdk-react-ui";
import axios from 'axios';
import YourNFTs from './YourNFTs';

const PINATA_API_KEY = 'a327535ffddc60a0b798';
const PINATA_SECRET_API_KEY = 'e37ef8cadbae12d2c026d16d1c461d930b7f64672999775e32156213a4ba7ed0';

export const MintNFTContainer = ({ setSnackMessage, setSeverity, setOpenSnack }) => {
    const [url, setUrl] = React.useState("");
    const [file, setFile] = React.useState(null);
    const [isImage, setIsImage] = React.useState(false);
    const [price, setPrice] = React.useState(0);
    const account = useAccount();

    const onNewInput = async (e) => {
        const newUrl = e.target.value;
        try {
            const res = await fetch(newUrl);
            const buff = await res.blob();

            if (buff.type.startsWith('image/')) {
                setIsImage(true);
                setUrl(newUrl);
                setFile(null);
            } else {
                setIsImage(false);
                setUrl("");
            }
        } catch (e) {
            setIsImage(false);
            setUrl("");
        }
    }

    const onNewFile = async (e) => {
        const newFile = e.target.files[0];
        if (newFile && newFile.type.startsWith('image/')) {
            setIsImage(true);
            setUrl("");
            const pinataUrl = await uploadToPinata(newFile);
            if (pinataUrl) {
                setUrl(pinataUrl);
            } else {
                setIsImage(false);
                setSnackMessage("Failed to upload image to IPFS.");
                setSeverity("error");
                setOpenSnack(true);
            }
        } else {
            setIsImage(false);
            setUrl("");
        }
    }

    const uploadToPinata = async (file) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const formData = new FormData();
        formData.append('file', file);

        const metadata = JSON.stringify({
            name: file.name,
            keyvalues: {
                description: 'NFT image'
            }
        });
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 0
        });
        formData.append('pinataOptions', options);

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY
                }
            });
            return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        } catch (error) {
            console.error("Error uploading file to Pinata:", error);
            return null;
        }
    }

    const onMintNFT = async () => {
        let finalUrl = url;
        if (file) {
            finalUrl = await uploadToPinata(file);
        }
        if (finalUrl) {
            await handleMintNFT(setSnackMessage, setSeverity, setOpenSnack, finalUrl, account);
        } else {
            setSnackMessage("Failed to upload image to IPFS.");
            setSeverity("error");
            setOpenSnack(true);
        }
    }

    const onList = async () => {
        let finalUrl = url;
        if (file) {
            finalUrl = await uploadToPinata(file);
        }
        if (finalUrl) {
            await handleList(setSnackMessage, setSeverity, setOpenSnack, price, finalUrl);
        } else {
            setSnackMessage("Failed to upload image to IPFS.");
            setSeverity("error");
            setOpenSnack(true);
        }
    }

    return (
        <div>
            <MintNFTComponent
                isImage={isImage}
                url={url}
                onNewInput={onNewInput}
                onNewFile={onNewFile}
                onMintNFT={onMintNFT}
                onList={onList}
                setPrice={setPrice}
            />
            <YourNFTs />
        </div>
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
