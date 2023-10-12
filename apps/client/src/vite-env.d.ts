/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_AUTHORIZE_URL: string;
  readonly VITE_GOOGLE_AUTHORIZE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
