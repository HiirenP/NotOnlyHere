import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
  test: {
    globals: false,
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts', 'src/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
    fileParallelism: false,
  },
});
