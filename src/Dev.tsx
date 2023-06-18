import { Box, Container, Button, useToast, Input } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useState, useEffect, useRef } from 'react';

const useCustomHook = () => {
  const ref = useRef<HTMLInputElement>(null);

  const actions = useMemo(() => {
    // console.log(`🚀 ~ actions:`, ref.current);
    return {
      setPromptText: (text) => {
        ref.current.value = text;
        // if (ref.current) {
        // }
      },
      focus: () => {
        ref.current?.focus();
      },
      blur: ref.current?.blur,
    };
  }, [ref.current]);
  const toast = useToast();

  useEffect(() => {
    if (ref.current && ref.current?.textContent) {
      toast({
        title: `Value changed to ${ref.current.textContent}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right',
        variant: 'subtle',
      });
    }
    // do something
  }, [ref.current?.textContent, toast]);

  return { ref, actions };
};

function Dev() {
  const { ref, actions } = useCustomHook();
  console.log(`🚀 ~ file: Dev.tsx:43 ~ Dev ~ actions:`, actions.blur);
  const [count, setCount] = useState(0);
  useEffect(() => {
    // actions.setPromptText(count);
    actions.focus();
  }, []);

  return (
    <Container>
      <Box display={'flex'} gap={4}>
        <Button onClick={() => setCount(count + 1)} aria-label={''}>
          +
        </Button>
        <Input ref={ref} value={count} readOnly />
        <Button onClick={() => setCount(count - 1)} aria-label={''}>
          -
        </Button>
        <Button onClick={() => actions.setPromptText(5)}>Test</Button>
      </Box>
    </Container>
  );
}

export default Dev;
