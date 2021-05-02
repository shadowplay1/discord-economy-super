const tests = {
    total: 15,
    passed: []
}
function removeFile() {
    if(require('os').platform() == 'win32') require('child_process').execSync('del storage.json')
    else require('child_process').execSync('rm storage.json')
}
class TestError extends Error {
    constructor(message) {
        if (message instanceof Error == 'Error') {
            super(message.message)
            Error.captureStackTrace(this, this.constructor)
        }
        if (typeof message == 'string') super(message)
        this.name = 'TestError'
    }
}
function test(value) {
    return {
        expect(val) {
            if (value == val) return true
            else throw new TestError(`expected to get ${val}, but got ${value}`)
        }
    }
}
(async function () {
    console.log('\x1b[36mStarting tests for the module...')
    const startDate = Date.now()
    try {
        const Economy = require('./src/index')
        await new Economy({ updater: { checkUpdates: false } })
        tests.passed.push('1')
        console.log(`\x1b[33mTest 1: start the module... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 1: start the module... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const set = await eco.set(100, '123', '321')
        test(set).expect(100)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 2: set 100 coins for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 2: set 100 coins for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const balance = await eco.fetch('123', '321')
        test(balance).expect(100)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 3: fetch the balance for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 3: fetch the balance for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const balance = await eco.add(10, '123', '321')
        test(balance).expect(10)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 4: add 10 coins for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 4: add 10 coins for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const balance = await eco.fetch('123', '321')
        test(balance).expect(110)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 5: fetch the balance for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 5: fetch the balance for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const balance = await eco.subtract(5, '123', '321')
        test(balance).expect(5)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 6: subtract 5 coins from user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 6: subtract 5 coins from user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const balance = await eco.fetch('123', '321')
        test(balance).expect(105)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 7: fetch the balance for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 7: fetch the balance for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const balance = await eco.daily('123', '321')
        test(balance).expect(100)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 8: get daily reward for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 8: get daily reward for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ workAmount: 5, updater: { checkUpdates: false } })
        const balance = await eco.work('123', '321')
        test(balance).expect(5)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 9: get work reward for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 9: get work reward for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const balance = await eco.weekly('123', '321')
        test(balance).expect(1000)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 10: get weekly reward for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 10: get weekly reward for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const balance = await eco.fetch('123', '321')
        test(balance).expect(1210)
        tests.passed.push('1')
        console.log(`\x1b[33mTest 11: fetch the balance for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 11: fetch the balance for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        const balance = await eco.daily('123', '321')
        test(balance).expect('24h')
        tests.passed.push('1')
        console.log(`\x1b[33mTest 12: get daily reward for user 123 on guild 321 again... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 12: get daily reward for user 123 on guild 321 again... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ workAmount: 5, updater: { checkUpdates: false } })
        const balance = await eco.work('123', '321')
        test(balance).expect('60m')
        tests.passed.push('1')
        console.log(`\x1b[33mTest 13: get work reward for user 123 on guild 321 again... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 13: get work reward for user 123 on guild 321 again... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy(
            { updater: { checkUpdates: false } })
        const balance = await eco.weekly('123', '321')
        test(balance).expect('7d')
        tests.passed.push('1')
        console.log(`\x1b[33mTest 14: get weekly reward for user 123 on guild 321 again... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 14: get weekly reward for user 123 on guild 321 again... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }

    try {
        const Economy = require('./src/index')
        const eco = new Economy({ updater: { checkUpdates: false } })
        eco.clearDailyCooldown('123', '321')
        eco.clearWorkCooldown('123', '321')
        eco.clearWeeklyCooldown('123', '321')
        tests.passed.push('1')
        console.log(`\x1b[33mTest 15: clear all cooldowns for user 123 on guild 321... \x1b[32mpassed\x1b[33m`)
    } catch (err) {
        console.log(`\x1b[33mTest 15: clear all cooldowns for user 123 on guild 321... \x1b[31mfailed:\x1b[36m`)
        console.log(err)
        console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
        removeFile()
        process.exit(1)
    }
    console.log(`\x1b[32mPassed tests: ${tests.passed.length}/${tests.total}.\x1b[37m`)
    console.log(`\x1b[34mTime taken: ${Date.now() - startDate} ms.`)
    console.log('\x1b[36mAll tests passed!\x1b[37m')
    removeFile()
    process.exit(0)
})()