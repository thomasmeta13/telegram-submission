import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
