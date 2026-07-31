// Auto-cleanup between tests. Without this, renders accumulate in the same
// jsdom document and queries match elements from earlier tests.
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);
