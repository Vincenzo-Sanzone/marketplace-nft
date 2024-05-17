import React from "react";
import ReactDOM from "react-dom/client";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";
import {HeaderComponent} from "./component/header/Header.component";
import {BodyContainer} from "./containers/body/Body.container";

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
            <div>
                <HeaderComponent/>
                <BodyContainer/>
            </div>
        </MetaMaskUIProvider>
    </React.StrictMode>
);