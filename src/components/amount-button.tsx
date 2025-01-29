import { Button } from '@chakra-ui/react';

export default function AmountButton(props: { text: string }) {
  return (
    <Button colorScheme="red" variant={'ghost'} fontSize="50px">
      {props.text}
    </Button>
  );
}
