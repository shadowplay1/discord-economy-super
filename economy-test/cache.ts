import readline from 'readline'
import { readFileSync } from 'fs'

import Economy from '../mongodb'

import { ShopItem, InventoryItem, HistoryItem, EconomyGuild } from '../mongodb/EconomyItems'
import CooldownItem from '../mongodb/typings/classes/CooldownItem'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// (async() => {await (await eco.users.get('123', '123')).inventory.fetch()})().then(console.log)

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
    connection: {
        // connectionURI: 'mongodb://user:hannelbannel123@ac-s2jrfjk-shard-00-00.lame8ex.mongodb.net:27017,ac-s2jrfjk-shard-00-01.lame8ex.mongodb.net:27017,ac-s2jrfjk-shard-00-02.lame8ex.mongodb.net:27017/?ssl=true&replicaSet=atlas-12href-shard-0&authSource=admin&retryWrites=true&w=majority',
        connectionURI: 'mongodb+srv://replit:replit@cluster0.5nbla.mongodb.net/test',
        collectionName: 'economyTest',
        dbName: 'test'
    },

    updater: {
        checkUpdates: true,
        upToDateMessage: false
    },

    debug: true
})

eco.on('ready', async () => {
    // await eco.database.clear()
    // process.exit(0)

    let cachedGuild = eco.cache.guilds.get({ guildID: '1234' })
    let cachedUser = eco.cache.users.get({ memberID: '1234', guildID: '1234' })

    // if (!cachedGuild) {
    //     cachedGuild = await eco.guilds.create('1234')
    // }

    // if (!cachedUser) {
    //     cachedUser = await eco.users.create('1234', '1234')
    // }

    // console.log(cachedGuild, 'guild');

    // console.log(cachedGuild?.id, 'guildID')
    // console.log(cachedUser?.id, 'memberID')

    // await cachedUser.items.buy<CustomItemData>(1)

    const result = await eco.shop.buy<CustomItemData>(10, '1234', '1234')
    // console.log(result)

    console.log('length', (await cachedUser.inventory.all()).length)


    setTimeout(async () => {
        await cachedGuild.shop.addItem<CustomItemData>({
            name: 'test',
            price: 100,

            custom: {
                category: 'test',
                sellingPrice: 100,
                test: 'test'
            }
        })

        const cachedShop = eco.cache.shop.get<ShopItem<CustomItemData>>
            ({ guildID: cachedGuild.id })

        const cachedInventory = eco.cache.inventory.get<InventoryItem<CustomItemData>>
            ({ memberID: cachedUser.id, guildID: cachedGuild.id })
        const cachedHistory = eco.cache.history.get<HistoryItem<CustomItemData>>
            ({ memberID: cachedUser.id, guildID: cachedGuild.id })

        const cooldowns = eco.cache.cooldowns.get
            ({ memberID: cachedUser.id, guildID: cachedGuild.id })

        const balance = eco.cache.balance.get
            ({ memberID: cachedUser.id, guildID: cachedGuild.id })

        const bankBalance = eco.cache.bank.get
            ({ memberID: cachedUser.id, guildID: cachedGuild.id })


        const [money, bank] = [
            await eco.balance.get(cachedUser.id, cachedGuild.id),
            await eco.bank.get(cachedUser.id, cachedGuild.id)
        ]

        console.log({ money, bank }, 'balance')
        console.log(balance.money, balance.bank, 'cached balance')
        // console.log(eco.cache.cooldowns.cache, `cooldowns cache for ${cachedUser.guildID}, ${cachedUser.id}`)
        // console.log(!!cooldowns, 'cooldowns')

        // await cachedUser.rewards.getDaily()
        // await eco.inventory.addItem('Wood', '1234', 'Global', 1)
        // await cachedUser.rewards.getWork()
        // await cachedUser.rewards.getWeekly()

        // console.log(eco.cache.cooldowns.cache, `cooldowns cache for ${cachedUser.guildID}, ${cachedUser.id}`)
        // console.log(!!cooldowns, 'cooldowns')

        // const history = await cachedUser.history.get<CustomItemData>()

        // console.log(cachedInventory?.length, 'inventoryItem')
        // console.log(cachedHistory?.length, 'historyItem')
        // console.log(history?.length, 'historyItem in database')
        // console.log(cachedShop?.length, 'shopItem')

        // @tes-expect-error
        // console.log(eco.cache.history._cache)
    }, 1000)


    // console.log(eco.cache);
    // console.log('----------------------');

    // console.log(eco.cache.users.cache);
    // console.log(cachedUser);

    // cachedUser.inventory.clear()
    // cachedUser.history.clear()

    // process.exit(0)

    // @ @ts-expect-error
    // console.log(!!cachedUser.database);

    // console.dir(cachedInventory);
    // console.dir(Object.keys(cachedInventory))


    text()
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




// TODO



// DONE:

// + work rewards fix
// + sync 'dateLocale', 'sellingItemPercent', 'subtractOnBuy' with the guild settings
// + add the 'savePurchasesHistory' setting to the guild settings
// + cooldowns for each user
// + rewards for each user
// + support fpr .ts config file
// + shop, inventory and history fixes
// + leaderboards for each guild
// + settings for each guild
// + items for each user: move a buyItem method to a class and add more methods
// + improve settings typings
// + fix bugs
// + fix typings
// + mongodb support
// + quantity for inventory adding


