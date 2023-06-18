import {
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SlideFade,
  useDisclosure,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import {
  MdArrowDownward,
  MdArrowUpward,
  MdClose,
  MdSearch,
} from 'react-icons/md';

interface SearchBarProps {
  webviewRef: React.MutableRefObject<Electron.WebviewTag & HTMLWebViewElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({ webviewRef }) => {
  const [searchText, setSearchText] = useState('');
  const [matches, setMatches] = useState(0);
  console.log(`🚀 ~ file: SearchBar.tsx:27 ~ matches:`, matches);
  const { isOpen, onToggle } = useDisclosure();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((text: string) => {
      webviewRef.current.stopFindInPage('clearSelection');
      if (text) {
        webviewRef.current.findInPage(text, {
          forward: true,
          findNext: false,
        });
      }
      // focus on webview

    }, 500),
    [webviewRef]
  );

  useEffect(() => {
    const handleFoundInPage = (e: Electron.FoundInPageEvent) => {
      console.log(`🚀 ~ file: SearchBar.tsx:54 ~ handleFoundInPage ~ e:`, e);
      if (e.result.finalUpdate) {
        setMatches(e.result.matches);
        webviewRef.current.stopFindInPage('keepSelection');
  
      }
    };

    webviewRef.current.addEventListener('found-in-page', handleFoundInPage);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    // handleSearch(e.target.value);
    // webviewRef.current.stopFindInPage('clearSelection');
    if (e.target.value) {
      webviewRef.current.findInPage(e.target.value, {
        forward: true,
        findNext: false,
      });
    }
  };

  const handleSearchToggle = () => {
    onToggle();
    if (isOpen) {
      setSearchText('');
      setMatches(0);
      webviewRef.current.stopFindInPage('clearSelection');
    }
  };

  const handlePrevMatch = () => {
    webviewRef.current.findInPage(searchText, {
      forward: false,
      findNext: true,
    });
  };

  const handleNextMatch = () => {
    webviewRef.current.findInPage(searchText, {
      forward: true,
      findNext: true,
    });
    // focus on webview
  };

  return (
    <Flex gap={0} wrap="nowrap" flex="0 0 auto">
      <SlideFade in={isOpen}>
        <Flex wrap="nowrap">
          <InputGroup variant="filled">
            <Input
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search"
              borderRightRadius={0}
            />
            <InputRightElement borderRightRadius={0} opacity={0.75}>
              {matches}
            </InputRightElement>
          </InputGroup>
          <ButtonGroup isAttached borderRadius={0}>
            <IconButton
              disabled={!matches}
              isDisabled={!matches}
              icon={<MdArrowUpward />}
              onClick={handlePrevMatch}
              aria-label={''}
              rounded={'none'}
            />
            <IconButton
              disabled={!matches}
              isDisabled={!matches}
              icon={<MdArrowDownward />}
              onClick={handleNextMatch}
              aria-label={''}
            />
          </ButtonGroup>
        </Flex>
      </SlideFade>
      <IconButton
        borderLeftRadius={isOpen ? 0 : 'md'}
        icon={isOpen ? <MdClose /> : <MdSearch />}
        onClick={handleSearchToggle}
        aria-label={''}
      />
    </Flex>
  );
};

export default SearchBar;
