import React from "react";
import { useEffect, useState } from "react";
import { Routes, Route, } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Dashboard from "./dashboard";
import Logo from "./logo";

import {
  ChakraProvider,
  Button,
  Text,
  Box,
  Center
} from '@chakra-ui/react'

//Contains the initial welcome page and Auth0 for users to authenticate
//Based on the Auth0's documentation available at https://auth0.com/docs/quickstart/spa/vanillajs

const App = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  const [profile, setProfile] = useState({});
  //Login process with Auth0
  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-kvaqmgjn8xoqxfns.us.auth0.com";
  
      try {
        const accessToken = await getAccessTokenSilently({
          client_secret: "AMaX_wAlBt-BkFa-BFR9buqfBen4Rzf4Pkd9wkdQvq6Pt_ttQFb5-S-VuJ-Sb2iK",
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user read:users_app_metadata"
        });
  
        const userDetails = `https://${domain}/api/v2/users/${user.sub}`;
  
        const metadataResponse = await fetch(userDetails, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        });

        const response = await metadataResponse.json();
        setProfile(response);

      } catch (e) {
        console.error(e.message);
      }
    };
    if (user && isAuthenticated && window.location.href !== window.location.origin + "/dashboard") {
      let metadataResponse = getUserMetadata();
      if (metadataResponse !== null) {
        window.location.href = "/dashboard";
      }
  }

    getUserMetadata();
  }, [getAccessTokenSilently, user]);


  return (
    <ChakraProvider resetCSS>
      {!isAuthenticated && !isLoading && (
      <Box textAlign="center">
        <Center mt={200}>
          <Logo />
        </Center>
        <Text textAlign="center" fontSize="4xl" mt={25} as="b">
          Welcome to karTracking! 
        </Text>
        <Text textAlign="center" fontSize="xl" mt={75}>Log in to get started</Text>
        <Button variant="solid" size="lg" mt={75} textAlign="center" type="link"
                onClick={() => loginWithRedirect({ returnTo: window.location.origin + "/dashboard"})}
                className="login-button">
          Log In
        </Button>
      </Box>
     )}
      <Routes>
        <Route
        path="/dashboard"
        element={
          <Dashboard
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          user={profile}
          logout={logout}
          />
        }
        />
      </Routes>
    </ChakraProvider>
  );

};

export default App;
