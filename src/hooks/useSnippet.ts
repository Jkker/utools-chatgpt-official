import { create } from 'zustand';
// uuid
import { v4 as uuidv4 } from 'uuid';

export interface Snippet {
  id?: string | number;
  /**
    The label to show in the completion picker. This is what input
    is matched agains to determine whether a completion matches (and
    how well it matches).
    */
  label?: string;
  /**
    An optional short piece of information to show (with a different
    style) after the label.
    */
  description?: string;
  /**
    Content of the snippet  written using syntax like this:

    "for (let ${index} = 0; ${index} < ${end}; ${index}++) {\n\t${}\n}"

    Each `${}` placeholder (you may also use `#{}`) indicates a field
    that the user can fill in. Its name, if any, will be the default
    content for the field.

    When the snippet is activated by calling the returned function,
    the code is inserted at the given position. Newlines in the
    template are indented by the indentation of the start line, plus
    one [indent unit](https://codemirror.net/6/docs/ref/#language.indentUnit) per tab character after
    the newline.

    On activation, (all instances of) the first field are selected.
    The user can move between fields with Tab and Shift-Tab as long as
    the fields are active. Moving to the last field or moving the
    cursor out of the current field deactivates the fields.

    The order of fields defaults to textual order, but you can add
    numbers to placeholders (`${1}` or `${1:defaultText}`) to provide
    a custom order.

    To include a literal `{` or `}` in your template, put a backslash
    in front of it. This will be removed and the brace will not be
    interpreted as indicating a placeholder.
    */
  content: string;
  tags?: string[];
}
const defaultSnippets: Snippet[] = [
  {
    id: 0,
    label: "Let's think step by step.",
    content: "Let's think step by step.",
    description: 'Chain-of-thoughts (CoT) template',
  },
/*   {
    id: 1,
    label: 'structured report',
    description: 'Write a structured report on a topic',
    content: `As an expert, write a report on "\${<title>}".

## Instructions

- Use markdown syntax
- Keep sentences short and concise; do NOT write long paragraphs; aim for a 300-word limit
- Enhance readability with emojis, arrows, and abbreviations
- Highlight key terms using bold text
- Use search engines to gather missing information (if applicable)
- Think step by step

- Begin with an outline of the report
- Fill in the outline with details
- Write an overview of the topic in the introduction
- Organize the body of the report into sections and subsections by topic
- In each section, summarize main ideas, define technical terms, list supporting details, and paraphrase the examples (if applicable)
- In the conclusion, list takeaways and key points



## Source

"""
\${<body>}
"""

Now, write the report. Remember to follow these instructions:

- Use markdown syntax
- Keep sentences short and concise; do NOT write long paragraphs; aim for a 300-word limit
- Enhance readability with emojis, arrows, and abbreviations
- Highlight key terms using bold text
- Use search engines to gather missing information (if applicable)
- Think step by step

- Begin with an outline of the report
- Fill in the outline with details
- Write an overview of the topic in the introduction
- Organize the body of the report into sections and subsections by topic
- In each section, summarize main ideas, define technical terms, list supporting details, and paraphrase the examples (if applicable)
- In the conclusion, list takeaways and key points

`,
  }, */
  {
    id: 2,
    content: 'Use markdown syntax',
  },
  {
    id: 3,
    content:
      'Keep sentences short and concise; do NOT write long paragraphs; aim for a 300-word limit',
  },
  // {
  //   id: 4,
  //   content: '```\n${<code>}\n```',
  //   label: '```',
  //   description: 'Markdown Code block',
  // },
  // {
  //   id: 5,
  //   content: '$${<latex>}$$',
  //   label: '$$',
  //   description: 'Latex Math block',
  // },
  // {
  //   id: 5,
  //   content: '"""\n{<text>}\n"""',
  //   label: '"""',
  //   description: 'Docstring',
  // },
];
interface SnippetStore {
  snippets: Snippet[];
  load: () => void;
  save: () => void;
  create: (snippet: Snippet) => void;
  update: (snippet: Snippet) => void;
  delete: (snippet: Snippet) => void;
}

const useSnippet = create<SnippetStore>((set, get) => ({
  snippets: [],
  load: () => {
    if (!('utools' in window)) {
      set(() => ({ snippets: defaultSnippets }));
      return;
    }
    const snippets = utools.dbStorage.getItem('snippets') ?? defaultSnippets;
    console.log(`🚀 ~ file: useSnippet.ts:121 ~ useSnippet ~ load:`, snippets);
    set(() => ({ snippets }));
  },
  save: () => {
    const { snippets } = get();
    if (!('utools' in window)) return;

    utools.dbStorage.setItem('snippets', snippets);
    console.log(`💾 saved ${snippets.length} snippets to database`, snippets);
  },
  create: (snippet) =>
    set((state) => ({
      snippets: [
        {
          ...snippet,
          id: uuidv4(),
        },
        ...state.snippets,
      ],
    })),
  update: (snippet) =>
    set((state) => ({
      snippets: state.snippets.map((s) => (s.id === snippet.id ? snippet : s)),
    })),
  delete: (snippet) =>
    set((state) => ({
      snippets: state.snippets.filter((s) => s.id !== snippet.id),
    })),
}));

useSnippet.subscribe((state) => state.save());

export default useSnippet;
