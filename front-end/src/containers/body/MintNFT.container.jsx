import React, {useState} from "react";
import { MintNFTComponent } from "../../component/body/MintNFT.component";
import { getContract, handleErrorDuringContractCall } from "../../component/utils/helper";
import { ethers } from "ethers";
import { useAccount } from "@metamask/sdk-react-ui";
import axios from 'axios';
import { Box, Snackbar, Alert, TextField, Button, Typography } from '@mui/material';
import YourNFTs from './YourNFTs';

const PINATA_API_KEY = 'a327535ffddc60a0b798';
const PINATA_SECRET_API_KEY = 'e37ef8cadbae12d2c026d16d1c461d930b7f64672999775e32156213a4ba7ed0';

export const MintNFTContainer = ({ setSnackMessage, setSeverity, setOpenSnack }) => {
    const [url, setUrl] = useState("");
    const [file, setFile] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [price, setPrice] = useState(0);
    const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
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
    };

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
    };

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
    };

    const onMintNFT = async () => {
        let finalUrl = url;
        if (file) {
            finalUrl = await uploadToPinata(file);
        }
        if (finalUrl) {
            await handleMintNFT(setSnackMessage, setSeverity, setOpenSnack, finalUrl, account, name, description);
        } else {
            setSnackMessage("Failed to upload image to IPFS.");
            setSeverity("error");
            setOpenSnack(true);
        }
    };

    const onList = async () => {
        let finalUrl = url;
        if (file) {
            finalUrl = await uploadToPinata(file);
        }
        if (finalUrl) {
            await handleList(setSnackMessage, setSeverity, setOpenSnack, price, finalUrl, name, description);
        } else {
            setSnackMessage("Failed to upload image to IPFS.");
            setSeverity("error");
            setOpenSnack(true);
        }
    };

    return (
        <Box>
            <MintNFTComponent
                isImage={isImage}
                url={url}
                onNewInput={onNewInput}
                onNewFile={onNewFile}
                onMintNFT={onMintNFT}
                onList={onList}
                setPrice={setPrice}
                setName={setName}
                setDescription={setDescription}
                name={name}
                description={description}
            />
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

async function handleList(setSnackMessage, setSeverity, setOpenSnack, price, url, name, description) {
    const contract = getContract();
    try {
        await contract.mintAndList(url, ethers.utils.parseEther(price), name, description);

        contract.on("Listed", () => {
            setSnackMessage("NFT Minted and Listed at price: " + parseFloat(price) + " ETH.");
            setSeverity("success");
            setOpenSnack(true);
        });
    } catch (error) {
        handleErrorDuringContractCall(error, setSnackMessage, setSeverity, setOpenSnack);
    }
}

async function handleMintNFT(setSnackMessage, setSeverity, setOpenSnack, url, account, name, description) {
    const contract = getContract();

    try {
        await contract.mint(account.address, url, name, description);

        contract.on("Minted", () => {
            setSnackMessage("NFT Minted. now wait for the transaction confirm...");
            setSeverity("success");
            setOpenSnack(true);
        });

       // console.log("ho fatto il mint, posso ora cercare il contratto al interno!?\n");

        //const [tokenIds, urls] = await contract.getNFTsByOwner(account.address);

        //console.log("tokenIds = " + tokenIds[0] + "\n urls = " + urls[0]);

    } catch (error) {
        handleErrorDuringContractCall(error, setSnackMessage, setSeverity, setOpenSnack);
    }
}