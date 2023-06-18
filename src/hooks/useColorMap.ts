import { useTheme, Theme } from '@chakra-ui/react';

const VIABLE_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'cyan',
  'blue',
  'purple',
  'pink',
];

export const useColorMap = (tags, gradient = 400) => {
  const { colors } = useTheme() as Theme;
  const validColors = Object.values(colors).filter((color) =>
    VIABLE_COLORS.includes(color[gradient])
  );
  // .map((color) => color[gradient])
  // .filter((color) => color?.startsWith('#'));

  const tagColorMap = Object.fromEntries(
    tags.map((tag, i) => [tag, validColors[i % validColors.length]])
  );

  return tagColorMap;
};
