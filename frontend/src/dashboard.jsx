import React from "react";
import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Container,
  Link,
  Center,
} from '@chakra-ui/react'

import Car from "./car";
import Settings from "./setttings";

//Responsible from the design and functionality of the dashboard.
//Also contains some unit settins functionality

const Dashboard = (props) => {
  const {
    isAuthenticated,
    isLoading,
    user,
    logout
  } = props;

  const [usersCars, setUsersCars] = useState([]);
  const [models, setModels] = useState("");
  //Default unit settins for a new user 
  const [userSettings, setUserSettings] = useState({
    user_id: user.user_id,
    distance_unit: "km",
    volume_unit: "litre",
    fuel_efficiency_unit: "l/100",
    currency: "GBP"
  })
  
  //Get the user's settings in case they have changed them
  useEffect(() => {
    const getUnitSettings = async () => {
      try {
        const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/user?user_id=${encodeURIComponent(user.user_id)}`,
        {
          mode: "cors",
          method: "GET",
        }
        );
        if (response.status !== 200){
          console.error("Error while getting the user's settings.");
          return;
        }
        const settings = await response.json();
        setUserSettings({
          ['user_id']: user.user_id,
          ['distance_unit']: settings.distance_unit,
          ['volume_unit']: settings.volume_unit,
          ['fuel_efficiency_unit']: settings.fuel_efficiency_unit,
          ['currency']: settings.currency
        });

      } catch(error) {
        console.error(error.name, error.message);
      }

      getUnitSettings();
    };
  }, [user, userSettings, usersCars, models]);
  
  //Get the user's cars
  useEffect(() => {
    const getCars = async () => {
      try {
        const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/car?user_id=${encodeURIComponent(user.user_id)}`,
        {
          mode: "cors",
          method: "GET",
        }
        );
        const data = await response.json();
        setUsersCars(data);
      } catch(error) {
        console.error(error.name, error.message);
      }
    }

    getCars();
  }, [user]);

  //Get all the different models in the database
  useEffect(() => {
    const getModels = async () => {
      try {
        const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/car`,
        {
          mode: "cors",
          method: "GET",
        }
        );
        const data = await response.json();
        setModels(data);
      } catch(error) {
        console.error(error.name, error.message);
      }
    }

    getModels();
  }, [user]);

  return (
    <ChakraProvider resetCSS>
      {isAuthenticated && !isLoading && (
        <>
          <Settings
          user={user}
          userSettings={userSettings} 
          logout={logout}
          />
          <Car 
          user={user}
          userSettings={userSettings}
          usersCars={usersCars}
          models={models}
          />
          <Container mt={20}>
            <Center>
              <Link href='https://forms.gle/vRks4ntyrK9siWRS8' isExternal>
                Please provide feedback if you haven't done so already.
              </Link>
            </Center>
          </Container>
        </>
      )}
    </ChakraProvider>
  )
  
};

export default Dashboard;