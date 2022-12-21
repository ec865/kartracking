import React from "react";
import { useState } from "react";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Select,
  Flex,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea
} from '@chakra-ui/react'

import { FiEdit, FiSave } from 'react-icons/fi'

import DeleteExpenseButton from "./deleteExpenseButton";

//Contains everything related to the design and functionality of the edit expense use case.
//Based on the Chakra UI documentation available at https://chakra-ui.com/getting-started

const EditExpenseButton = (props) => {
  const {
    user,
    userSettings,
    carId,
    usersCars,
    modelId,
    modelName,
    expense,
    expenseId
  } = props;


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [expenseType, setExpenseType] = useState("");
  //Get the existing values of a particular expense
  const [expenseInfoForm, setExpenseInfoForm] = React.useState({
    date: expense.date,
    odometer: expense.odometer,
    price: expense.price,
    location: expense.location,
    expense_type: expense.expense_type,
    volume: expense.volume,
    ppu: expense.ppu,
    description: expense.description
  })

  //onChange functions for each value in expenseInfoForm
  const onChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      [event.target.name]: event.target.value,
      ['expense_id']: expenseInfoForm.expense_type + carId + expenseInfoForm.odometer.toString(),
      ['car_id']: carId,
      ['model_id']: modelId
    });

  } 

  const dateOnChange = (event) => {
    var date = event.target.valueAsDate
    const [day, month, year] = date.toLocaleDateString("en-GB").split('/');
    var new_date = year + '-' + month + '-' + day;
    setExpenseInfoForm({
      ...expenseInfoForm,
      ['date']: new_date
    });
  } 

  const odometerOnChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      ['odometer']: event
    });
  } 

  const priceOnChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      ['price']: event
    });
  } 

  const volumeOnChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      ['volume']: event
    });
  } 

  const ppuOnChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      ['ppu']: event
    });
  } 

  const onClick = async () => {
    //Check the given values in the form
    if (expenseInfoForm.odometer < 1) {
      alert("Please enter a valid odometer reading!");
      return;
    }
    if (expenseInfoForm.price < 0) {
      alert("Please enter a valid price!");
      return;       
    }
    if (expenseInfoForm.price < 0) {
      alert("Please enter a valid price!");
      return;       
    }      
    if (expenseInfoForm.expense_type === "") {
      alert("Please choose an expense type!");
      return;
    }
    if (expenseInfoForm.volume < 0) {
      alert("Please enter a valid volume!");
      return;          
    }
    if (expenseInfoForm.ppu < 0) {
      alert("Please enter a valid price per unit!");
      return;          
    }      
    //PUT the edited expense to the backend. URL encoding is used to ensure values are received correctly.
    try {
      const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/expense?expense_id=${encodeURIComponent(expenseId)}&car_id=${encodeURIComponent(carId)}&model_id=${encodeURIComponent(modelId)}&date=${encodeURIComponent(expenseInfoForm.date)}&odometer=${encodeURIComponent(expenseInfoForm.odometer)}&price=${encodeURIComponent(expenseInfoForm.price)}&expense_type=${encodeURIComponent(expenseInfoForm.expense_type)}&volume=${encodeURIComponent(expenseInfoForm.volume)}&ppu=${encodeURIComponent(expenseInfoForm.ppu)}&description=${encodeURIComponent(expenseInfoForm.description)}&location=${encodeURIComponent(expenseInfoForm.location)}`,
        {
          mode: "cors",
          method: "PUT",
        }
      );

      if (response.status === 200){
        alert("The expense has been edited!\nThe page will reload.");
        onClose();
        window.location.reload();
      } else {
        alert("There has been an error. Please check the values.");
        return;
      }

    } catch (error) {
      console.error(error.message);
    }
  } 

  return (
    <>
      <Button leftIcon={<FiEdit />} onClick={onOpen} variant="outline">Edit</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit the expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <FormControl isRequired>
              <FormLabel>Date</FormLabel>
              <Input
              defaultValue={expenseInfoForm.date}
              placeholder="Select Date and Time"
              size="md"
              type="date"
              onChange={dateOnChange}
              name="date"
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Odometer ({userSettings.distance_unit})</FormLabel>
              <NumberInput placeholder="Odometer" precision={0} step={1} onChange={odometerOnChange} name="odometer" defaultValue={expenseInfoForm.odometer}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Price ({userSettings.currency})</FormLabel>
              <NumberInput  placeholder="Price" precision={2} step={0.01} onChange={priceOnChange} name="price" defaultValue={expenseInfoForm.price}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input placeholder="Location" onChange={onChange} name="location" value={expenseInfoForm.location}/>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Expense Type</FormLabel>
                <Select placeholder='Expense Type' onChange={(e) => {setExpenseType(e.target.value); onChange(e)}} name="expense_type" value={expenseInfoForm.expense_type}>
                  <option>Refuelling</option>
                  <option>Servicing</option>
                  <option>Insurance</option>
                  <option>Other Expense</option>
                </Select>
            </FormControl>

            {expenseType === "Refuelling" &&(
              <>
                <FormControl mt={4}>
                  <FormLabel>Volume</FormLabel>
                  <NumberInput precision={2} step={0.01} onChange={volumeOnChange} name="volume" defaultValue={expenseInfoForm.volume}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Price Per Unit ( {userSettings.currency} / {userSettings.volume_unit} )</FormLabel>
                  <NumberInput precision={2} step={0.01} onChange={ppuOnChange} name="ppu" defaultValue={expenseInfoForm.ppu}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </>
            )}

            {(expenseType === "Servicing" || expenseType === "Insurance" || expenseType === "Other Expense") && (
              <>
                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder='Description' onChange={onChange} name="description" defaultValue={expenseInfoForm.description}/>
                </FormControl>
              </>
            )}

          </ModalBody>

          <Flex mt={5}>
              <Box ml={6}>
                <DeleteExpenseButton
                  user={user}
                  userSettings={userSettings}
                  carId={carId}
                  usersCars={usersCars}
                  modelId={modelId}
                  modelName={modelName}
                  expenseId={expenseId}                      
                />
              </Box>
              <Spacer/>
              <Box mr={6}>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button leftIcon={<FiSave/>} onClick={onClick}>Save</Button>
              </Box>
            </Flex>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

};

export default EditExpenseButton;