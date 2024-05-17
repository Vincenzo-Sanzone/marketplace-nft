import Button from "@mui/material/Button";
import React from "react";

export const BodyComponent = ({isConnected, onList, onShowListed}) => {
    const emitList = () => {
        onList();
    }
    const emitShowListed = () => {
        onShowListed();
    }

    return (
        <div>
            <Button disabled={!isConnected} onClick={emitList}>MINT AND LIST</Button>
            <Button disabled={!isConnected} onClick={emitShowListed}>show Listed NFT</Button>
        </div>
    );
}