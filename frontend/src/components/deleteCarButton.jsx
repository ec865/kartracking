import React from "react";
import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'

import { RiDeleteBinLine } from 'react-icons/ri'

//Contains everything related to the design and functionality of the delete car use case.
//Based on the Chakra UI documentation available at https://chakra-ui.com/getting-started

const DeleteCarButton = (props) => {
  const {
    user,
    userSettings,
    usersCars,
    models,
    carId
  } = props;


  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const handleClick = async () => {
    //DELETE request to the backend with carId with URL encoding
    try {
      const response = await fetch(
        `https://x44s23vcyg.execute-api.eu-west-2.amazonaws.com/prod/car?car_id=${encodeURIComponent(carId)}`,
        {
          mode: "cors",
          method: "DELETE",
        }
      );

      if (response.status === 200){
        alert("The car has been deleted successfully!\nThe page will reload.");
        onClose();
        window.location.reload();
      } else {
        alert("There has been an error.");
        return;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Button leftIcon={<RiDeleteBinLine />} backgroundColor="red.500" ml={5} onClick={onOpen}>
      Delete the vehicle
      </Button>

      <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete the vehicle
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>

              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button backgroundColor="red.500" onClick={handleClick} ml={3}>
                Delete
              </Button>

            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )

};

export default DeleteCarButton;