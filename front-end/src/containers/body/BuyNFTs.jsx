import React, { useEffect, useState } from 'react';
import { getContract } from "../../component/utils/helper";
import { useAccount } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";

const BuyNFTs = () => {
    const [nftsForSale, setNftsForSale] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            const [tokenIds, owners, urls, prices] = await contract.getAllNFTsForSale();

            const nftDetails = [];
            for (let i = 0; i < tokenIds.length; i++) {
              // if (owners[i].toLowerCase() !== account.address.toLowerCase()) {  // Don't show your own NFTs
                const owner = owners[i] || "";
                nftDetails.push({
                        id: tokenIds[i].toString(),  // Convert BigNumber to string
                        owner: owner,   // Ensure owner is a string
                        url: urls[i],
                        price: ethers.utils.formatEther(prices[i])
                    });
              // }
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
            alert(`NFT ${tokenId} purchased for ${price} ETH`);
            fetchNFTsForSale();  // Refresh the NFT list
        } catch (error) {
            console.error("Error buying NFT:", error);
            alert("Failed to buy NFT.");
        }
    };

    const cancelSale = async (tokenId) => {
        const contract = getContract();
        try {
            const tx = await contract.cancelListing(tokenId);
            await tx.wait();
            alert(`Sale for NFT ${tokenId} cancelled`);
            fetchNFTsForSale();  // Refresh the NFT list
        } catch (error) {
            console.error("Error cancelling sale:", error);
            alert("Failed to cancel sale.");
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
                    <div key={nft.id} className="nft-card" style={{ margin: '10px', border: '1px solid black', padding: '10px' }}>
                        <img src={nft.url} alt={`NFT ${nft.id}`} style={{ width: '200px', height: '200px' }} />
                        <p>ID: {nft.id}</p>
                        <p>Price: {nft.price} ETH</p>
                        {nft.owner.toLowerCase() === account.address?.toLowerCase()  ? (
                            <button onClick={() => cancelSale(nft.id)}>Cancel Sale</button>
                        ) : (
                            <button onClick={() => buyNFT(nft.id, nft.price)}>Buy</button>
                        )

                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyNFTs;
