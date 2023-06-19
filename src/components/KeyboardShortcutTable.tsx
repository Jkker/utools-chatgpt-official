import { Kbd, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

import { KEYBOARD_SHORTCUTS } from '../constants';
import { useSettings } from '../hooks/useSettings';

function camelCaseToSentence(camelCaseString = '') {
  // Split the camel case string into words
  const words = camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

  // Capitalize the first word and join the rest of the words
  const sentence = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return sentence;
}
function convertToNestedArray(object) {
  const nestedArray = [];
  const invertedObject = {};

  for (const key in object) {
    const value = object[key];
    if (!invertedObject[value]) {
      invertedObject[value] = [];
    }
    invertedObject[value].push(key);
  }

  for (const key in invertedObject) {
    nestedArray.push([key, invertedObject[key]]);
  }

  return nestedArray;
}

const CmdOrCtrl =
  'utools' in window ? (utools.isMacOS() ? '⌘' : 'Ctrl') : 'Ctrl';

const KeyboardShortcutTable = () => {
  const { T } = useSettings();

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>{T.command}</Th>
          <Th>{T.shortcut}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {convertToNestedArray(KEYBOARD_SHORTCUTS).map(([command, keys]) => (
          <Tr key={command}>
            <Td>{T[command] ?? camelCaseToSentence(command)}</Td>
            <Td display="flex" gap={2}>
              {keys.map((key) => (
                <Kbd key={key}>{key.replace('CmdOrCtrl', CmdOrCtrl)}</Kbd>
              ))}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default KeyboardShortcutTable;
