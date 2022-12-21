import React from "react";
import { useState } from "react";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Select,
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

import { FiPlus, FiSave } from 'react-icons/fi'

//Contains everything related to the design and functionality of the add expense use case.
//Based on the Chakra UI documentation available at https://chakra-ui.com/getting-started

const AddExpenseButton = (props) => {
  const {
    user,
    userSettings,
    carId,
    usersCars,
    modelId,
    modelName
  } = props;

  //A helper function to get today's date in 'yyyy-mm-dd' format that is used in the date picker
  function today() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [expenseType, setExpenseType] = useState("");
  
  //Initial values for the form
  const [expenseInfoForm, setExpenseInfoForm] = React.useState({
    date: today(),
    odometer: 0,
    price: 0,
    location: "",
    expense_type: "",
    volume: 0,
    ppu: 0,
    description: ""
  })

  //onChange functions for each value in expenseInfoForm
  const onChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      [event.target.name]: event.target.value,
      ['expense_id']: expenseInfoForm.expense_type + '_' + carId + '_' + expenseInfoForm.odometer.toString(),
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
      ['expense_id']: expenseInfoForm.expense_type + '_' + carId + '_' + expenseInfoForm.odometer.toString(),
      ['date']: new_date,
      ['car_id']: carId,
      ['model_id']: modelId
    });
  } 

  const odometerOnChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      ['expense_id']: expenseInfoForm.expense_type + '_' + carId + '_' + expenseInfoForm.odometer.toString(),
      ['odometer']: event,
      ['car_id']: carId,
      ['model_id']: modelId
    });
  } 

  const priceOnChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      ['expense_id']: expenseInfoForm.expense_type + '_' + carId + '_' + expenseInfoForm.odometer.toString(),
      ['price']: event,
      ['car_id']: carId,
      ['model_id']: modelId
    });
  } 

  const volumeOnChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      ['expense_id']: expenseInfoForm.expense_type + '_' + carId + '_' + expenseInfoForm.odometer.toString(),
      ['volume']: event,
      ['car_id']: carId,
      ['model_id']: modelId
    });
  } 

  const ppuOnChange = (event) => {
    setExpenseInfoForm({
      ...expenseInfoForm,
      ['expense_id']: expenseInfoForm.expense_type + '_' + carId + '_' + expenseInfoForm.odometer.toString(),
      ['ppu']: event,
      ['car_id']: carId,
      ['model_id']: modelId
    });
  } 

  const onClick = async () => {
    //Check the given values
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
    //POST the expense to the backend. URL encoding is used to ensure values are received correctly.
    try {
      const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/expense?expense_id=${encodeURIComponent(expenseInfoForm.expense_id)}&car_id=${encodeURIComponent(expenseInfoForm.car_id)}&model_id=${encodeURIComponent(modelId)}&date=${encodeURIComponent(expenseInfoForm.date)}&odometer=${encodeURIComponent(expenseInfoForm.odometer)}&price=${encodeURIComponent(expenseInfoForm.price)}&expense_type=${encodeURIComponent(expenseInfoForm.expense_type)}&volume=${encodeURIComponent(expenseInfoForm.volume)}&ppu=${encodeURIComponent(expenseInfoForm.ppu)}&description=${encodeURIComponent(expenseInfoForm.description)}&location=${encodeURIComponent(expenseInfoForm.location)}`,
        {
          mode: "cors",
          method: "POST",
        }
      );

      if (response.status === 200){
        alert("The expense has been added successfully!\nThe page will reload.");
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
      <Button leftIcon={<FiPlus />} onClick={onOpen} mt={2} mb={3}>Add expense</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add an expense</ModalHeader>
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
              <Input placeholder="Location" onChange={onChange} name="location" defaultValue={expenseInfoForm.location}/>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Expense Type</FormLabel>
                <Select placeholder='Expense Type' onChange={(e) => {setExpenseType(e.target.value); onChange(e)}} name="expense_type" defaultValue={expenseInfoForm.expense_type}>
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

          <ModalFooter>

              <Box mr={6}>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button leftIcon={<FiSave/>} onClick={onClick}>Save</Button>
              </Box>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

};

export default AddExpenseButton;