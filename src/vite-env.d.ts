interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_AI_KEY?: string;
  readonly PROD: boolean;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
