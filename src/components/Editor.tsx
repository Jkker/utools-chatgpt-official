import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import type { Completion, CompletionSource } from '@codemirror/autocomplete';
import { autocompletion, snippet } from '@codemirror/autocomplete';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { githubLightInit } from '@uiw/codemirror-theme-github';
import { okaidiaInit } from '@uiw/codemirror-theme-okaidia';
import CodeMirror from '@uiw/react-codemirror';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import { useSettings } from '../hooks/useSettings';
import useSnippet from '../hooks/useSnippet';
import { getTokenCount } from '../utils/tokenCount';

export function PromptEditor({
  activateOnTyping = true,
  isOpen,
  onClose,
  finalFocusRef = undefined,
  actions,
}) {
  const { T } = useSettings();

  const [value, setValue] = React.useState('');
  const [tokenCount, setTokenCount] = React.useState(0);
  const [tokenLimit, setTokenLimit] = React.useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetTokenCount = useCallback(
    debounce((text) => {
      setTokenCount(getTokenCount(text));
    }, 250),
    []
  );

  const onChange = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (text, viewUpdate: ViewUpdate) => {
      setValue(text);
      debouncedSetTokenCount(text);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const snippetStore = useSnippet();
  const theme = useColorModeValue(
    githubLightInit({
      settings: {
        fontFamily: 'var(--chakra-fonts-mono)',
        // background: 'transparent',
        background: '#fcfcfa',
        gutterBackground: 'transparent',
      },
    }),
    okaidiaInit({
      settings: {
        fontFamily: 'var(--chakra-fonts-mono)',
        background: '#444654',
        foreground: '#fcfcfa',
        gutterBackground: '#444654',
        selection: 'hsla(0,0%,100%,0.3)',
        selectionMatch: 'hsla(0,0%,100%,0.3)',
        lineHighlight: 'hsla(0,0%,100%,0.2)',
      },
    })
  );

  const snippetSource: CompletionSource = useCallback(
    (context) => {
      // no word before the cursor, don't open completions.
      const matchBefore = context.matchBefore(/\w+/);
      if (!context.explicit && !(activateOnTyping && matchBefore)) return null;
      const options: Completion[] = snippetStore.snippets.map(
        ({ label, content, description }) =>
          ({
            label: label ?? content,
            info: content,
            detail: description ?? '',
            type: 'snippet',
            apply: snippet(content),
          } as Completion)
      );
      return {
        from: matchBefore ? matchBefore.from : context.pos,
        options,
        validFor: /^\w*$/,
      };
    },
    [activateOnTyping, snippetStore.snippets]
  );

  useEffect(() => {
    if (isOpen) {
      actions.getPromptText().then((text) => setValue(text ?? ''));
      setTokenLimit(actions.getTokenLimit());
      if (snippetStore.snippets.length === 0) snippetStore.load();
    } else if (value) {
      actions.setPromptText(value.trim());
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        finalFocusRef={finalFocusRef}
      >
        <DrawerOverlay
          // backdropFilter="blur(4px)"
          background="blackAlpha.700"
          cursor="pointer"
        />
        <DrawerContent
          bg="gray.100"
          _dark={{
            bg: 'gray.800',
          }}
          pt={4}
          sx={{
            '.cm-editor.cm-focused': {
              outline: 'none !important',
            },
            '.cm-editor': {
              fontSize: '1rem !important',
            },
            '.cm-tooltip *': {
              fontFamily: 'Lexend, sans-serif !important',
            },
          }}
          position="relative"
          containerProps={{
            position: 'fixed',
            paddingTop: '32px',
            height: '100vh',
          }}
        >
          <DrawerHeader
            pt={0}
            pb={2}
            shadow="md"
            zIndex={1}
            display="flex"
            gap={2}
            alignItems="center"
          >
            <MdEdit />
            {T.editPrompt}
          </DrawerHeader>
          <Tooltip label={<>{T.closeEditor} (Esc)</>}>
            <DrawerCloseButton size="lg" zIndex={10} />
          </Tooltip>

          <CodeMirror
            value={value}
            height="90vh"
            theme={theme}
            autoFocus
            style={{ outline: 'none', paddingBottom: '32px' }}
            extensions={[
              EditorView.lineWrapping,
              markdown({ codeLanguages: languages }),
              autocompletion({
                activateOnTyping,
                override: [snippetSource],
              }),
            ]}
            onChange={onChange}
          />
          <Flex
            opacity={0.75}
            fontSize="sm"
            justifyContent="center"
            // w="full"
            pb={1}
            position="fixed"
            bottom={0}
            right="50%"
            transform="translateX(50%)"
          >
            Tokens: {tokenCount} / {tokenLimit}
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  );
}
