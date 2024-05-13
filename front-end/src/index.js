import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";

const root = ReactDOM.createRoot(
    document.getElementById("root")
);

root.render(
    <React.StrictMode>
        <MetaMaskUIProvider
            sdkOptions={{
                dappMetadata: {
                    name: "Marketplace NFT",
                    url: window.location.href,
                },
            }}
        >
            <App />
        </MetaMaskUIProvider>
    </React.StrictMode>
);