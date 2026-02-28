import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const config = await generateEslintConfig({
	enableTypescript: true,
})

export default [
	...config,
	{
		files: ['**/*.ts'],
		rules: {
			'n/no-missing-import': 'off',
		},
	},
	{
		// Allow require() in JS files that haven't been converted to TypeScript yet
		files: ['**/*.js'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_(.+)' }],
		},
	},
]
