import React from "react";
import ReactDOM from "react-dom/client";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";
import {BodyContainer} from "./containers/body/Body.container";
import {TabProvider} from "./context/TabProvider";
import {HeaderContainer} from "./containers/header/Header.container";

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
            <TabProvider>
                <HeaderContainer/>
                <BodyContainer/>
            </TabProvider>
        </MetaMaskUIProvider>
    </React.StrictMode>
);