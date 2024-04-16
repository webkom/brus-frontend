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
import UserPicture from '@/components/userpicture';
export type User = {
  name: string;
  saldo: number;
  picture: string;
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

  const [selectedUser, setSelectedUser] = useState<User>();
  const handleClick = (user: User) => {
    setSelectedUser(user);
    buyBrusDisclosure.onOpen();
  };

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
          <Box key={user.name} onClick={() => handleClick(user)}>
            <UserPicture user={user}></UserPicture>
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

      {selectedUser && (
        <BuyBrusModal
          disclosure={buyBrusDisclosure}
          text={'kuult'}
          src={'/dahls.png'}
          user={selectedUser}
        ></BuyBrusModal>
      )}
      <WallOfShameModal
        disclosure={wallOfShameDisclosure}
        users={users}
      ></WallOfShameModal>
    </VStack>
  );
}
