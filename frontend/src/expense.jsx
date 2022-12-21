import React from "react";
import { useState, useEffect } from "react";
import {
  ChakraProvider,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

import Statistics from './statistics'
import Info from './info'
import AddExpenseButton from './components/addExpenseButton'
import EditExpenseButton from "./components/editExpenseButton";

//Responsible from the design and functionality of all the expense operations.

const Expense = (props) => {
  const {
    user,
    userSettings,
    carId,
    usersCars,
    modelId,
    modelName
  } = props;

  //The table that display a car's expenses
  function ExpenseTable() {

    if (carId !== null && expenses.length > 0) {
      return (
        <TableContainer>
          <Table size='lg' variant='striped'>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Odometer</Th>
                <Th>Expense Type</Th>
                <Th>Price</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {expenses.map((expense) => (
                <Tr key={expense.expense_id}>
                  <Td>{dateStringManipulate(expense.date)}</Td>
                  <Td>{expense.odometer} {userSettings.distance_unit}</Td>
                  <Td>{expense.expense_type}</Td>
                  <Td>{expense.price} {userSettings.currency}</Td>
                  <Td isNumeric>
                    <EditExpenseButton
                      user={user}
                      userSettings={userSettings}
                      carId={carId}
                      usersCars={usersCars}
                      modelId={modelId}
                      modelName={modelName} 
                      expense={expense}
                      expenseId={expense.expense_id}                         
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Date</Th>
                <Th>Odometer</Th>
                <Th>Expense Type</Th>
                <Th>Price</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      );
    }
    
  }

  const [expenses, setExpenses] = useState([]);
  //Get the expenses of a car
  useEffect(() => {
    const getExpenses = async () => {
      const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/expense?car_id=${encodeURIComponent(carId)}`,
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
      setExpenses(data);
    }

    getExpenses();
  }, [carId]);

  //A helper function to convert the date's format to the prefered format
  function dateStringManipulate(string){
    const [year, month, day] = string?.toString().split('-');
    var date = new Date(+year, +month - 1, +day)
    return date.toLocaleDateString("en-GB");
  }

  return (
    <ChakraProvider resetCSS>
      <TabPanels>
        <TabPanel>
          <AddExpenseButton
            user={user}
            userSettings={userSettings}
            carId={carId}
            usersCars={usersCars}
            modelId={modelId}
            modelName={modelName}              
          />
          <ExpenseTable />
        </TabPanel>
        <TabPanel>
          <Statistics
            user={user}
            userSettings={userSettings}
            carId={carId}
            usersCars={usersCars}
            expenses={expenses}
          />
        </TabPanel>
        <TabPanel>
          <Info 
            modelId={modelId}
            modelName={modelName}
            userSettings={userSettings}
          />
        </TabPanel>
      </TabPanels>
    </ChakraProvider>
  )

};


export default Expense;