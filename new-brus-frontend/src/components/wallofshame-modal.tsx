import {
  Card,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import NextImage from 'next/image';
import UserPicture from './userpicture';
import { User } from '@/app/page';

export default function WallOfShameModal(props: {
  users: User[];
  disclosure: any;
}) {
  return (
    <Modal isOpen={props.disclosure.isOpen} onClose={props.disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" textColor="red" fontSize="50px">
          Wall of Shame
        </ModalHeader>
        <Card>
          <Text textAlign="center">Whats your excusee??</Text>
          <HStack justify={'center'}>
            {props.users
              .filter((user) => user.saldo < 0)
              .map((user) => (
                <UserPicture key={user.name} user={user}></UserPicture>
              ))}
          </HStack>
        </Card>
        <ModalCloseButton />
        <ModalBody>{/* <Lorem count={2} /> */}</ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
