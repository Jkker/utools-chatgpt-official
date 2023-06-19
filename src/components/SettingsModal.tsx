import { useCallback } from 'react';

import {
  Checkbox,
  ColorMode,
  Container,
  FormControl,
  FormHelperText,
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
  useColorMode,
} from '@chakra-ui/react';
import { MdSettings } from 'react-icons/md';

import { settingsFormData, useSettings } from '../hooks/useSettings';
import KeyboardShortcutTable from './KeyboardShortcutTable';
import SnippetManager from './SnippetManager';
const PreferencesForm = ({ actions }) => {
  const settings = useSettings();
  const { colorMode } = useColorMode();
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
          value={colorMode}
          onChange={(v) => actions.setColorMode(v as ColorMode)}
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

      {(settingsFormData as any).map(
        ({
          label,
          description,
          type,
          name,
          placeholder,
          options,
          required,
        }) => (
          <FormControl key={label}>
            <FormLabel>{label}</FormLabel>
            {type === 'radio' ? (
              <RadioGroup
                value={settings[name]}
                onChange={(v) => settings.set(name, v)}
              >
                <Stack direction="row" spacing={4}>
                  {options.map((option) => (
                    <Radio key={option.label} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            ) : type === 'checkbox' ? (
              <Checkbox
                name={name}
                defaultChecked={settings[name]}
                onChange={(e) => settings.set(name, e.target.checked)}
              >
                {label}
              </Checkbox>
            ) : (
              <Input
                type={type}
                name={name}
                placeholder={placeholder}
                required={required}
                defaultValue={settings[name]}
                onChange={(e) => settings.set(name, e.target.value)}
              />
            )}

            {description && <FormHelperText>{description}</FormHelperText>}
          </FormControl>
        )
      )}
    </Container>
  );
};

function SettingsModal({ isOpen, onClose, actions }) {
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
              <PreferencesForm actions={actions} />
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
      <SettingsModal isOpen={true} onClose={() => void {}} actions={{}} />
    </>
  );
};

export default SettingsModal;
