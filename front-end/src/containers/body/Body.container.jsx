import React from "react";
import {SnackAlert} from "../../component/utils/SnackAlert";
import {useTabContext} from "../../context/TabProvider";
import {TabPanel} from "../../component/utils/TabPanel";
import {Typography} from "@mui/material";
import {MintNFTContainer} from "./MintNFT.container";

export const BodyContainer = () => {
    const [openSnack, setOpenSnack] = React.useState(false);
    const [severity, setSeverity] = React.useState("success");
    const [snackMessage, setSnackMessage] = React.useState("");
    const {tabChosen} = useTabContext();


    return (
        <div>
            <TabPanel value={tabChosen} index={0}>
                INSERT BUY NFT LOGIC HERE
                {/*<Button disabled={!isConnected} onClick={onList}>MINT AND LIST</Button>*/}
                {/*<Button disabled={!isConnected} onClick={onShowListed}>show Listed NFT</Button>*/}
            </TabPanel>
            <TabPanel value={tabChosen} index={1}>
                <Typography>INSERT SHOW LIST LOGIC HERE</Typography>
            </TabPanel>
            <TabPanel value={tabChosen} index={2}>
                <MintNFTContainer setOpenSnack={setOpenSnack} setSeverity={setSeverity} setSnackMessage={setSnackMessage}/>
            </TabPanel>
            <SnackAlert open={openSnack} message={snackMessage} severity={severity}
                        onClose={() => setOpenSnack(false)}/>
        </div>
    );
};

// async function onShowListed() {
//     console.log("showListedNFT CLICKED\n");
//     const contract = getContract();
//     const result = await contract.getListing(0); // per ora tokeId = 0
//     console.log("i am here");
//     const price = result[0];
//     const seller = result[1];
//     console.log("Price:", price);
//     console.log("Seller:", seller);
// }