try {
    const projectPackage = require('../../package.json')

    if (projectPackage['discord-economy-super']?.postinstall !== false) {
        console.log()
        console.log('\x1b[32m╔══════════════════════════════════════════════════════════════════╗')
        console.log('\x1b[32m║ @ discord-economy-super                                   - [] X ║')
        console.log('\x1b[32m║══════════════════════════════════════════════════════════════════║')
        console.log('\x1b[32m║ \x1b[36mThank you for installing Discord Economy Super!                  \x1b[32m║')
        console.log('\x1b[32m║══════════════════════════════════════════════════════════════════║')
        console.log('\x1b[32m║ If you have any questions or need help, join our Support Server: \x1b[32m║')
        console.log('\x1b[32m║ \x1b[34mhttps://discord.gg/4pWKq8vUnb                                    \x1b[32m║')
        console.log('\x1b[32m╚══════════════════════════════════════════════════════════════════╝\x1b[37m')
        console.log()
    }
} catch {
    // console.log('\x1b[91mFailed to open the project\'s `package.json` file.')
}
