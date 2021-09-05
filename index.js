const EconomyError = require('./src/classes/EconomyError')
const errors = require('./src/structures/errors')

const colors = {
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
}

if (Number(process.version.split('.')[0]) < 14) {
    const err = new EconomyError(errors.oldNodeVersion + process.version)

    console.log(`${colors.red}Failed to start the module:${colors.cyan}`)
    console.log(err, colors.reset)

    process.exit(1)
}


const Economy = require('./src/index')

module.exports = Object.assign(Economy, {
    version: require('./package.json').version,
    docs: 'https://des-docs.tk'
})