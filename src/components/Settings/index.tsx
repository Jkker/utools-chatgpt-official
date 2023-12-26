import { useSettings } from '@/hooks/useSettings';
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { MdSettings } from 'react-icons/md';
import { KeyboardShortcutTable } from './KeyboardShortcutTable';
import { PreferencesForm } from './PreferencesForm';
import { SnippetManager } from './SnippetManager';

export function SettingsModal({ isOpen, onClose, actions }) {
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
            <Tab>{T.internet}</Tab>
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
