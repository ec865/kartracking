import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));

//Contains the credentials of Auth0 and renders the whole app.
root.render(
  <Auth0Provider
    domain="dev-kvaqmgjn8xoqxfns.us.auth0.com"
    clientId="tFf9eIzcSZZnGYoQCiwlB4CoGeaSVhPW"
    redirectUri={window.location.origin}
    audience="https://dev-kvaqmgjn8xoqxfns.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata read:client_grants create:client_grants delete:client_grants 
            update:users delete:users read:users read:user_idp_tokens"
  >
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>
);