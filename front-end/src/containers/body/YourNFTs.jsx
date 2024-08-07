import React, { useEffect, useState } from 'react';
import { getContract } from "../../component/utils/helper";
import { useAccount } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import { Snackbar, Alert, TextField, Button, Grid } from '@mui/material';
import Box from "@mui/material/Box";

const YourNFTs = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [priceInputs, setPriceInputs] = useState({});

    const account = useAccount();

    useEffect(() => {
        if (account.isConnected) {
            fetchNFTs();
        }
    }, [account.isConnected]);



    const fetchNFTs = async () => {
        setLoading(true);
        setError(null);
        const contract = getContract();

        try {
            const [userTokenIds, urls, names, descriptions] = await contract.getNFTsByOwner(account.address);
            const [saleTokenIds, saleOwners, saleUrls, salePrices, saleNames, saleDescriptions] = await contract.getAllNFTsForSale();

            const nftDetails = [];
            for (let i = 0; i < userTokenIds.length; i++) {
                const tokenId = userTokenIds[i].toString();
                const url = urls[i];
                const name = names[i];
                const description = descriptions[i];

                const isForSale = saleTokenIds.map(id => id.toString()).includes(tokenId);

                nftDetails.push({
                    id: tokenId,
                    url: url,
                    name: name,
                    description: description,
                    isForSale: isForSale
                });

                console.log(`tokenId = ${tokenId}, url = ${url}, name = ${name}, description = ${description}, isForSale = ${isForSale}`);
            }

            setNfts(nftDetails);
        } catch (error) {
            setError("Failed to fetch NFTs.");
            console.error("Error fetching NFTs:", error);
        } finally {
            setLoading(false);
        }
    };

    const listNFT = async (tokenId, price) => {
        const contract = getContract();
        try {
            const tx = await contract.listNFT(tokenId, ethers.utils.parseEther(price));
            await tx.wait();
            setNotification({ open: true, message: `NFT ${tokenId} listed for sale at ${price} ETH`, severity: 'success' });
            setNfts(prevNfts =>
                prevNfts.map(nft =>
                    nft.id === tokenId ? { ...nft, isForSale: true } : nft
                )
            );
        } catch (error) {
            console.error("Error listing NFT:", error);
            setNotification({ open: true, message: 'Failed to list NFT.', severity: 'error' });
        }
    };

    const cancelSale = async (tokenId) => {
        const contract = getContract();
        try {
            const tx = await contract.cancelListing(tokenId);
            await tx.wait();
            setNotification({ open: true, message: `Sale for NFT ${tokenId} cancelled`, severity: 'success' });
            setNfts(prevNfts =>
                prevNfts.map(nft =>
                    nft.id === tokenId ? { ...nft, isForSale: false } : nft
                )
            );
        } catch (error) {
            console.error("Error cancelling sale:", error);
            setNotification({ open: true, message: 'Failed to cancel sale.', severity: 'error' });
        }
    };

    const removeNFT = async (tokenId) => {
        const contract = getContract();
        try {
            const tx = await contract.removeNFT(tokenId);
            await tx.wait();
            setNotification({ open: true, message: `NFT ${tokenId} removed`, severity: 'success' });
            setNfts(prevNfts => prevNfts.filter(nft => nft.id !== tokenId));
        } catch (error) {
            console.error("Error removing NFT:", error);
            setNotification({ open: true, message: 'Failed to remove NFT.', severity: 'error' });
        }
    };

    const handlePriceChange = (e, tokenId) => {
        setPriceInputs({
            ...priceInputs,
            [tokenId]: e.target.value
        });
    };

    return (
        <div>
            <h2>Your NFTs</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {nfts.length === 0 && !loading && <p>No NFTs found.</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {nfts.map(nft => (
                    <div key={nft.id} className="nft-card" style={{ margin: '10px', border: '1px solid black', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={nft.url} alt={`NFT ${nft.id}`} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                        <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
                            <h3 style={{ margin: '5px 0', fontWeight: 'bold' }}>{nft.name}</h3>
                            <p style={{ margin: '5px 0', color: 'gray' }}>{nft.description}</p>
                            <p style={{ margin: '5px 0' }}>ID: {nft.id}</p>

                        </Box>
                        {nft.isForSale ? (
                            <Button variant="contained" color="secondary" onClick={() => cancelSale(nft.id)} style={{ margin: '5px' }}>Cancel Sale</Button>
                        ) : (
                            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                <TextField
                                    label="Price in ETH"
                                    type="number"
                                    value={priceInputs[nft.id] || ''}
                                    onChange={(e) => handlePriceChange(e, nft.id)}

                                    style={{ marginBottom: '10px' }}

                                />
                                <Button
                                    variant="contained" color="primary"
                                    onClick={() => {
                                        const price = priceInputs[nft.id];
                                        if (price) {
                                            listNFT(nft.id, price);
                                        } else {
                                            setNotification({ open: true, message: "Please enter a price.", severity: 'warning' });
                                        }
                                    }}
                                    style={{ margin: '5px' }}


                                >
                                    Sale
                                </Button>
                            </Box>
                        )}
                        <Button variant="contained" color="error" onClick={() => removeNFT(nft.id)} style={{ margin: '5px' }}>Delete NFT</Button>
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

export default YourNFTs;
