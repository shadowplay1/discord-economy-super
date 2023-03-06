const { writeFileSync } = require('fs')
const { execSync } = require('child_process')

const modulePackage = require('../package.json')

const hash = execSync('git rev-parse --short HEAD')
const timestamp = Math.floor(Date.now() / 1000)

let version

const args = process.argv.slice(2)

if (args[0] == '-v' || args[0] == '--version')
	version = args[1]

const moduleVersion = version || modulePackage.version.split('-dev')[0]

modulePackage.version = moduleVersion + `-dev.${hash}.${timestamp}`.replace('\n', '')

writeFileSync('./package.json', JSON.stringify(modulePackage, null, '\t'))
writeFileSync('./mongodb/package.json', JSON.stringify(modulePackage, null, '\t'))

console.log('Updated the version in "./package.json":')
console.log(modulePackage.version)

// const result = execSync('npm publish --tag dev')
// console.log(result)

// console.log()
// console.log('Uploaded successfully!')
