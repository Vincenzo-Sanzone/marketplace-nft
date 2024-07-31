import React from "react";
import {getAllNFTs} from "../../component/utils/helper";
import {useAccount} from "@metamask/sdk-react-ui";
import {Typography} from "@mui/material";
import {useNFTContext} from "../../context/NFTProvider";
import YourNFTs from "./YourNFTs";

export const ListNFTContainer = ({ setOpenSnack, setSeverity, setSnackMessage }) => {
    const account = useAccount();

    return (
        <div>
            {account.isConnected ? <YourNFTs /> : <p>Please connect your wallet.</p>}
        </div>
    );
};