import Button from "@mui/material/Button";
import React, {useState} from "react";
import {InputAdornment, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import SellIcon from '@mui/icons-material/Sell';
export const ListNFTButton = ({hasOtherError, onList, setPrice, textCss, buttonCss}) => {
    const [priceIsNumber, setPriceIsNumber] = useState(false);

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

    return (
        <Box>
            <TextField
                label="Insert the price of the NFT"
                onInput={updatePrice}
                className={textCss}
                InputProps={{
                    endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                }}
                helperText={priceIsNumber ? "" : "Price must be a number > 0"}
            />
            <Button
                disabled={hasOtherError || !priceIsNumber}
                onClick={onList}
                variant="contained"
                className={buttonCss}
                startIcon={<SellIcon/>}
            >
                Sell NFT
            </Button>
        </Box>
    );
}