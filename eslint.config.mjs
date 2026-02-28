import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({
	enableTypescript: true,
})

export default [
	...baseConfig,
	{
		files: ['**/*.js'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'n/no-missing-require': 'off',
		},
	},
	{
		files: ['**/*.ts'],
		rules: {
			'n/no-missing-import': 'off',
			'n/no-missing-require': 'off',
		},
	},
]
