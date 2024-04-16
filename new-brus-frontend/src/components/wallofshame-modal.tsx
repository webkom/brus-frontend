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

export default function WallOfShameModal(props: {
  text: string;
  src: string;
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
            <NextImage
              alt={props.text}
              height={200}
              width={200}
              src={props.src}
            />
          </HStack>
        </Card>
        <ModalCloseButton />
        <ModalBody>{/* <Lorem count={2} /> */}</ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
