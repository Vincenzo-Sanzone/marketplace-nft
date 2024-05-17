import React from 'react';
import {AppBar, Toolbar, Typography} from '@mui/material';
import {MetaMaskButton} from "@metamask/sdk-react-ui";
import "../../styles/css/Header.css";

export const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={"flex-grow"}>
                    Marketplace NFT
                </Typography>
                <MetaMaskButton color={"blue"}/>
            </Toolbar>
        </AppBar>

    );
}
