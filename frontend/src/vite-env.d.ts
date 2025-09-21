/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_GOOGLE_CLIENT_ID: string
  readonly REACT_APP_API_BASE_URL: string
  readonly REACT_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
