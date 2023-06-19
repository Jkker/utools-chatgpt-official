/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Box,
  Icon,
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemProps,
  MenuList,
  Modal,
  ModalContent,
  ModalOverlay,
  Tooltip,
} from '@chakra-ui/react';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  MdContentCopy,
  MdContentCut,
  MdContentPaste,
  MdDeveloperMode,
  MdKeyboard,
  MdLink,
  MdOpenInBrowser,
  MdRedo,
  MdRefresh,
  MdUndo,
  MdWarningAmber,
} from 'react-icons/md';

import { getTokenCount } from '../utils/tokenCount';
import { useSettings } from '../hooks/useSettings';

export interface ExtendedContextMenuParams extends Electron.ContextMenuParams {
  windowHeight?: number;
  windowWidth?: number;
}

interface ContextMenuProps {
  params: ExtendedContextMenuParams;
  isOpen?: boolean;
  onClose?: () => void;
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any) => any;
  };
}

interface ContextMenuPosition {
  left: string;
  top: string;
}

const calculateContextMenuPosition = ({
  eventX,
  eventY,
  offsetWidth,
  offsetHeight,
  windowHeight,
  windowWidth,
}): ContextMenuPosition => {
  const style = {} as ContextMenuPosition;
  if (eventX + offsetWidth > windowWidth - 10) {
    style.left = `${windowWidth - offsetWidth - 10}px`;
  } else {
    style.left = `${eventX}px`;
  }

  if (eventY + offsetHeight > windowHeight - 40) {
    style.top = `${windowHeight - offsetHeight - 40}px`;
  } else {
    style.top = `${eventY}px`;
  }
  return style;
};

const ContextMenu: FC<ContextMenuProps> = ({
  params,
  isOpen,
  onClose: onClose,
  actions,
}) => {
  const { T } = useSettings();
  const modelContentRef = useRef(null);
  params = params || ({} as ExtendedContextMenuParams);
  const hasText = params.selectionText?.length > 0;
  const isLink = Boolean(params?.linkURL);
  const showSpellingSuggestions =
    params.spellcheckEnabled && params.dictionarySuggestions?.length;
  const ContextMenuItem: FC<
    MenuItemProps & {
      label: React.ReactNode;
      icon?: React.ElementType;
    }
  > = ({ label, onClick, children, icon, ...props }) => (
    <MenuItem
      {...props}
      onClick={(e) => {
        actions.focus();
        onClick?.(e);
        // onClose?.();
      }}
      icon={icon && <Icon as={icon} />}
    >
      {label || children}
    </MenuItem>
  );
  const position = calculateContextMenuPosition({
    eventX: params.x,
    eventY: params.y,
    offsetWidth: modelContentRef.current?.offsetWidth || 200,
    offsetHeight: modelContentRef.current?.offsetHeight || 200,
    windowHeight: params.windowHeight,
    windowWidth: params.windowWidth,
  });

  const editActions = [
    params?.editFlags?.canCopy && (
      <ContextMenuItem
        label={T.copy}
        icon={MdContentCopy}
        onClick={actions.copy}
        command="Ctrl+C"
      />
    ),
    params?.editFlags?.canPaste && (
      <ContextMenuItem
        label={T.paste}
        icon={MdContentPaste}
        onClick={actions.paste}
        command="Ctrl+V"
      />
    ),
    params?.editFlags?.canCut && (
      <ContextMenuItem
        label={T.cut}
        icon={MdContentCut}
        onClick={actions.cut}
        command="Ctrl+X"
      />
    ),
    // params?.editFlags?.canSelectAll && (
    //   <ContextMenuItem
    //     label={T.selectAll}
    //     icon={MdSelectAll}
    //     onClick={actions.selectAll}
    //     command="Ctrl+A"
    //   />
    // ),
  ];

  const undoRedoActions = [
    params?.editFlags?.canUndo && (
      <ContextMenuItem
        label={T.undo}
        icon={MdUndo}
        onClick={actions.undo}
        command="Ctrl+Z"
      />
    ),
    params?.editFlags?.canRedo && (
      <ContextMenuItem
        label={T.redo}
        icon={MdRedo}
        onClick={actions.redo}
        command="Ctrl+Y"
      />
    ),
  ];

  const spellingSuggestions = useMemo(
    () =>
      showSpellingSuggestions ? (
        <MenuGroup title={T.spelling}>
          {params.dictionarySuggestions?.map((s) => (
            <ContextMenuItem
              key={s}
              label={s}
              onClick={() => actions.replaceMisspelling(s)}
            />
          ))}
        </MenuGroup>
      ) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.dictionarySuggestions, showSpellingSuggestions]
  );
  const linkActions = [
    <ContextMenuItem
      label={T.openInBrowser}
      icon={MdOpenInBrowser}
      onClick={() => utools.shellOpenExternal(params.linkURL)}
    />,
    <ContextMenuItem
      label={T.copyLinkAddress}
      icon={MdLink}
      onClick={() => utools.copyText(params.linkURL)}
    />,
    <MenuDivider />,
  ];
  if (editActions.filter(Boolean).length) editActions.push(<MenuDivider />);
  if (undoRedoActions.filter(Boolean).length)
    undoRedoActions.push(<MenuDivider />);

  const [tokenCount, setTokenCount] = useState(0);

  useEffect(() => {
    if (isOpen && params.selectionText) {
      setTokenCount(getTokenCount(params.selectionText));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, params.selectionText]);

  const tokenLimit = actions.getTokenLimit();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bgColor="transparent" />
      <ModalContent
        position="absolute"
        {...position}
        m={0}
        p={0}
        width="fit-content"
        height="fit-content"
        ref={modelContentRef}
      >
        <Menu isOpen={isOpen} onClose={onClose}>
          <MenuList>
            {isLink && linkActions}
            {spellingSuggestions}
            {editActions}
            {undoRedoActions}
            {hasText && (
              <>
                <ContextMenuItem
                  label={
                    <>
                      <Box>{T.tokens + ': ' + tokenCount}</Box>
                      {tokenCount >= tokenLimit && (
                        <Tooltip label={T.exceedingTokenLimit + tokenLimit}>
                          <Icon as={MdWarningAmber} color="red.500" />
                        </Tooltip>
                      )}
                    </>
                  }
                  icon={MdKeyboard}
                  onClick={() => {
                    utools.copyText(tokenCount.toString());
                  }}
                />
                <MenuDivider />
              </>
            )}
            <ContextMenuItem
              label={T.reload}
              icon={MdRefresh}
              onClick={actions.reload}
              command="Ctrl+R"
            />
            {/* <ContextMenuItem
              label={T.settings}
              icon={MdSettings}
              onClick={() => {
                utools.showNotification('open settings');
              }}
            /> */}
            <ContextMenuItem
              label={T.openDevTools}
              icon={MdDeveloperMode}
              onClick={actions.openDevTools}
            />
          </MenuList>
        </Menu>
      </ModalContent>
    </Modal>
  );
};

export default ContextMenu;
