// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default antfu(
  {
    unocss: true,
    formatters: true,
    pnpm: true,
    ignores: [
      // Payload CMS generated files
      'apps/api/src/app/(payload)/**',
      'apps/api/src/payload-types.ts',
      'apps/api/src/migrations/**',
    ],
  },
  {
    // API-specific rules
    files: ['apps/api/**/*.ts'],
    rules: {
      'node/prefer-global/process': 'off',
      'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
    },
  },
)
  .append(nuxt())
