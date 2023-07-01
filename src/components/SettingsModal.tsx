import {
  ColorModeWithSystem,
  Container,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { MdSettings } from 'react-icons/md';
import { CHAT_GPT_URL } from '../constants';
import { useSettings } from '../hooks/useSettings';
import KeyboardShortcutTable from './KeyboardShortcutTable';
import SnippetManager from './SnippetManager';

const PreferencesForm = () => {
  const settings = useSettings();
  const { T, language } = settings;

  return (
    <Container
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxW="container.sm"
      gap={4}
    >
      <FormControl>
        <FormLabel>{T.theme}</FormLabel>
        <RadioGroup
          value={settings.colorMode}
          onChange={(v) => settings.setColorMode(v as ColorModeWithSystem)}
        >
          <Stack direction="row" spacing={4}>
            <Radio value="light">{T.light}</Radio>
            <Radio value="dark">{T.dark}</Radio>
            <Radio value="system">{T.system}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel>{T.language}</FormLabel>
        <RadioGroup
          value={language}
          onChange={(v) => settings.setLanguage(v as typeof language)}
        >
          <Stack direction="row" spacing={4}>
            <Radio value="zh">{T.chinese}</Radio>
            <Radio value="en">{T.english}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel>{T.chatgptURL}</FormLabel>
        <Input
          type="url"
          name="chatgptURL"
          placeholder={CHAT_GPT_URL}
          required={true}
          defaultValue={settings.chatgptURL}
          onBlur={(e) => settings.setChatgptURL(e.target.value)}
          // value={settings.chatgptURL}
          // onChange={(e) => settings.setChatgptURL(e.target.value)}
        />
      </FormControl>
    </Container>
  );
};

function SettingsModal({ isOpen, onClose }) {
  const { save: saveSettings, T } = useSettings();
  const handleClose = useCallback(() => {
    saveSettings();
    onClose();
  }, [onClose, saveSettings]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent
        m={0}
        containerProps={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        bg="gray.50"
        _dark={{
          bg: 'gray.800',
        }}
      >
        <ModalHeader
          display="flex"
          gap={2}
          alignItems="center"
          justifyContent="left"
        >
          <MdSettings />
          {T.settings}
        </ModalHeader>
        <ModalCloseButton />
        <Tabs autoFocus>
          <TabList>
            <Tab>{T.preferences}</Tab>
            <Tab>{T.snippets}</Tab>
            <Tab>{T.shortcuts}</Tab>
          </TabList>
          <TabPanels h="70vh" overflow="auto">
            <TabPanel>
              <PreferencesForm />
            </TabPanel>
            <TabPanel>
              <SnippetManager />
            </TabPanel>
            <TabPanel>
              <KeyboardShortcutTable />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  );
}

export const DevSettingsModal = () => {
  return (
    <>
      <SettingsModal isOpen={true} onClose={() => void {}} />
    </>
  );
};

export default SettingsModal;
