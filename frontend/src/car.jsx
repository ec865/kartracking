import React from "react";
import { useState } from "react";
import {
  ChakraProvider,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Box,
  Text,
  FormControl,
  FormLabel,
  Select,
  Center,
  Flex,
  Spacer,
  SimpleGrid,
} from '@chakra-ui/react'

import Expense from './expense'
import Info from './info'
import AddCarButton from './components/addCarButton'
import EditCarButton from './components/editCarButton'
import DeleteCarButton from './components/deleteCarButton'

//Responsible from the design and functionality of all the car operations.
//There are mainly two functionalities; the user's own cars or all the models on the app   

const Car = (props) => {
  const {
    user,
    userSettings,
    usersCars,
    models
  } = props;

  const [carId, setCarId] = useState("");
  const [modelId, setModelId] = useState("");
  const [modelName, setModelName] = useState("");

  //The displayed tabs when just a carId is present
  function CarData() {
    return (
    <>
      <Tabs size="lg" isFitted align="start" variant="enclosed-colored" mt={5}>
        <TabList>
          <Tab as="b">
            Expenses of your vehicle
          </Tab>
          <Tab as="b">
            Statistics of your vehicle
          </Tab>
        </TabList>
          <Expense
            user={user}
            userSettings={userSettings}
            carId={carId}
            usersCars={usersCars}
            modelId={modelId}
            modelName={modelName}
          />
      </Tabs>
    </>
    )
  }
  //The displayed tabs when just a modelId is present
  function InfoData() {
    return (
      <>
        <Tabs size="lg" isFitted align="start" variant="enclosed-colored" mt={5}>
          <TabList>
            <Tab as="b">
              {<Text>Average costs for {models.filter(model => model.model_id === modelId)[0].model_name}</Text>}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Info 
                modelId={modelId}
                modelName={modelName}
                userSettings={userSettings}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    )
  }
  //Display tabs depending on the carId and modelId checks
  function DisplayData()  {
    return (
      <>
        {carId !== "" && modelId !== "" && (
          <>
            <Tabs defaultIndex={2} size="lg" isFitted align="start" variant="enclosed-colored" mt={5}>
              <TabList>
                <Tab as="b">
                  Expenses of your vehicle
                </Tab>
                <Tab as="b">
                  Statistics of your vehicle
                </Tab>
                <Tab as="b">
                  {<Text>Average costs for {models.filter(model => model.model_id === modelId)[0].model_name}</Text>}
                </Tab>
              </TabList>
                  <Expense
                  user={user}
                  userSettings={userSettings}
                  carId={carId}
                  usersCars={usersCars}
                  modelId={modelId}
                  modelName={modelName}
                />   
            </Tabs>
          </>
        )}
        {carId !== "" && modelId === ""&& (
          <Box>
            <CarData />
          </Box>
          )}
        {carId === "" && modelId !== "" && (
          <>
            <InfoData />
          </>
        )}
      </>
    )
  };
            

  const carOnChange = async (event) => {
    setCarId(event.target.value);
  };
  //Manipulate the modelId to get the model name
  const modelOnChange = async (event) => {
    setModelId(event.target.value);
    let modelArray = event.target.value.split('_');
    let name = modelArray.join(' ');
    setModelName(name);
  };

    
  return(
  <ChakraProvider resetCSS>
    <Center>
        <Box w='95%' ml={10} mr={10}>
        <Text textAlign="center" fontSize="4xl" mt={10} mb={10}>
        Welcome to your dashboard, {user.name}!
        </Text>
            <Flex>
            <Box w='25%' mt={2}>
                <SimpleGrid>
                <FormControl>
                    <FormLabel>Your vehicles</FormLabel>
                    <Select placeholder='Choose a vehicle' onChange={carOnChange}>
                    {usersCars.map((car) => (
                        <option key={car.car_id} value={car.car_id}>{car.make} {car.model}</option>
                        ))}
                    </Select>
                </FormControl>
                <AddCarButton
                    user={user}
                    userSettings={userSettings}
                    usersCars={usersCars}
                    models={models}
                />
                </SimpleGrid>
            </Box>
            <Box minWidth={300}>
              {carId !== "" && (
              <Box textAlign="center" ml={5} mt={10}>
                  <EditCarButton
                    user={user}
                    userSettings={userSettings}
                    usersCars={usersCars}
                    models={models}
                    carId={carId}
                  />
                  <DeleteCarButton
                    user={user}
                    userSettings={userSettings}
                    usersCars={usersCars}
                    models={models}
                    carId={carId}                    
                  />
              </Box>
              )}
            </Box>
            <Spacer/>
            <Box w='25%' mt={2}>
              <FormControl>
                  <FormLabel>Choose a model to see its average costs</FormLabel>
                  <Select placeholder='Choose a model' onChange={modelOnChange}>
                  {models.map((model) => (
                      <option key={model.model_id} value={model.model_id}>{model.model_name}</option>
                      ))}
                  </Select>
              </FormControl>
            </Box>
            </Flex>
            <DisplayData />
        </Box>
    </Center>
  </ChakraProvider>
  )

};

export default Car;