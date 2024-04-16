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
}) {
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
                <HStack justify={'center'}>
                  <AmountButton text={'+'}></AmountButton>
                  <Heading fontSize="40px">4</Heading>
                  <AmountButton text={'-'}></AmountButton>
                </HStack>

                <Flex>
                  <BrusButton
                    text={'Ta en til, bitch'}
                    src={'/dahls.png'}
                  ></BrusButton>
                  <Spacer />
                  <BrusButton
                    text={'Fyll på kassa'}
                    src={'/dahlsBox.jpg'}
                  ></BrusButton>
                </Flex>
                <Heading textAlign={'center'}>Saldo: {props.user.saldo}</Heading>
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
