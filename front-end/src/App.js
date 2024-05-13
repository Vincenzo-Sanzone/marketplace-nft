import { MetaMaskButton } from "@metamask/sdk-react-ui";
import React from "react";

export const App = () => {
    return (
        <div className="App">
            <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
        </div>
    );
};