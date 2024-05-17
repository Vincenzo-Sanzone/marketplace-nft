import Button from "@mui/material/Button";
import React from "react";

export const BodyComponent = ({isConnected, onList, onShowListed}) => {
    return (
        <div>
            <Button disabled={!isConnected} onClick={onList}>MINT AND LIST</Button>
            <Button disabled={!isConnected} onClick={onShowListed}>show Listed NFT</Button>
        </div>
    );
}