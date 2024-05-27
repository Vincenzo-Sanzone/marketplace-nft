import React from "react";
import {getAllNFTs} from "../../component/utils/helper";
import {useAccount} from "@metamask/sdk-react-ui";
import {Typography} from "@mui/material";
import {useNFTContext} from "../../context/NFTProvider";

export const ListNFTContainer = ({setOpenSnack, setSeverity, setSnackMessage}) => {
    const account = useAccount();
    const {allNFT} = useNFTContext();
    const nftOwned = allNFT.filter(nft => nft.owner === account);

    return (
        <div>
            <Typography>{allNFT}</Typography>
            <Typography>{nftOwned}</Typography>
        </div>
        // <ListNFTComponent
        //     onClickedButton={() => console.log("ListNFT CLICKED")}
        //     isListing={true}
        //     nftToShow={nftOwned}
        // />
    );
}