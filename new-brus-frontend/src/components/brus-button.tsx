import { Box, Heading } from '@chakra-ui/react';
import NextImage from 'next/image';

export default function BrusButton(props: { text: string; src: string }) {
  return (
    <Box as="button">
      <Heading color={'black'}>{props.text}</Heading>
      <NextImage alt={props.text} height={100} width={100} src={props.src} />
    </Box>
  );
}
