import React from "react";
import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Flex,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'

//Responsible from the design and functionality of all the information about the average expenses of a model.

const Info = (props) => {
  const {
    modelId,
    modelName,
    userSettings
  } = props;
  
  const [costs, setCosts] = useState();
  //GET the expenses by modelId
  useEffect(() => {
    const getCosts = async () => {
      const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/expense?model_id=${encodeURIComponent(modelId)}`,
        {
          mode: "cors",
          method: "GET",
        }
      );
      
      if (response.status !== 200){
        alert("There has been an error. Please check the values.");
        return;
      }
      const data = await response.json();
      setCosts(data)
    }
    getCosts();
  }, [modelId]);


  return (
    <ChakraProvider resetCSS>
        <Stat>
            <StatLabel textAlign="center" fontSize="x-large" mt={5}>{modelName} owners on average have spent</StatLabel>
        </Stat>
        <Flex mt={10}>
          <Stat>
            <StatNumber fontSize="x-large">{userSettings.currency} {costs?.refuelling}</StatNumber>
            <StatHelpText fontSize="large">on each refuelling</StatHelpText>
          </Stat>
          <Spacer/>
          <Stat>
            <StatNumber fontSize="x-large">{userSettings.currency} {costs?.servicing}</StatNumber>
            <StatHelpText fontSize="large">on each servicing</StatHelpText>
          </Stat>
          <Spacer/>
          <Stat>
            <StatNumber fontSize="x-large">{userSettings.currency} {costs?.insurance}</StatNumber>
            <StatHelpText fontSize="large">on insurance</StatHelpText>
          </Stat>
          <Spacer/>
          <Stat>
            <StatNumber fontSize="x-large">{userSettings.currency} {costs?.other_expense}</StatNumber>
            <StatHelpText fontSize="large">on other expenses</StatHelpText>
          </Stat>
        </Flex>
    </ChakraProvider>
  )
};

export default Info