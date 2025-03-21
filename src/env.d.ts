/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONGODB_URI: string
  readonly VITE_MONGODB_DB_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}