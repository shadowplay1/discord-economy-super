import readline from 'readline'
import { readFileSync } from 'fs'

import Economy from '../'

import { ShopItem, InventoryItem, HistoryItem, EconomyGuild } from '../mongodb/EconomyItems'
import CooldownItem from '../mongodb/typings/classes/CooldownItem'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// (async() => {(eco.users.get('123', '123')).inventory.fetch()})().then(console.log)

const exit = () => {
    rl.close()
    process.exit(0)
}

// restart the process and redo all the code in this file
const restart = () => {
    process.nextTick(() => {
        rl.close()

        const file = readFileSync('./economy-test/a.ts', 'utf8')

        const lines = file.split('\n')
        const code = lines.slice(66).join('\n')
        // console.log(code)

        eval(code)
        text()
    })
}

const text = async () => {
    return rl.question('> ', answer => {
        try {
            if (answer == 'exit') {
                exit()
            }

            else if (answer == 'restart') {
                return restart()
            }

            const output = eval(answer)
            console.log(output)

            text()
        } catch (err) {
            console.log(err)
            text()
        }

        text()
    })
}

console.clear()

const eco = new Economy({
    updater: {
        checkUpdates: true,
        upToDateMessage: false
    },

    storagePath: 'fall_guys_is_the_best_game_ever.json',

    debug: true
})

eco.on('ready', async () => {
    // eco.database.clear()
    // process.exit(0)

    let guild = eco.guilds.get('123')
    let user = guild.users.get('123')

    const a = user.rewards.getDaily()
    console.log(a)

    setTimeout(async () => {
        // guild.shop.addItem<CustomItemData>({
        //     name: 'test',
        //     price: 100,

        //     custom: {
        //         category: 'test',
        //         sellingPrice: 100,
        //         test: 'test'
        //     }
        // })

        text()
    })
})

eco.on('balanceAdd', data => {
    console.log(`Added ${data.amount} coins for ${data.reason}.`);
})

eco.on('balanceSubtract', data => {
    console.log(`Subtracted ${data.amount} coins for ${data.reason}.`);
})

// type CustomItemData = Record<'category' | 'test', string> & {
//     sellingPrice: number
// }

type CustomItemData = {
    category: string
    test: string
    sellingPrice: number
}
