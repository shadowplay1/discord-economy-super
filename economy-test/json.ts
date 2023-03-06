import readline from 'readline'
import Economy from '../'

import { ShopItem, InventoryItem, HistoryItem } from '../EconomyItems'


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const exit = () => {
    rl.close()
    process.exit(0)
}

const text = async () => {
    return rl.question('> ', answer => {
        try {
            if (!answer) {
                return text()
            }

            if (answer == 'exit') {
                exit()
            }

            if (answer == 'clear') {
                console.clear()
                return text()
            }

            if (answer.includes('await') && !answer.startsWith('await'))
                answer = `(async () => {${answer}})()`

            if (answer.startsWith('await')) {
                eval(`const startDate = Date.now(); (async () => {return ${answer}})().then(x => {console.log(x); console.log(\`[Promise execution finished in \${Date.now() - startDate}ms]\`); text()}).catch(x => {console.log(new Error(\`Failed to execute the Promise: \${x}\`)); text()})`)
                return
            }

            else {
                const output = eval(answer)
                console.log(output)

                text()
            }
        } catch (err) {
            console.log(err)
            text()
        }

        text()
    })
}

console.clear()

const eco = new Economy({
    storagePath: './storage.json',

    updater: {
        checkUpdates: true,
        upToDateMessage: false
    },

    debug: true
})

// const a = Object<BigInt>(0n)

eco.on('ready', async () => {
    text()
})


// type CustomItemData = {
//     category: string
//     test: string
//     sellingPrice: number
// }
