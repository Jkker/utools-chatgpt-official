import { getEncoding } from 'js-tiktoken';
const gptEncoder = getEncoding('cl100k_base');

export const getTokenCount = (text: string) => gptEncoder.encode(text).length;
