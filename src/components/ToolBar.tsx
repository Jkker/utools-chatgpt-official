import {
  Box,
  Flex,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '@chakra-ui/react';
import { FC } from 'react';
import {
  MdDarkMode,
  MdDeveloperMode,
  MdEdit,
  MdLightMode,
  MdRefresh,
  MdSettings,
} from 'react-icons/md';

import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';
import { useSettings } from '../hooks/useSettings';

const Button = ({
  label,
  children,
  shortcut = '',
  ...props
}: Omit<IconButtonProps, 'aria-label'> & {
  label?: string;
  shortcut?: string;
}) => (
  <Tooltip
    hasArrow
    label={
      <Box>{(label || children) + (shortcut ? ` (⌘ ${shortcut})` : '')}</Box>
    }
  >
    <IconButton
      aria-label={label}
      // colorScheme="whiteAlpha"
      {...props}
      // bg="whiteAlpha.800"
      _dark={{
        bg: 'whiteAlpha.300',
      }}
      backdropFilter="blur(4px)"
      shadow="md"
      rounded="lg"
    >
      {label || children}
    </IconButton>
  </Tooltip>
);

const isDev = utools.isDev();

const ToolBar: FC<{
  actions: {
    [key: string]: (...args: any) => void;
  };
  isPinned: boolean;
  children?: React.ReactNode;
  openSettings: () => void;
  openEditor: () => void;
}> = ({ actions, isPinned, children, openSettings, openEditor }) => {
  const { T, resolvedColorMode, toggleColorMode } = useSettings();

  return (
    <Flex
      position="absolute"
      top={{
        base: '50%',
        lg: 2,
      }}
      right={{
        base: 2,
        lg: 3,
      }}
      wrap="nowrap"
      gap={2}
      zIndex={10}
      flexDir={{
        base: 'column',
        lg: 'row',
      }}
      transform={{
        base: 'translateY(-50%)',
        lg: 'none',
      }}
    >
      {children}
      <Button
        icon={resolvedColorMode === 'light' ? <MdDarkMode /> : <MdLightMode />}
        onClick={toggleColorMode}
        label={resolvedColorMode === 'light' ? T.dark : T.light}
        shortcut="L"
      />
      <Button
        icon={isPinned ? <BsPinAngleFill /> : <BsPinAngle />}
        onClick={actions.togglePin}
        label={isPinned ? T.unpin : T.pin}
        shortcut="T"
      />
      <Button
        icon={<MdRefresh />}
        onClick={actions.reload}
        label={T.reload}
        shortcut="R"
      />
      {isDev && (
        <Button
          icon={<MdDeveloperMode />}
          onClick={actions.toggleWindowDevTools}
          label={T.openDevTools}
        />
      )}
      <Button
        icon={<MdEdit />}
        onClick={openEditor}
        label={T.openEditor}
        shortcut="E"
      />
      <Button
        icon={<MdSettings />}
        onClick={openSettings}
        label={T.settings}
        shortcut="P"
      />
    </Flex>
  );
};

export default ToolBar;
