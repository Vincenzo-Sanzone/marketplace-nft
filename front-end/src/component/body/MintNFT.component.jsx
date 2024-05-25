import { TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import ConstructionIcon from '@mui/icons-material/Construction';
import Button from "@mui/material/Button";
import React from "react";
import {useAccount} from "@metamask/sdk-react-ui";
import {ListNFTButton} from "../utils/ListNFTButton";
import "../../styles/css/MintNFT.css";

export const MintNFTComponent = ({url, isImage, onNewInput, onMintNFT, onList, setPrice}) => {
    const account = useAccount();
    const errorPresent = !(account.isConnected && isImage);

    return (
        <Box className={"container"}>
            {isImage ? (<img src={url} alt={""} className={"image"}/>) : (
                <Typography className={"typography"}>
                    When you enter a valid url, your image will be shown here.
                </Typography>
            )}
            <TextField label="Insert the URL of the image" onInput={onNewInput} className={"text-url"}/>
            <Button
                variant="contained"
                startIcon={<ConstructionIcon/>}
                onClick={onMintNFT}
                disabled={errorPresent}
                className={"button-mint"}
            >
                Create NFT
            </Button>
            <ListNFTButton
                hasOtherError={errorPresent}
                onList={onList}
                setPrice={setPrice}
                textCss={"text-price"}
                buttonCss={""}
            />
        </Box>
    )
}