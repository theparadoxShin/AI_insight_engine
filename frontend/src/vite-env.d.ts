/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_USE_MOCK_DATA: string
  readonly VITE_APP_NAME: string
  readonly VITE_GITHUB_URL: string
  readonly VITE_LINKEDIN_URL: string
  readonly VITE_PORTFOLIO_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}