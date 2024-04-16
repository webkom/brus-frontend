'use client';

import NextImage from 'next/image';
import {
  Box,
  Button,
  HStack,
  Heading,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import WallOfShameModal from '@/components/wallofshame-modal';
import BuyBrusModal from '@/components/buy-brus-modal';
import { useEffect, useState } from 'react';
type User = {
  name: string;
  saldo: number;
};

export default function Home() {
  const wallOfShameDisclosure = useDisclosure();
  const buyBrusDisclosure = useDisclosure();

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        {users.map((user) => (
          <Box key={user.name} onClick={buyBrusDisclosure.onOpen}>
            {user.name}
          </Box>
        ))}
      </HStack>

      <Button
        colorScheme="red"
        variant={'ghost'}
        fontSize="50px"
        onClick={wallOfShameDisclosure.onOpen}
      >
        Wall of Shame
      </Button>

      <BuyBrusModal
        disclosure={buyBrusDisclosure}
        text={'kuult'}
        src={'/dahls.png'}
      ></BuyBrusModal>
      <WallOfShameModal
        disclosure={wallOfShameDisclosure}
        text={'kult'}
        src="/Profile.jpg"
      ></WallOfShameModal>
    </VStack>
  );
}
