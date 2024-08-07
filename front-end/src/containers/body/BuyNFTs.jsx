import React, { useEffect, useState } from 'react';
import { getContract } from "../../component/utils/helper";
import { useAccount } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import { Button, Snackbar, Alert } from '@mui/material';
import Box from "@mui/material/Box";

const BuyNFTs = () => {
    const [nftsForSale, setNftsForSale] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
    const account = useAccount();

    useEffect(() => {
        if (account.isConnected) {
            fetchNFTsForSale();
        }
    }, [account.isConnected]);

    const fetchNFTsForSale = async () => {
        setLoading(true);
        setError(null);
        const contract = getContract();

        try {
            const [tokenIds, owners, urls, prices, names, descriptions] = await contract.getAllNFTsForSale();

            const nftDetails = [];
            for (let i = 0; i < tokenIds.length; i++) {
                const owner = owners[i] || "";
                nftDetails.push({
                    id: tokenIds[i].toString(),  // Convert BigNumber to string
                    owner: owner,   // Ensure owner is a string
                    url: urls[i],
                    price: ethers.utils.formatEther(prices[i]),
                    name: names[i],
                    description: descriptions[i]
                });
            }

            setNftsForSale(nftDetails);
        } catch (error) {
            setError("Failed to fetch NFTs for sale.");
            console.error("Error fetching NFTs for sale:", error);
        } finally {
            setLoading(false);
        }
    };

    const buyNFT = async (tokenId, price) => {
        const contract = getContract();
        try {
            const tx = await contract.buyNFT(tokenId, { value: ethers.utils.parseEther(price) });
            await tx.wait();
            setNotification({ open: true, message: `NFT ${tokenId} purchased for ${price} ETH`, severity: 'success' });
            fetchNFTsForSale();  // Refresh the NFT list
        } catch (error) {
            console.error("Error buying NFT:", error);
            setNotification({ open: true, message: "Failed to buy NFT.", severity: 'error' });
        }
    };

    const cancelSale = async (tokenId) => {

        const contract = getContract();
        try {
            const tx = await contract.cancelListing(tokenId);
            await tx.wait();
            setNotification({ open: true, message: `NFT ${tokenId} sale cancelled`, severity: 'success' });
            fetchNFTsForSale();  // Refresh the NFT list
        } catch (error) {
            console.error("Error cancelling sale:", error);
            setNotification({ open: true, message: "Failed to cancel sale.", severity: 'error' });
        }
    };

    return (
        <div>
            <h2>NFTs for Sale</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {nftsForSale.length === 0 && !loading && <p>No NFTs found for sale.</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {nftsForSale.map(nft => (
                    <div key={nft.id} className="nft-card" style={{ margin: '10px', border: '1px solid black', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={nft.url} alt={`NFT ${nft.id}`} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                        <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
                            <h3 style={{ margin: '5px 0', fontWeight: 'bold' }}>{nft.name}</h3>
                            <p style={{ margin: '5px 0', color: 'gray' }}>{nft.description}</p>
                            {/*<p style={{ margin: '5px 0' }}>ID: {nft.id}</p>*/}
                            <p style={{ margin: '5px 0' }}>Price: {nft.price} ETH</p>
                        </Box>
                        {nft.owner.toLowerCase() === account.address?.toLowerCase() ? (
                            <Button variant="contained" color="secondary" onClick={() => cancelSale(nft.id)} style={{ margin: '5px' }}>Cancel Sale</Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => buyNFT(nft.id, nft.price)} style={{ margin: '5px' }}>Buy</Button>
                        )}
                    </div>
                ))}
            </div>
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default BuyNFTs;
