import React from "react";
import { useState } from "react";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Center,
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
  IconButton,
  Radio, 
  RadioGroup,
  Stack,
} from '@chakra-ui/react'

import { FaUser } from 'react-icons/fa'
import { FiLogOut, FiSettings } from 'react-icons/fi'

import Logo from "./logo";

//The panel for the unit settings
//Also contains the logout functionality

const Settings = (props) => {
  const {
    user,
    userSettings,
    logout
  } = props;

  //Get the values to give the initial state
  const [formSettings, setFormSettings] = useState({
    user_id: user.user_id,
    distance_unit: userSettings.distance_unit,
    volume_unit: userSettings.volume_unit,
    fuel_efficiency_unit: userSettings.fuel_efficiency_unit,
    currency: userSettings.currency
  })

  //Each unit's design and functionality depending on the onChange
  function DistanceUnitRadio() {
    const handleChange = (event) => {
      setFormSettings({
        ...formSettings,
        ['distance_unit']: event
      });
    };

    return (
      <RadioGroup defaultValue={formSettings.distance_unit} onChange={handleChange}>
        <Stack direction='row'>
          <Radio value='km' defaultChecked>Kilometre</Radio>
          <Radio value='mi'>Mile</Radio>
        </Stack>
      </RadioGroup>
    )
  }

  function VolumeUnitRadio() {
    const handleChange = (event) => {
      setFormSettings({
        ...formSettings,
        ['volume_unit']: event
      });
    };

    return (
      <RadioGroup defaultValue={formSettings.volume_unit} onChange={handleChange}>
        <Stack direction='row'>
          <Radio value='litre' defaultChecked>Litre</Radio>
          <Radio value='gallon_uk'>Imperial Gallon</Radio>
          <Radio value='gallon_us'>US Gallon</Radio>
        </Stack>
      </RadioGroup>
    )
  }

  function FuelEfficiencyUnitRadio() {
    const handleChange = (event) => {
      setFormSettings({
        ...formSettings,
        ['fuel_efficiency_unit']: event
      });
    };

    return (
      <RadioGroup defaultValue={formSettings.fuel_efficiency_unit} onChange={handleChange}>
        <Stack spacing={1} direction='column'>
          <Radio value='l/100' defaultChecked>Litre/100km</Radio>
          <Radio value='km/l'>km/Litre</Radio>
          <Radio value='mpg_uk'>Mile/Imperail Gallon (MPG UK)</Radio>
          <Radio value='mpg_us'>Mile/US Gallon (MPG US)</Radio>
        </Stack>
      </RadioGroup>
    )
  }
  


  
  //POST the new settings to the backend using URL encoding
  const handleClick = async () => {
    try {
      const response = await fetch(
      `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/user?user_id=${encodeURIComponent(user.user_id)}&distance_unit=${encodeURIComponent(formSettings.distance_unit)}&volume_unit=${encodeURIComponent(formSettings.volume_unit)}&fuel_efficiency_unit=${encodeURIComponent(formSettings.fuel_efficiency_unit)}&currency=${encodeURIComponent(formSettings.currency)}`,
      {
        mode: "cors",
        method: "POST",
      }
      );

      if (response.status === 200){
        alert("The settings have been updated successfully!\nThe page will reload.");
        onClose();
        window.location.reload();
      } else {
        alert("There has been an error. Please check the values.");
        return;
      }

    } catch(error) {
      console.error(error.name, error.message);
    }
  };
  
  const { isOpen, onOpen, onClose } = useDisclosure()

  //Update the form on every change
  const handleChange = (event) => {
    const value = event.target.value;
    setFormSettings({
      ...formSettings,
      [event.target.name]: value
    });
  };

  return (
    <Box textAlign="right" backgroundColor="telegram.500" height={70} maxHeight={80}>
      <Center>
        <Flex w="95%">
          <Box mt={1}>
            <Logo/>
          </Box>
          <Spacer/>
          <Box>
            <Menu >
              <MenuButton
                as={IconButton}
                aria-label='Log Out'
                fontSize='20px'
                size="lg"
                icon={<FaUser />}
                mt={2.5}
                />
              <MenuList>
                <MenuItem icon={<FiSettings />} onClick={() => {setFormSettings(formSettings); onOpen()}}>
                  Settings
                </MenuItem>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Unit settings</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <FormControl>
                          <FormLabel defaultValue={formSettings.distance_unit}>Unit of distance</FormLabel>
                          <DistanceUnitRadio />
                          <FormLabel defaultValue={formSettings.volume_unit} mt={4}>Unit of volume</FormLabel>
                          <VolumeUnitRadio />
                          <FormLabel defaultValue={formSettings.fuel_efficiency_unit} mt={4}>Unit of fuel efficiency</FormLabel>
                          <FuelEfficiencyUnitRadio />
                          <FormLabel mt={4}>Currency</FormLabel>
                          <Input placeholder='Currency' name='currency'onChange={handleChange} value={formSettings.currency}/>
                        </FormControl>
                      </ModalBody>
                      <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                          Close
                        </Button>
                        <Button variant='ghost' onClick={handleClick}>Save</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                <MenuDivider />

                <MenuItem icon={<FiLogOut />} onClick={() => logout({ returnTo: window.location.origin})}>
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>

        </Flex>

      </Center>
    </Box>
  );

};

export default Settings;