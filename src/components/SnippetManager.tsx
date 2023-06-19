import { FC, useEffect, useRef, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  Collapse,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { MdClose, MdCopyAll, MdDelete, MdEdit, MdSave } from 'react-icons/md';
import TextareaAutosize from 'react-textarea-autosize';
import useSnippet, { Snippet } from '../hooks/useSnippet';
import { useSettings } from '../hooks/useSettings';

const inputStyles = {
  bg: 'gray.50',
  _dark: {
    bg: 'gray.600',
  },
  borderColor: 'transparent',
};

const SnippetCard: FC<Snippet> = (snippet) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Snippet>(snippet ?? ({} as Snippet));
  const { update, delete: deleteSnippet } = useSnippet();
  const { T } = useSettings();

  const handleChange = (key: string) => (e) => {
    setFormData((data) => ({ ...data, [key]: e.target.value }));
  };

  const startEdit = () => setIsEditing(true);

  const cancelEdit = () => {
    setFormData(snippet);
    setIsEditing(false);
  };

  const saveEdit = () => {
    update(formData);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus();
  }, [isEditing]);

  const focusStyle = isEditing
    ? {}
    : {
        focusBorderColor: 'transparent',
        borderColor: 'transparent',
        cursor: 'default',
        _hover: {
          borderColor: 'transparent',
        },
      };

  return (
    <Card
      shadow="lg"
      _dark={{
        shadow: 'xl',
        bg: 'gray.700',
      }}
    >
      <CardBody display="flex" flexDirection="column">
        <FormControl isRequired>
          <FormLabel fontWeight={600}>{T.snippet}</FormLabel>
          <Textarea
            ref={textareaRef}
            as={TextareaAutosize}
            whiteSpace="pre-line"
            isReadOnly={!isEditing}
            value={formData['content']}
            onChange={handleChange('content')}
            onDoubleClick={startEdit}
            maxRows={10}
            minRows={1}
            minH={10}
            {...inputStyles}
            {...focusStyle}
          />
          <Collapse in={isEditing} unmountOnExit>
            <FormHelperText>{T.snippetContentHelperText}</FormHelperText>
          </Collapse>
        </FormControl>
        <Collapse in={isEditing || !!formData['label']} unmountOnExit>
          <FormControl>
            <FormLabel fontWeight={600}>{T.label}</FormLabel>
            <Input
              value={formData['label']}
              onChange={handleChange('label')}
              placeholder={formData.content}
              onDoubleClick={startEdit}
              isReadOnly={!isEditing}
              {...inputStyles}
              {...focusStyle}
            />
            <Collapse in={isEditing}>
              <FormHelperText>{T.snippetLabelHelperText}</FormHelperText>
            </Collapse>
          </FormControl>
        </Collapse>
        <Collapse in={isEditing || !!formData['description']} unmountOnExit>
          <FormControl>
            <FormLabel fontWeight={600}>{T.description}</FormLabel>
            <Input
              value={formData['description']}
              onChange={handleChange('description')}
              onBlur={handleChange('description')}
              placeholder={formData.content}
              onDoubleClick={startEdit}
              isReadOnly={!isEditing}
              {...inputStyles}
              {...focusStyle}
            />
            <Collapse in={isEditing}>
              <FormHelperText>{T.snippetDescriptionHelperText}</FormHelperText>
            </Collapse>
          </FormControl>
        </Collapse>
        <Flex justify="space-between">
          <Button
            variant="ghost"
            leftIcon={<Icon as={MdCopyAll} />}
            onClick={() => {
              navigator.clipboard.writeText(formData.content);
            }}
          >
            {T.copy}
          </Button>
          <Flex gap={4}>
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  leftIcon={<Icon as={MdClose} />}
                  onClick={cancelEdit}
                  width={100}
                >
                  {T.cancel}
                </Button>
                <Button
                  isDisabled={
                    (snippet.content === formData.content &&
                      snippet.label === formData.label &&
                      snippet.description === formData.description) ||
                    !formData.content
                  }
                  colorScheme="blue"
                  leftIcon={<Icon as={MdSave} />}
                  onClick={saveEdit}
                  width={100}
                >
                  {T.save}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  leftIcon={<Icon as={MdEdit} />}
                  onClick={startEdit}
                  width={100}
                >
                  {T.edit}
                </Button>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      colorScheme="red"
                      variant="ghost"
                      leftIcon={<Icon as={MdDelete} />}
                      width={100}
                    >
                      {T.delete}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader as={Heading} size="sm" border={0}>
                      {T.confirmDeleteTitle}
                    </PopoverHeader>
                    <PopoverBody as={Text} fontSize="sm" border={0}>
                      {T.confirmDeleteBody}
                    </PopoverBody>
                    <PopoverFooter border={0}>
                      <Button
                        w="full"
                        size="sm"
                        colorScheme="red"
                        onClick={() => deleteSnippet(snippet)}
                      >
                        {T.delete}
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              </>
            )}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};
const NewSnippetCard: FC = () => {
  const { T } = useSettings();

  const [isCreating, setIsCreating] = useState(false);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState('');
  const { create } = useSnippet();

  const clearForm = () => {
    setContent('');
    setDescription('');
    setLabel('');
  };

  const startEdit = () => {
    setIsCreating(true);
    clearForm();
  };

  const saveEdit = () => {
    create({ content, description, label });
    setIsCreating(false);
    clearForm();
  };

  const cancelEdit = () => {
    setIsCreating(false);
    clearForm();
  };

  return (
    <Card
      shadow="lg"
      _dark={{
        shadow: 'xl',
        bg: 'gray.700',
      }}
    >
      <Collapse in={isCreating} animateOpacity={false}>
        <CardBody display="flex" flexDirection="column">
          <FormControl isRequired>
            <FormLabel fontWeight={600}>{T.snippet}</FormLabel>
            <Textarea
              autoFocus
              as={TextareaAutosize}
              whiteSpace="pre-line"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxRows={10}
              minRows={1}
              minH={10}
              {...inputStyles}
            />
            <FormHelperText>{T.snippetContentHelperText}</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel fontWeight={600}>{T.label}</FormLabel>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={content}
              {...inputStyles}
            />
            <FormHelperText>{T.snippetLabelHelperText}</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel fontWeight={600}>{T.description}</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={content}
              {...inputStyles}
            />
            <FormHelperText>{T.snippetDescriptionHelperText}</FormHelperText>
          </FormControl>
          <Flex gap={4} w="full" justify="flex-end">
            <Button
              variant="ghost"
              leftIcon={<Icon as={MdClose} />}
              onClick={cancelEdit}
              width={100}
            >
              {T.cancel}
            </Button>
            <Button
              isDisabled={!content}
              colorScheme="blue"
              leftIcon={<Icon as={MdSave} />}
              onClick={saveEdit}
              width={100}
            >
              {T.save}
            </Button>
          </Flex>
        </CardBody>
      </Collapse>
      {!isCreating && (
        <Button variant="ghost" aria-label={T.createNew} onClick={startEdit}>
          {T.create}
        </Button>
      )}
    </Card>
  );
};
const SnippetManager = () => {
  const { snippets, load } = useSnippet();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      direction="column"
      w="full"
      gap={6}
      sx={{
        '.chakra-form-control': {
          marginBottom: 2,
          p: 0.5,
        },
      }}
    >
      <NewSnippetCard />
      {snippets.map((snippet) => (
        <SnippetCard {...snippet} key={snippet.id} />
      ))}
    </Flex>
  );
};

export default SnippetManager;
