const Economy = require('../mongodb')

var errors = 0

const test = (description, value) => {
	return {
		toBe: expectedValue => {
			if (value == expectedValue) {
				console.log(`[OK] - ${description}: expected to get "${expectedValue}" and got it`)
			} else {
				errors++
				console.log(`[ERROR] - ${description}: expected to get "${expectedValue}", but got "${value}"`)
			}
		}
	}
}

const eco = new Economy({
	connection: {
		connectionURI: 'mongodb+srv://replit:replit@cluster0.5nbla.mongodb.net/test',
		collectionName: 'economyTest',
		dbName: 'test'
	},

	debug: true
})

eco.on('ready', async () => {
	const TESTS_AMOUNT = 100
	const ADDING_AMOUNT = 100

	const startTimestamp = Date.now()

	console.log('Economy is ready!')

	for (let i = 0; i < TESTS_AMOUNT; i++) {
		const user = eco.cache.users.get({ memberID: '123', guildID: '321' })
		await user.balance.add(ADDING_AMOUNT)

		const balance = eco.cache.balance.get({ memberID: '123', guildID: '321' }).money
		test(`test ${i + 1}/${TESTS_AMOUNT} - adding and getting balance from the cache`, balance).toBe(balance)
	}

	const endTimestamp = Date.now()

	console.log(`\nFailed ${errors} tests.`)
	console.log(`Passed ${TESTS_AMOUNT - errors} tests.`)
	console.log(`Time taken: ${((endTimestamp - startTimestamp) / 1000).toFixed(3)}s`)
})
