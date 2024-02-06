'use client';

import NextImage from 'next/image';
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

export default function Home() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <VStack
      h={'100%'}
      w={'100%'}
      backgroundColor={'blackAlpha.200'}
      display={'flex'}
      align={'center'}
    >
      <Heading
        fontSize="50"
        color={'black'}
        textAlign={'center'}
        marginTop={'4'}
      >
        BRUS
      </Heading>
      <HStack wrap={'wrap'}>
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
        <NextImage height={200} width={200} src={'/Profile.jpg'} />
      </HStack>

      <Button
        colorScheme="red"
        variant={'ghost'}
        fontSize="50px"
        onClick={onOpen}
      >
        Wall of Shame
      </Button>

      <Card backgroundColor={'blackAlpha.300'}>
        <CardBody>
          <Button colorScheme="red" variant={'ghost'} fontSize="50px">
            X
          </Button>

          <HStack justify={'center'}>
            <Button colorScheme="red" variant={'ghost'} fontSize="50px">
              +
            </Button>
            <Heading fontSize="40px">4</Heading>
            <Button colorScheme="red" variant={'ghost'} fontSize="50px">
              -
            </Button>
          </HStack>
          <HStack>
            <VStack>
              <Heading
                marginRight="100px"
                color={'black'}
                textAlign={'right'}
                marginTop={'4'}
              >
                Ta en til bitch
              </Heading>
              <IconButton
              backgroundColor={'blackAlpha.300'}
                icon={<Image src="/dahls.png" />}
                aria-label={'Øl'}
              />
            </VStack>

            <VStack>
              <Card>
                <Heading marginLeft="100px" color={'black'} textAlign={'left'}>
                  Fyll på kassa
                </Heading>
                <IconButton
                  icon={<Image height="100px" src="/dahlsBox.jpg" />}
                  aria-label={'Øl'}
                />
              </Card>
            </VStack>
          </HStack>

          <Heading textAlign={'center'}>Saldo:</Heading>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" textColor="red" fontSize="50px">
            Wall of Shame
          </ModalHeader>
          <Card>
            <Text textAlign="center">Whats your excusee??</Text>
            <HStack justify={'center'}>
              <NextImage height={200} width={200} src={'/Profile.jpg'} />
            </HStack>
          </Card>
          <ModalCloseButton />
          <ModalBody>{/* <Lorem count={2} /> */}</ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
