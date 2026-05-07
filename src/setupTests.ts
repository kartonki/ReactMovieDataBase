import { vi } from 'vitest';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Keep legacy Jest-style tests working while running under Vitest.
(globalThis as any).jest = vi;