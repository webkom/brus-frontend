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

export default function Home() {
  const wallOfShameDisclosure = useDisclosure();
  const buyBrusDisclosure = useDisclosure();

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
      <Box onClick={buyBrusDisclosure.onOpen}><NextImage alt={''} height={200} width={200} src={'/Profile.jpg'} /></Box>
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
