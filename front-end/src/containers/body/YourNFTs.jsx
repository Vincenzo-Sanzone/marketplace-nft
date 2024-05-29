import React, { useEffect, useState } from 'react';
import { getContract } from "../../component/utils/helper";
import { useAccount } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";

const YourNFTs = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true); // Stato di caricamento
    const [error, setError] = useState(null); // Stato di errore
    const account = useAccount();

    useEffect(() => {
        if (account.isConnected) {
            fetchNFTs();
        }
    }, [account]);

    const fetchNFTs = async () => {
        setLoading(true); // Inizia il caricamento
        setError(null); // Reset dell'errore
        const contract = getContract();
        const maxTokenId = 100;  // Numero massimo di tokenID da verificare
        const nftDetails = [];

        try {
            for (let id = 1; id <= maxTokenId; id++) {
                try {
                    const nft = await contract.getNFT(id);
                    if (nft[1].toLowerCase() === account.address.toLowerCase()) {
                        nftDetails.push({
                            id,
                            price: nft[0],
                            owner: nft[1],
                            url: nft[2]
                        });
                    }
                } catch (error) {
                    // Ignora errori, potrebbero essere tokenID non validi
                    console.error(`Error fetching NFT with ID ${id}:`, error);
                }
            }
            setNfts(nftDetails);
        } catch (error) {
            setError("Failed to fetch NFTs.");
            console.error("Error fetching NFTs:", error);
        } finally {
            setLoading(false); // Fine del caricamento
        }
    };

    return (
        <div>
            <h2>Your NFTs</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div className="nft-grid">
                {nfts.map(nft => (
                    <div key={nft.id} className="nft-card">
                        <img src={nft.url} alt={`NFT ${nft.id}`} />
                        <p>ID: {nft.id}</p>
                        <p>Price: {ethers.utils.formatEther(nft.price)} ETH</p>
                    </div>
                ))}
                {!loading && nfts.length === 0 && <p>No NFTs found.</p>}
            </div>
        </div>
    );
}

export default YourNFTs;
