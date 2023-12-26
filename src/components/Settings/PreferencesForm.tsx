import {
  Checkbox,
  ColorMode,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useColorMode,
} from '@chakra-ui/react';

import { settingsFormData, useSettings } from '@/hooks/useSettings';

export const PreferencesForm = ({ actions }) => {
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

export default PreferencesForm;