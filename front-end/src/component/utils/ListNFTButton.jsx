import Button from "@mui/material/Button";
import React, {useState} from "react";
import {Grid, InputAdornment, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import SellIcon from '@mui/icons-material/Sell';
import ConstructionIcon from "@mui/icons-material/Construction";
export const ListNFTButton = ({ hasOtherError, onList,onMintNFT, setPrice, setName, setDescription, textCss, buttonCss }) => {
    const [priceIsNumber, setPriceIsNumber] = useState(false);
    const [name, setNameState] = useState("");
    const [description, setDescriptionState] = useState("");

    const updatePrice = (event) => {
        const inputValue = event.target.value;
        const validNumberRegex = /^[+]?\d+(\.\d+)?$/;
        if (validNumberRegex.test(inputValue) && parseFloat(inputValue) > 0) {
            setPrice(inputValue);
            setPriceIsNumber(true);
        } else {
            setPriceIsNumber(false);
        }
    };

    const handleNameChange = (event) => {
        const inputValue = event.target.value;
        setName(inputValue);
        setNameState(inputValue);
    };

    const handleDescriptionChange = (event) => {
        const inputValue = event.target.value;
        setDescription(inputValue);
        setDescriptionState(inputValue);
    };

    return (
        <Box>
            <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                className={textCss}
                helperText={name ? "" : "Name is required"}
            />
            <TextField
                label="Description"
                value={description}
                onChange={handleDescriptionChange}
                className={textCss}
                helperText={description ? "" : "Description is required"}
                multiline
                rows={4}
                style={{ marginBottom: '10px' }}
            />
            <TextField
                label="Insert the price of the NFT"
                type="number"
                onInput={updatePrice}
                className={textCss}
                InputProps={{
                    endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                }}
                helperText={priceIsNumber ? "" : "Price must be a number > 0"}
                style={{ marginBottom: '10px' }}
            />
            <Grid container spacing={2} justifyContent="center">
                <Grid item>

                    <Button
                        variant="contained"
                        startIcon={<ConstructionIcon />}
                        onClick={onMintNFT}
                        disabled={hasOtherError || !name || !description || priceIsNumber}
                        className={"button-mint"}
                    >
                        Create NFT
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        disabled={hasOtherError || !priceIsNumber || !name || !description}
                        onClick={onList}
                        variant="contained"
                        className={buttonCss}
                        startIcon={<SellIcon />}
                    >
                        Create & Sell NFT
                    </Button>
                </Grid>
            </Grid>

        </Box>
    );
}