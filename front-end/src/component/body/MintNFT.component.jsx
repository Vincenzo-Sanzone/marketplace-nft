import {Container, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import ConstructionIcon from '@mui/icons-material/Construction';
import Button from "@mui/material/Button";
import React from "react";
import { useAccount } from "@metamask/sdk-react-ui";
import { ListNFTButton } from "../utils/ListNFTButton";
import "../../styles/css/MintNFT.css";

export const MintNFTComponent = ({ url, isImage, onNewInput, onNewFile, onMintNFT, onList, setPrice, setName, setDescription }) => {
    const account = useAccount();
    const errorPresent = !(account.isConnected && isImage);
    // Riferimento per l'input file nascosto
    const fileInputRef = React.useRef();

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px' }}>
            <Box className={"container"} display="flex" flexDirection="column" alignItems="center">
                {isImage ? (
                    <img src={url} alt="" className={"image"} style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '20px' }} />
                ) : (
                    <Typography className={"typography"} style={{ marginBottom: '20px' }}>
                        {/*When you enter a valid URL or upload a valid image, your image will be shown here.*/}
                        upload a valid image, your image will be shown here.
                    </Typography>
                )}
                {/*<TextField*/}
                {/*    label="Insert the URL of the image"*/}
                {/*    onInput={onNewInput}*/}
                {/*    className={"text-url"}*/}
                {/*    fullWidth*/}
                {/*    style={{ marginBottom: '20px' }}*/}
                {/*/>*/}


                {/*<input*/}
                {/*    type="file"*/}
                {/*    accept="image/*"*/}
                {/*    onChange={onNewFile}*/}
                {/*    className={"file-input"}*/}
                {/*    style={{ marginBottom: '20px' }}*/}
                {/*/>*/}

                <input
                    type="file"
                    accept="image/*"
                    onChange={onNewFile}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                <Button
                    variant="contained"
                    component="span"
                    onClick={() => fileInputRef.current.click()}
                    style={{ marginBottom: '20px' }}
                >
                    Upload Image
                </Button>

                {/*<Button*/}
                {/*    variant="contained"*/}
                {/*    startIcon={<ConstructionIcon />}*/}
                {/*    onClick={onMintNFT}*/}
                {/*    disabled={errorPresent || !name || !description}*/}
                {/*    className={"button-mint"}*/}
                {/*    style={{ marginBottom: '20px' }}*/}
                {/*>*/}
                {/*    Create NFT*/}
                {/*</Button>*/}
                <ListNFTButton
                    hasOtherError={errorPresent}
                    onList={onList}
                    onMintNFT={onMintNFT}
                    setPrice={setPrice}
                    setName={setName}
                    setDescription={setDescription}
                    textCss={"text-price"}
                    buttonCss={""}
                />
            </Box>
        </Container>
    );
}
