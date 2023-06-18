/// <reference types="vite/client" />

// define properties on `window` object
interface Window {
  API: {
    unpin: () => void;
    pin: () => void;
    togglePin: () => boolean;
    isPinned: boolean;
    getQueuedInput: () => string;
    toggleWindowDevTools: () => void;
    updatePageTitle: (title: string) => void;
  };
}
