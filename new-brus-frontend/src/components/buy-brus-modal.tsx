import {
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import NextImage from 'next/image';
import AmountButton from './amount-button';
import BrusButton from './brus-button';
import { User } from '@/app/page';

export default function BuyBrusModal(props: {
  text: string;
  src: string;
  disclosure: any;
  user: User;
  fetchUsers: () => void;
}) {
  const buyBrus = async (amount: number) => {
    const requestBody = {
      username: props.user.name,
      amount,
    };

    const response = await fetch('http://localhost:3000/api/buybrus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    props.fetchUsers();
  };

  return (
    <Modal isOpen={props.disclosure.isOpen} onClose={props.disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" textColor="red" fontSize="50px">
          Buy Brus
        </ModalHeader>
        <Card>
          <HStack justify={'center'}>
            <Card>
              <CardBody>
                <Flex>
                  <BrusButton
                    onClick={() => buyBrus(1)}
                    text={'Ta en til, bitch'}
                    src={'/dahls.png'}
                  ></BrusButton>
                  <Spacer />
                  <BrusButton
                    onClick={() => buyBrus(-1)}
                    text={'Fyll på kassa'}
                    src={'/dahlsBox.jpg'}
                  ></BrusButton>
                </Flex>
                <Heading textAlign={'center'}>
                  Saldo: {props.user.saldo}
                </Heading>
              </CardBody>
            </Card>
          </HStack>
        </Card>
        <ModalCloseButton />
        <ModalBody>{/* <Lorem count={2} /> */}</ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
