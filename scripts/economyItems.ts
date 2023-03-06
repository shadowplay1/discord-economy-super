import { readdirSync, writeFileSync } from 'fs'

type If<T extends boolean,
	IfTrue,
	IfFalse = null
> = T extends true ? IfTrue : IfFalse


// ENVIRONMENT values explanation:

// 'development' - save Economy Items in ./scripts/test folder
// with `test-{type}.(js/d.ts)` file name format.

// 'production' - prepare EconomyItems for publishing in the update:

// save save Economy Items in ./ and in ./mongodb folders 
// with `EconomyItems.(js/d.ts)` file name format.

// `as any` allows the variable to keep its variety between 
// 'development' and 'production' values so TypeScript won't
// throw any errors when checking the environment type.

const ENVIRONMENT: 'development' | 'production' = 'production' as any


const colors = {
	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	lightgray: '\x1b[37m',
	default: '\x1b[39m',
	darkgray: '\x1b[90m',
	lightred: '\x1b[91m',
	lightgreen: '\x1b[92m',
	lightyellow: '\x1b[93m',
	lightblue: '\x1b[94m',
	lightmagenta: '\x1b[95m',
	lightcyan: '\x1b[96m',
	white: '\x1b[97m',
	reset: '\x1b[0m',
}

const sources = ['src', 'typings'] as const
const types = ['json', 'mongodb'] as const

const baseDirectories: ISourceFolder<false, false> = {
	classes: {
		guild: [],
		user: [],
		util: [],
		root: []
	},

	managers: []
}

const fileTexts = {
	json: {
		js: '',
		ts: ''
	},

	mongodb: {
		js: '',
		ts: ''
	}
}


const getFiles = (path: string): string[] => {
	const files = readdirSync(path)
		.filter(fileName => fileName.includes('.'))
		.sort()

	return files
}

const createJSDeclaration = (fileName: string, path: string) => {
	const fileNameReplaced = fileName.replace('.js', '')

	return `  ${fileNameReplaced}: require('${path.replace('mongodb/', '')}/${fileNameReplaced}')`
}

const createTSDeclaration = (fileName: string, path: string, options?: {
	multipleImports?: string[]
}) => {
	const fileNameReplaced = fileName.replace('.d.ts', '')

	if (options?.multipleImports?.length) {
		return `export { ${options?.multipleImports.join(', ')} } from '${path.replace('mongodb/', '')}/${fileNameReplaced}'`
	} else {
		return `export import ${fileNameReplaced} = require('${path.replace('mongodb/', '')}/${fileNameReplaced}')`
	}
}

const defineMultipleImports = (fileName: string, extension = '.d.ts'): string[] => {
	const fileNameReplaced = fileName.replace(extension, '')

	switch (fileNameReplaced) {
		case 'CurrencyObject': {
			return ['CurrencyObject', 'CurrencyPropertyType']
		}

		case 'ItemProperties': {
			return ['ItemProperties', 'ItemPropertyType']
		}

		case 'RewardTypes': {
			return ['Reward', 'RewardType']
		}

		case 'CachedItems': {
			return [
				'CachedBalance', 'CachedBank',
				'CachedCooldowns', 'CachedCurrency',
				'CachedGuilds', 'CachedHistory',
				'CachedInventory', 'CachedShop', 'CachedUsers'
			]
		}

		default: {
			return []
		}
	}
}

const generateUserMessage = (type: typeof types[number], source: typeof sources[number]): string => {
	if (source == 'src') {
		const message =
			`// This file contains all the managers and classes Economy has (e.g. EconomyItems).
// This file was generated automatically and it's not recommended to edit it yourself.

// All of these items can be imported using:
// \`const { something } = require('discord-economy-super${type == 'mongodb' ? '/mongodb' : ''}')\`

// or in TypeScript (all the economy types and interfaces available):
// \`import { something } = from 'discord-economy-super${type == 'mongodb' ? '/mongodb' : ''}'\`

// Any of these items may be used in any way. Enjoy!

// - shadowplay1`

		return message
	} else {
		const message =
			`// This file contains all the managers, interfaces and classes Economy has (e.g. EconomyItems).
// This file was generated automatically and it's not recommended to edit it yourself.
				
// All of these items can be imported using:
// \`const { something } = require('discord-economy-super${type == 'mongodb' ? '/mongodb' : ''}')\`

// or in TypeScript (all the economy types and interfaces available):
// \`import { something } = from 'discord-economy-super${type == 'mongodb' ? '/mongodb' : ''}'\`
		
// Any of these items and types may be used in any way. Enjoy!

// - shadowplay1`

		return message
	}
}

const directories: IEconomyFiles = {} as any
const startDate = Date.now()

for (const source of sources) {
	let jsText = ''
	let tsText = ''

	directories[source] = {} as any

	if (source == 'src') {
		for (const type of types) {
			const sourcePath = type == 'json' ? './src' : './mongodb/src'

			for (const baseClassesFolder in baseDirectories.classes) {
				const classesFolder: keyof IClassesFolder = baseClassesFolder as any

				directories[source][type] = {} as any

				directories[source][type].classes = {
					...baseDirectories.classes
				}

				if (classesFolder == 'root') {
					const rootFiles = getFiles(sourcePath + '/classes')
					directories[source][type].classes.root = rootFiles

					for (const rootFile of rootFiles) {
						if (!jsText.includes(rootFile.replace('.js', '')))
							jsText += `  ${createJSDeclaration(rootFile, sourcePath + '/classes')},\n`
					}


				} else {
					const classesFiles = getFiles(sourcePath + `/classes/${classesFolder}`)

					directories[source][type].classes[classesFolder]
						.push(...classesFiles)

					for (const classesFile of classesFiles) {
						if (!jsText.includes(classesFile.replace('.js', '')) && (type !== 'mongodb' && !classesFile.includes('DotParser'))) {
							jsText += `  ${createJSDeclaration(classesFile, sourcePath + `/classes/${classesFolder}`)},\n`
						}
					}
				}
			}

			const managersFiles = getFiles(sourcePath + '/managers')
			directories[source][type].managers = managersFiles

			for (const managersFile of managersFiles) {
				if (!jsText.includes(managersFile.replace('.js', ''))) {
					if (type == 'mongodb' && !managersFile.includes('Fetch')) {
						jsText += `  ${createJSDeclaration(managersFile, sourcePath + `/managers`)},\n`
					}
				}
			}

			if (type == 'mongodb') {
				const cachedFiles = getFiles(sourcePath + '/cached')
				directories[source][type].cached = cachedFiles

				for (const cachedFile of cachedFiles) {
					jsText += `  ${createJSDeclaration(cachedFile, sourcePath + `/cached`)}` +
						 `${cachedFile.includes('CachedItems') ? '' : ',\n'}`
				}
			}

			fileTexts[type].js =
				generateUserMessage(type, source) +
				'\n\n\n' +
				`module.exports = {\n${jsText + ((type == 'json' && !jsText.includes('Fetch')) ?
					`  ${createJSDeclaration('FetchManager.js', sourcePath + `/managers`)},\n` +
					`  ${createJSDeclaration('DotParser.js', sourcePath + `/classes/util`)}` :
					'')}\n}\n`

			writeFileSync(
				ENVIRONMENT == 'development' ?
					`./scripts/test/test-${type}.js` :
					`./${type == 'json' ? '' : 'mongodb/'}EconomyItems.js`,
				fileTexts[type].js
			)
		}
	}

	if (source == 'typings') {
		for (const type of types) {
			const sourcePath = type == 'json' ? './typings' : './mongodb/typings'

			for (const baseClassesFolder in baseDirectories.classes) {
				const classesFolder: keyof IClassesFolder = baseClassesFolder as any

				directories[source][type] = {} as any

				directories[source][type].classes = {
					...baseDirectories.classes
				}

				if (classesFolder == 'root') {
					const rootFiles = getFiles(sourcePath + '/classes')
					directories[source][type].classes.root = rootFiles

					for (const rootFile of rootFiles) {
						if (!tsText.includes(rootFile.replace('.d.ts', '')))
							tsText += `${createTSDeclaration(rootFile, sourcePath + '/classes')}\n`
					}
				} else {
					const classesFiles = getFiles(sourcePath + `/classes/${classesFolder}`)

					directories[source][type].classes[classesFolder]
						.push(...classesFiles)

					for (const classesFile of classesFiles) {
						if (!tsText.includes(classesFile.replace('.d.ts', '')))
							tsText += `${createTSDeclaration(classesFile, sourcePath + `/classes/${classesFolder}`)}\n`
					}
				}
			}

			const managersFiles = getFiles(sourcePath + '/managers')
			directories[source][type].managers = managersFiles

			for (const managersFile of managersFiles) {
				if (!tsText.includes(managersFile.replace('.d.ts', ''))) {
					if (type == 'mongodb' && !managersFile.includes('Fetch')) {
						tsText += `${createTSDeclaration(managersFile, sourcePath + `/managers`)}\n`
					}
				}
			}

			const interfacesFiles = getFiles(sourcePath + '/interfaces')
			directories[source][type].interfaces = interfacesFiles

			for (const interfacesFile of interfacesFiles) {
				if (!tsText.includes(interfacesFile.replace('.d.ts', '')))
					tsText += `${createTSDeclaration(interfacesFile, sourcePath + `/interfaces`, {
						multipleImports: defineMultipleImports(interfacesFile)
					})}\n`
			}

			if (type == 'mongodb') {
				const cachedFiles = getFiles(sourcePath + '/cached')
				directories[source][type].cached = cachedFiles

				for (const cachedFile of cachedFiles) {
					tsText += `${createTSDeclaration(cachedFile, sourcePath + `/cached`, {
						multipleImports: defineMultipleImports(cachedFile)
					})}\n`
				}
			}

			fileTexts[type].ts =
				generateUserMessage(type, source) +
				'\n\n\n' +
				tsText + (type == 'json' ?
					`${createTSDeclaration('FetchManager.d.ts', sourcePath + `/managers`)}\n` :
					'')

			writeFileSync(
				ENVIRONMENT == 'development' ?
					`./scripts/test/test-${type}.d.ts` :
					`./${type == 'json' ? '' : 'mongodb/'}EconomyItems.d.ts`,
				fileTexts[type].ts
			)
		}
	}
}

const timeTaken = ((Date.now() - startDate) / 1000).toFixed(3)

console.log(`${colors.lightcyan}--------------------------------------------------------------`)
console.log('|                                                            |')
console.log(`${colors.lightcyan}| ${colors.lightmagenta}Environment: ${ENVIRONMENT == 'production' ? ENVIRONMENT + ' ' : ENVIRONMENT}                                   ${colors.lightcyan}|`)
console.log('|                                                            |')
console.log(`${colors.lightcyan}| ${colors.yellow}./EconomyItems.d.ts             ${colors.yellow}./EconomyItems.js        ${colors.lightcyan}  |`)
console.log(`${colors.lightcyan}| ${colors.yellow}./mongodb/EconomyItems.d.ts     ${colors.yellow}./mongodb/EconomyItems.js${colors.lightcyan}  |`)
console.log(`${colors.lightcyan}|                                                            |`)
console.log(`${colors.lightcyan}| ${colors.yellow}Time taken: ${colors.lightcyan}${timeTaken}s${parseInt(timeTaken.split('.')[0]) > 9 ? '' : ' '}${' '.repeat(40)}${colors.lightcyan}|`)
console.log(`${colors.lightcyan}| ${colors.lightgreen}EconomyItems have built successfully!                      ${colors.lightcyan}|`)
console.log(`${colors.lightcyan}|                                                            |`)
console.log(`${colors.lightcyan}--------------------------------------------------------------${colors.reset}`)



interface IEconomyFiles {
	src: {
		json: ISourceFolder<false, false>
		mongodb: ISourceFolder<true, false>
	}
	typings: {
		json: ISourceFolder<false, true>
		mongodb: ISourceFolder<true, true>
	}
}

interface IClassesFolder {
	guild: string[],
	user: string[],
	util: string[],
	root: string[]
}

interface IBaseSourceFolder {
	classes: IClassesFolder
	managers: string[]
}

type IDatabaseDefinedFolder<IsMongoDB extends boolean> = If<
	IsMongoDB,
	IBaseSourceFolder & {
		cached: string[]
	},
	IBaseSourceFolder
>

type ISourceFolder<
	IsMongoDB extends boolean,
	IsTypings extends boolean
> = If<
	IsTypings,
	IDatabaseDefinedFolder<IsMongoDB> & {
		interfaces: string[]
	},
	IDatabaseDefinedFolder<IsMongoDB>
>
