import React from 'react';
import {AppBar, Tab, Tabs, Toolbar, Typography} from '@mui/material';
import {MetaMaskButton} from "@metamask/sdk-react-ui";
import "../../styles/css/Header.css"

export const HeaderComponent = ({value, updateValue}) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={"flex-grow"}>
                    Marketplace NFT
                </Typography>
                <Tabs value={value} onChange={updateValue}
                      className={"flex-grow"} textColor={"white"}>
                    <Tab label={"Buy NFT"}/>
                    <Tab label={"Your NFT"}/>
                    <Tab label={"Mint NFT"}/>
                </Tabs>
                <MetaMaskButton color={"blue"}/>
            </Toolbar>
        </AppBar>

    );
}
