/// <reference types="vite/client" />
interface ImportMetaEnv {
    VITE_REACT_APP_GITHUB_TOKEN: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }