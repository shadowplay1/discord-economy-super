const { readdirSync } = require('fs')

const EconomyError = require('./src/classes/util/EconomyError')
const errors = require('./src/structures/errors')

const colors = {
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
}


if (parseInt(process.version.split('.')[0].slice(1)) < 14) {
    const err = new EconomyError(errors.oldNodeVersion + process.version, 'OLD_NODE_VERSION')

    console.log(`${colors.red}Failed to start the module:${colors.cyan}`)
    console.log(err, colors.reset)

    process.exit(1)
}


const Economy = require('./src/index')
const Emitter = require('./src/classes/util/Emitter')

const EconomyProperties = {
    version: require('./package.json').version,
    docs: 'https://des-docs.js.org',

    EconomyError,
    Emitter,
}


const userClassFiles = readdirSync(__dirname + '/src/classes/user')
const guildClassFiles = readdirSync(__dirname + '/src/classes/guild')
const managerFiles = readdirSync(__dirname + '/src/managers')

for (const userClassFile of userClassFiles) {
    EconomyProperties[userClassFile.slice(0, -3)] = require(`./src/classes/user/${userClassFile}`)
}

for (const guildClassFile of guildClassFiles) {
    EconomyProperties[guildClassFile.slice(0, -3)] = require(`./src/classes/guild/${guildClassFile}`)
}

for (const managerFile of managerFiles) {
    EconomyProperties[managerFile.slice(0, -3)] = require(`./src/managers/${managerFile}`)
}

module.exports = Object.assign(Economy, EconomyProperties)
