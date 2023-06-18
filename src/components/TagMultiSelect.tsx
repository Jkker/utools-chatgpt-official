import {
  Flex,
  IconButton,
  Tag
} from '@chakra-ui/react';
import React from 'react';
import { MdClear, MdSelectAll } from 'react-icons/md';

type TagColorMap = {
  [key: string]: string;
};

type TagMultiSelectProps = {
  tags: string[];
  tagColors: TagColorMap;
};

const TagMultiSelect: React.FC<TagMultiSelectProps> = ({ tags, tagColors }) => {
  const [selected, setSelected] = React.useState<{ [key: string]: boolean }>(
    Object.fromEntries(tags.map((tag) => [tag, true]))
  );
  const allSelected = Object.values(selected).every((v) => v);

  return (
    <Flex
      gap={2}
      wrap="wrap"
      justifyContent="space-between"
      alignItems="center"
    >
      {tags.map((tag) => (
        <Tag
          key={tag}
          colorScheme={tagColors[tag][0]}
          variant={selected[tag] ? 'solid' : 'outline'}
          onClick={() =>
            setSelected((prev) => ({ ...prev, [tag]: !prev[tag] }))
          }
          cursor="pointer"
          transition="all 0.1s ease-in-out"
          textTransform="capitalize"
          _hover={{
            filter: 'brightness(0.96) saturate(1.2)',
          }}
          _active={{
            filter: 'brightness(0.87) saturate(1.4)',
          }}
          bg={selected[tag] ? undefined : 'white'}
          minW={12}
          textAlign="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
          userSelect="none"
        >
          {tag}
        </Tag>
      ))}
      <>
        <IconButton
          size="xs"
          aria-label="clear"
          justifySelf="flex-end"
          onClick={() =>
            setSelected({
              ...Object.fromEntries(
                tags.map((tag) => [tag, allSelected ? false : true])
              ),
            })
          }
        >
          {allSelected ? <MdClear /> : <MdSelectAll />}
        </IconButton>
      </>
    </Flex>
  );
};

export default TagMultiSelect;
