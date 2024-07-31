import React, { useEffect, useState } from 'react';
import { getContract } from "../../component/utils/helper";
import { useAccount } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";

const YourNFTs = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            const [tokenIds, urls] = await contract.getNFTsByOwner(account.address);

           // console.log("tokenIds:", tokenIds);
            //console.log("urls:", urls);

            // Utilizza un array per salvare i dettagli degli NFT
            const nftDetails = [];
            for (let i = 0; i < tokenIds.length; i++) {
                nftDetails.push({
                    id: tokenIds[i].toString(),
                    url: urls[i]
                });
                console.log(`tokenId = ${tokenIds[i]}, url = ${urls[i]}`);
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
            alert(`NFT ${tokenId} listed for sale at ${price} ETH`);
        } catch (error) {
            console.error("Error listing NFT:", error);
            alert("Failed to list NFT.");
        }
    };

    const removeNFT = async (tokenId) => {
        const contract = getContract();
        try {
            const tx = await contract.removeNFT(tokenId);
            await tx.wait();
            alert(`NFT ${tokenId} removed`);
            fetchNFTs();  // Refresh the NFT list
        } catch (error) {
            console.error("Error removing NFT:", error);
            alert("Failed to remove NFT.");
        }
    };


    return (
        <div>
            <h2>Your NFTs</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {nfts.length === 0 && !loading && <p>No NFTs found.</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {nfts.map(nft => (
                    <div key={nft.id} className="nft-card" style={{ margin: '10px', border: '1px solid black', padding: '10px' }}>
                        <img src={nft.url} alt={`NFT ${nft.id}`} style={{ width: '200px', height: '200px' }} />
                        <p>ID: {nft.id}</p>
                        <button onClick={() => {
                            const price = prompt("Enter sale price in ETH:");
                            if (price) listNFT(nft.id, price);
                        }}>Metti in vendita</button>
                        <button onClick={() => removeNFT(nft.id)}>Elimina NFT</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YourNFTs;
