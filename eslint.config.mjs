import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const generated = await generateEslintConfig({
	enableTypescript: true,
})

export default [
	...generated,
	{
		files: ['src/**/*.ts'],
		rules: {
			'n/no-missing-import': 'off',
		},
	},
]
