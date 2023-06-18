import { useCallback, useEffect, useMemo, useState } from 'react';
import data from '../assets/prompt.json';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Colors,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Tag,
  Text,
  Textarea,
  Theme,
  ThemeTypings,
  Tooltip,
  useDisclosure,
  useTheme,
} from '@chakra-ui/react';
import { CreatableSelect, Select } from 'chakra-react-select';
import debounce from 'lodash.debounce';
import { MdAdd, MdClear, MdOpenInNew } from 'react-icons/md';
import { T } from '../assets/i18n';
import { PALETTE_COLORS } from '../constants';
import useSnippet from '../hooks/useSnippet';

type ColorEntry = [ThemeTypings['colorSchemes'], Colors[keyof Colors]];
type ColorMap = Record<string, ColorEntry>;

interface Prompt {
  title: string;
  description: string;
  desc_cn: string;
  remark: string;
  title_en: string;
  desc_en: string;
  remark_en: string;
  preview?: string;
  website: string;
  source?: string;
  tags: string[];
  id: number;
  weight: number;
}

interface PromptCardProps {
  prompt: Prompt;
  en?: boolean;
  tagColors: ColorMap;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  en = true,
  tagColors,
}) => {
  const remark = en ? prompt.remark_en : prompt.remark;
  const title = en ? prompt.title_en : prompt.title;
  const description = en ? prompt.desc_en : prompt.desc_cn;

  return (
    <Card shadow="lg" size="sm">
      <CardHeader>
        <Flex direction="column" gap={2}>
          <Heading size="lg">{title}</Heading>
          <Tooltip
            label={remark}
            placement="top-start"
            hasArrow
            display={{ base: 'none' }}
            rounded="md"
            shadow="lg"
          >
            <Text noOfLines={3}>{remark}</Text>
          </Tooltip>
        </Flex>
      </CardHeader>
      <CardBody>
        <Textarea
          sx={{
            '&::-webkit-scrollbar': {
              width: 2,
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'blackAlpha.600',
              borderRadius: 'full',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
              borderRadius: 'full',
            },
          }}
          _dark={{
            '&::-webkit-scrollbar-thumb': {
              background: 'whiteAlpha.600',
            },
          }}
          // variant={'filled'}
          value={description}
          onChange={() => void {}}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          // disable grammar check
          spellCheck="false"
          minH={40}
          h="full"
          resize={'none'}
        ></Textarea>
      </CardBody>
      <CardFooter display="flex" gap={2} flexDirection="column">
        {prompt.website && (
          <Flex>
            <Link
              isExternal
              href={prompt.website}
              fontSize={'sm'}
              opacity={0.8}
            >
              {prompt.website}

              <Icon as={MdOpenInNew} verticalAlign={'middle'} ml={1} />
            </Link>
          </Flex>
        )}
        <Flex direction="row" gap={1}>
          {prompt.tags.map((tag, i) => (
            <Tag
              key={i}
              colorScheme={tagColors[tag][0]}
              // bg={tagColors[tag][1][400]}
              variant="subtle"
              // capitalize text
              textTransform="capitalize"
            >
              {tag}
            </Tag>
          ))}
        </Flex>
        {prompt.source}
      </CardFooter>
    </Card>
  );
};

const CreateNewPromptModal: React.FC<{
  tagOptions: { label: string; value: string; color: string }[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ tagOptions, setTags }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button rightIcon={<MdAdd />} onClick={onOpen}>
        {T.create}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{T.createNewPrompt}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="title">
              <FormLabel>{T.title}</FormLabel>
              <Input placeholder={T.title} />
            </FormControl>
            <FormControl id="description">
              <FormLabel>{T.content}</FormLabel>
              <Textarea placeholder={T.content} />
            </FormControl>
            <FormControl id="remark">
              <FormLabel>{T.remark}</FormLabel>
              <Textarea placeholder={T.remark} />
            </FormControl>
            <FormControl id="tags">
              <FormLabel>{T.tags}</FormLabel>
              <CreatableSelect
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tagVariant="subtle"
                isMulti
                isSearchable
                isClearable={false}
                options={tagOptions}
                formatCreateLabel={(inputValue) =>
                  `${T.create} "${inputValue}"`
                }
                getNewOptionData={(inputValue, optionLabel) => ({
                  label: optionLabel,
                  value: inputValue,
                  color: PALETTE_COLORS[0],
                })}
                onCreateOption={(inputValue) => {
                  setTags((tags) => [...tags, inputValue]);
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              {T.save}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              {T.cancel}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const uniqueTags = [...new Set(data.flatMap((prompt) => prompt.tags))];
const initFilteredPrompts = data
  .filter((a) => !a.title.includes('失效'))
  .sort((a, b) => a.weight - b.weight);

const PromptManager: React.FC = () => {
  const { colors } = useTheme<Theme>();
  const [en, setEn] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [every, setEvery] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>(initFilteredPrompts);
  const [tags, setTags] = useState<string[]>(uniqueTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchInputChange = useCallback(
    debounce(setSearchQuery, 500),
    []
  );

  const validColors = Object.entries(colors).filter(([name]) =>
    PALETTE_COLORS.includes(name)
  ) as ColorEntry[];

  const tagColorMap = useMemo(
    () =>
      Object.fromEntries(
        tags.map((tag, i) => [tag, validColors[i % validColors.length]])
      ) as ColorMap,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tagOptions = useMemo(
    () =>
      tags.map((t) => ({
        // capitalize text
        label: t.charAt(0).toUpperCase() + t.slice(1),
        value: t,
        colorScheme: tagColorMap[t][0],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [selectedTags, setSelectedTags] = useState(tagOptions);

  const filteredPrompts = useMemo(
    () =>
      prompts.filter((prompt) => {
        const promptText = en ? prompt.title_en : prompt.title;
        const textMatch =
          !searchQuery ||
          promptText.toLowerCase().includes(searchQuery.toLowerCase());
        const tagMatchFn = every ? Array.prototype.every : Array.prototype.some;
        const tagMatch = tagMatchFn.call(selectedTags, (tag) =>
          prompt.tags.includes(tag.value)
        );
        return textMatch && tagMatch;
      }),
    [prompts, selectedTags, every, searchQuery, en]
  );

  useEffect(() => {
    setPrompts(initFilteredPrompts);
  }, []);

  return (
    <Container maxW="container.xl">
      <Flex direction="column" gap={4}>
        <Flex gap={4} pt={4}>
          <InputGroup>
            <Input
              placeholder="Search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearchInputChange(e.target.value);
              }}
            />
            <InputRightElement>
              <IconButton
                size="sm"
                variant="ghost"
                aria-label={T.clearSearch}
                icon={<MdClear />}
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery('');
                }}
              />
            </InputRightElement>
          </InputGroup>
          <Tooltip label={!en ? T.english : T.chinese}>
            <IconButton
              onClick={() => setEn((en) => !en)}
              aria-label={!en ? T.english : T.chinese}
              title="Switch language"
            >
              <Text>{!en ? T.en : T.zh}</Text>
            </IconButton>
          </Tooltip>
          <CreateNewPromptModal
            tagOptions={tagOptions as any}
            setTags={setTags}
          />
          {/* <Tooltip label={!every ? 'Any' : 'Every'}>
            <IconButton
              onClick={() => setEvery((every) => !every)}
              aria-label={every ? 'Any' : 'Every'}
              title="Switch language"
            >
              <Text>{!every ? 'OR' : 'AND'}</Text>
            </IconButton>
          </Tooltip> */}
        </Flex>
        <Box width="full">
          <Select
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={setSelectedTags as any}
            value={selectedTags}
            tagVariant="subtle"
            variant="unstyled"
            isMulti
            isSearchable
            isClearable={false}
            // hide dropdown indicator
            components={{
              DropdownIndicator: () => null,
            }}
            options={tagOptions}
          />
        </Box>
        <SimpleGrid
          gap={4}
          columns={{
            base: 1,
            md: 2,
            lg: 3,
          }}
        >
          {filteredPrompts.map((prompt) => (
            <PromptCard
              prompt={prompt}
              en={en}
              tagColors={tagColorMap}
              key={prompt.id}
            />
          ))}
        </SimpleGrid>
      </Flex>
    </Container>
  );
};

export default PromptManager;
