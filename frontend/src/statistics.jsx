import React from "react";
import {
  ChakraProvider,
  Flex,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'

import LineGraph from "./linegraph";

//Responsible from the design and functionaly of the statistics tab

const Statistics = (props) => {
  const {
    user, 
    userSettings, 
    carId, 
    usersCars, 
    expenses
  } = props;
  
  //Total money spent
  function TotalSpent() {
    let sum = 0; 
    for (const expense of expenses) {
      sum = sum + Number(expense.price);
    }
    return sum;
  }

  //Total driven distance
  function DistanceDriven() {
    if (expenses.length > 0){
      let firstOdo; 
      for (const car of usersCars) {
        if (car.car_id === carId){
          firstOdo = car.initial_odometer;
        }
      }
      let distance = Number(expenses[0].odometer) - Number(firstOdo);
      return distance;
    }
    return 0;
  }

  //A helper function to display the given date in the preferred format
  function dateStringManipulate(string){
    const [year, month, day] = string?.toString().split('-');
    var date = new Date(+year, +month - 1, +day)
    return date.toLocaleDateString("en-GB");
  }

  //The date period from the first expense to the last 
  function LastToFirstExpenseDate(){
    if (expenses.length > 0) {
      let result = dateStringManipulate(expenses[expenses.length-1].date) + ' - ' + dateStringManipulate(expenses[0].date);
      return result;
    }
    return;
  }

  //Provide necessary values for the odometer line chart 
  function OdometerGraph() {
    if (expenses.length > 0) {
      let text = "Odometer Chart";
      let label = "Odemeter (" + userSettings.distance_unit + ")";
      let labels = [];
      let values = [];
      for (const expense of expenses) {
        labels.push(dateStringManipulate(expense.date));
        values.push(Number(expense.odometer));
      } 
      return (<LineGraph text={text} label={label} labels={labels.reverse()} values={values.reverse()} />);
    }
    return;
  }

  return (
    <ChakraProvider resetCSS>
      <Flex mt={5}>
        <Stat>
          <StatLabel fontSize="x-large">Total Spent</StatLabel>
          <StatNumber fontSize="x-large">{userSettings.currency} <TotalSpent/> </StatNumber>
          <StatHelpText fontSize="large"><LastToFirstExpenseDate/></StatHelpText>
        </Stat>
        <Spacer/>
        <Stat>
          <StatLabel fontSize="x-large">Total Distance</StatLabel>
          <StatNumber fontSize="x-large"><DistanceDriven/> {userSettings.distance_unit}</StatNumber>
          <StatHelpText fontSize="large"><LastToFirstExpenseDate/></StatHelpText>
        </Stat>
      </Flex>
      <OdometerGraph/>
    </ChakraProvider>
  )
};

export default Statistics;