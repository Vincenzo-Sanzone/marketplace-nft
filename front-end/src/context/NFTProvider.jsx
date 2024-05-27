import React, {createContext, useContext, useEffect, useState} from 'react';
import {getContract} from "../component/utils/helper";

const NFTContext = createContext({});

export const useNFTContext = () => useContext(NFTContext);

export const NFTProvider = ({ children }) => {
    const [allNFT, setAllNFT] = useState([]);

    useEffect(() => {
        const fetchAllNFTs = async () => {
            const contract = getContract();
            const nftCount = await contract.getLastTokenId();
            const nfts = [];
            for (let i = 0; i < nftCount; i++) {
                const nft = await contract.getNFT(i);
                nfts.push(nft);
            }
            console.log("nfts", nfts);
            setAllNFT(nfts);
        };

        const listenToEvents = () => {
            const contract = getContract();
            contract.on("Minted", (tokenId, owner, url) => {
                console.log("Minted", tokenId, owner, url);
                setAllNFT(prevNFTs => [...prevNFTs, { owner, url }]);
            });

            contract.on("Listed", (tokenId, price) => {
                console.log("Listed", tokenId, price);
                setAllNFT(prevNFTs => {
                    return prevNFTs.map((nft, index) => {
                        if (index === tokenId) {
                            return { ...nft, price };
                        }
                        return nft;
                    });
                });

                console.log("allNFT", allNFT);
            });

            contract.on("Bought", (tokenId, buyer) => {
                console.log("Bought", tokenId, buyer);
                fetchAllNFTs();
            });

            contract.on("Cancelled", (tokenId) => {
                console.log("Cancelled", tokenId);
                fetchAllNFTs();
            });
        };

        fetchAllNFTs();
        listenToEvents();

        return () => {
            const contract = getContract();
            contract.removeAllListeners("Minted");
            contract.removeAllListeners("Listed");
            contract.removeAllListeners("Bought");
            contract.removeAllListeners("Cancelled");
        };
    }, []);

    return (
        <NFTContext.Provider value={{ allNFT }}>
            {children}
        </NFTContext.Provider>
    );
};
