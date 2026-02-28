import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({
	enableTypescript: true,
})

export default [
	...baseConfig,
	// Disable TypeScript-specific rules for JS files that haven't been converted yet
	{
		files: ['**/*.js'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'n/no-missing-require': 'off',
		},
	},
]
