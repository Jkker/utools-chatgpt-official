import {create } from 'zustand'

const useActionStore = create((set) => ({
  webview: null,
  setWebview: (webview) => set({ webview }),

}))