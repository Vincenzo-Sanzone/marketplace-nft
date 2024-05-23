import Button from "@mui/material/Button";
import React from "react";
import { TabPanel } from "../utils/TabPanel";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

export const BodyComponent = ({ value, isConnected, onList, onShowListed }) => {
    return (
        <Box>
            <TabPanel value={value} index={0}>
                INSERT BUY NFT LOGIC HERE
                {/*<Button disabled={!isConnected} onClick={onList}>MINT AND LIST</Button>*/}
                {/*<Button disabled={!isConnected} onClick={onShowListed}>show Listed NFT</Button>*/}
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Typography>INSERT SHOW LIST LOGIC HERE</Typography>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Typography>INSERT MINT LOGIC HERE</Typography>
            </TabPanel>
        </Box>
    );
}
