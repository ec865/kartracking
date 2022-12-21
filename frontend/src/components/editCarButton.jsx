import React from "react";
import { useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
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
  Radio, 
  RadioGroup,
  Stack,
} from '@chakra-ui/react'

import { FiEdit, FiSave } from 'react-icons/fi'

//Contains everything related to the design and functionality of the edit car use case.
//Based on the Chakra UI documentation available at https://chakra-ui.com/getting-started

const EditCarButton = (props) => {
  const {
    user,
    userSettings,
    usersCars,
    models,
    carId
  } = props;


  const { isOpen, onOpen, onClose } = useDisclosure()
  const [carInfoForm, setCarInfoForm] = React.useState({
    car_id: carId,
    user_id: user.user_id,
    make: "",
    model: "",
    model_year: 0,
    engine_size: 0.0,
    fuel_type: "Diesel",
    initial_odometer: 0,
    fuel_capacity: 0
  })

  //Set carInfoForm after each change
  const handleChange = (event) => {
    //Form the model_id by combining different parameters
    const model_id = carInfoForm.make + '_' + carInfoForm.model + '_' + carInfoForm.engine_size;
    try{
      const value = event.target.value;
      if (!isNaN(+value)){ //Check if the given value is a number
        setCarInfoForm({
          ...carInfoForm,
          [event.target.name]: Number(value),
          ['model_id']: model_id
        });
      } else {
        setCarInfoForm({
          ...carInfoForm,
          [event.target.name]: value,
          ['model_id']: model_id
        });
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        const fuel_type = event;
        setCarInfoForm({
          ...carInfoForm,
          ['fuel_type']: fuel_type,
          ['model_id']: model_id
        });
      } else {
        throw error;
      }
    }
  };
  
  const handleClick = async () => {
    //Check the given values
    if (carInfoForm.make === "" || carInfoForm.model === "" || carInfoForm.fuel_type === "") {
      alert("Please fill all the fields!");
      return;
    }
    let thisYear = new Date().getFullYear();
    if (carInfoForm.model_year < 1900 || carInfoForm.model_year > (thisYear + 2)) {
      alert("Please enter a valid model year!");
      return;
    }
    if (carInfoForm.engine_size <= 0.0 || carInfoForm.engine_size > 20.0) {
      alert("Please enter a valid engine size!");
      return;
    }
    if (carInfoForm.fuel_capacity <= 0 || carInfoForm.fuel_capacity > 10000) {
      alert("Please enter a valid fuel tank capacity!");
      return;
    }
    if (carInfoForm.initial_odometer <= 0) {
      alert("Please enter a valid current mileage!");
      return;
    }
    //PUT the edited car to the backend. URL encoding is used to ensure values are received correctly.
    try {
      const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/car?car_id=${encodeURIComponent(carId)}&engine_size=${encodeURIComponent(carInfoForm.engine_size)}&fuel_capacity=${encodeURIComponent(carInfoForm.fuel_capacity)}&fuel_type=${encodeURIComponent(carInfoForm.fuel_type)}&initial_odometer=${encodeURIComponent(carInfoForm.initial_odometer)}&make=${encodeURIComponent(carInfoForm.make)}&model=${encodeURIComponent(carInfoForm.model)}&model_id=${encodeURIComponent(carInfoForm.model_id)}&model_year=${encodeURIComponent(carInfoForm.model_year)}&user_id=${encodeURIComponent(user.user_id)}`,
        {
          mode: "cors",
          method: "PUT",
        }
      );

      if (response.status === 200){
        alert("The car has been edited successfully!\nThe page will reload.");
        onClose();
        window.location.reload();
      } else {
        alert("There has been an error. Please check the values.");
        return;
      }

    } catch (error) {
      console.error(error.message);
    }

  };
  //Get the car's details to be used to populate the form    
  useEffect(() => {
  const getCarDetails = async () => {
    try {
        const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/car?car_id=${encodeURIComponent(carId)}`,
        {
            mode: "cors",
            method: "GET",
        }
        );

        if (response.status !== 200){
        alert("There has been an error.");
        return;
        }
        const data = await response.json();
        setCarInfoForm({
            ['make']: data.make,
            ['model']: data.model,
            ['model_year']: data.model_year,
            ['engine_size']: data.engine_size,
            ['fuel_type']: data.fuel_type,
            ['initial_odometer']: data.initial_odometer,
            ['fuel_capacity']: data.fuel_capacity
        });

    } catch (error) {
        console.error(error.message);
    }
  }

    getCarDetails();
  }, [carId]);

  return (
    <>
      <Button leftIcon={<FiEdit />} onClick={onOpen}>Edit the vehicle</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit the vehicle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            <FormControl isRequired>
              <FormLabel>Make</FormLabel>
              <Input isRequired placeholder='Make' onChange={handleChange} name="make" value={carInfoForm.make}/>

              <FormLabel mt={4}>Model</FormLabel>
              <Input isRequired placeholder='Model' onChange={handleChange} name="model" value={carInfoForm.model}/>

              <FormLabel mt={4}>Model Year</FormLabel>
              <NumberInput defaultValue={carInfoForm.model_year} isRequired precision={0} errorBorderColor = "red.500" keepWithinRange={false} clampValueOnBlur={false} min={1900} max={2025}>
                <NumberInputField placeholder='Model Year' onChange={handleChange} id="model_year" name="model_year" value={carInfoForm.model_year}/>
              </NumberInput>

              <FormLabel mt={4}>Engine Size (Litre)</FormLabel>
              <NumberInput defaultValue={carInfoForm.engine_size} isRequired precision={1} step={0.1}>
                <NumberInputField placeholder='Engine Size (e.g., 1.4, 1.6, 2.0)' onChange={handleChange} name="engine_size" value={carInfoForm.engine_size}/>
              </NumberInput>

              <FormLabel mt={4}>Fuel Type</FormLabel>
              <RadioGroup defaultValue={carInfoForm.fuel_type} onChange={handleChange} name="fuel_type" >
                <Stack spacing={5} direction='row'>
                  <Radio value="Petrol">Petrol</Radio>
                  <Radio value="Diesel">Diesel</Radio>
                </Stack>
              </RadioGroup>

              <FormLabel mt={4}>Fuel Tank Capacity ({userSettings.volume_unit})</FormLabel>
              <NumberInput defaultValue={carInfoForm.fuel_capacity} isRequired precision={0}>
                <NumberInputField placeholder='Fuel Tank Capacity' onChange={handleChange} name="fuel_capacity" value={carInfoForm.fuel_capacity}/>
              </NumberInput>

              <FormLabel mt={4}>Current Mileage ({userSettings.distance_unit})</FormLabel>
              <NumberInput defaultValue={carInfoForm.initial_odometer} isRequired precision={0}>
                <NumberInputField placeholder='Current Mileage' onChange={handleChange} name="initial_odometer" value={carInfoForm.initial_odometer}/>
              </NumberInput>

            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button leftIcon={<FiSave/>} onClick={handleClick}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

};

export default EditCarButton;