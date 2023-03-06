import readline from 'readline'
import { readFileSync } from 'fs'

import Economy from '../mongodb'

import ShopItem from '../typings/classes/ShopItem'
import SettingsTypes from '../typings/interfaces/SettingsTypes'
import DatabaseManager from '../mongodb/typings/managers/DatabaseManager'
import InventoryItem from '../mongodb/typings/classes/InventoryItem'

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

type SettingValueType<T extends keyof SettingsTypes> = SettingsTypes[T]
const a: SettingValueType<'dailyAmount'> = 23

const eco = new Economy({
    connection: {
        connectionURI: 'mongodb://sviinka:hannelbannel123@backupbot-shard-00-00.ehpa9.mongodb.net:27017,backupbot-shard-00-01.ehpa9.mongodb.net:27017,backupbot-shard-00-02.ehpa9.mongodb.net:27017/test?ssl=true&replicaSet=BackupBot-shard-0&authSource=admin&retryWrites=true&w=majority',
        collectionName: 'test123',
        dbName: 'test321'
    },

    debug: true
})

eco.on('ready', async () => {
    let guild = await eco.guilds.find(guild => guild.id == '123')

    // await guild.shop.clear()
    // await eco.database.clear()
    // process.exit(0)

    // await eco.database.add('test', 5)
    // console.log(await eco.database.fetch('test'), '!')

    console.log('guild', !!guild)


    if (!guild) {
        guild = await eco.guilds.create('123')
        console.log('guild', !!guild)
    }

    // const guild1 = eco.guilds.find(guild => guild.id == '1234')

    await guild.settings.set('workAmount', [5000, 10000])

    const dailyAmount = await guild.settings.get('workAmount')
    console.log(dailyAmount);


    await guild.shop.addItem<CustomItemData>({
        name: 'test',
        price: 100,

        custom: {
            category: 'Test Item',
            test: '123',
            sellingPrice: 75
        }
    })


    const shop = await guild.shop.all()
    const item = await guild.shop.find<ShopItem<CustomItemData>>(item =>
        item.custom.category == 'Test Item' ||
        item.custom.category == 'test123'
    )

    // const inventory123 = await user.inventory.fetch('')
    // console.log(items);

    if (item) {
        await item.setCustom<CustomItemData>({
            category: 'test123',
            test: '321',
            sellingPrice: 455
        })

        console.log(item.custom);
    } else console.log('item not found')


    let user = await guild.users.get('123') //.find(user => user.id == '123')
    console.log('user', !!user)

    if (!user) {
        user = await guild.users.create('123')
        console.log('user', !!user)
    }

    // const allUsers = await guild.users.all()
    // console.log('all guild users', allUsers.length)
    // console.log('all users', (await eco.users.all()).length)


    const shopItem = await guild.shop.findItem<CustomItemData>(1)

    const buyingResult = await user.items.buy(shopItem.id, 5, `buying the item ${shopItem.name}`)
    console.log(buyingResult)

    // console.log(eco.users.create.toString());

    // const user1 = await guild.users.get('123')
    const inventory = await user.inventory.fetch<CustomItemData>()

    console.log(inventory.length)
    console.log('items with id 1:', inventory.filter(x => x.id == 1).length);

    const result = await eco.inventory.sellItem(1, user.id, guild.id, 3, 'test') // 75 coins for each item
    console.log(result)



    console.log('shop', shop.length)
    console.log('inventory', inventory.map(x => x.id), inventory.length)

    console.log('user\'s balance:', await user.balance.get())

    eco


    // eco.balance.add(100, user.id, guild.id)

    // user.balance.add(2000)
    // console.log(await user.balance.get());


    // const boughtItem = user.buyItem(1)

    // const inventoryArray = await inventory.toArray()
    // const leaderboard = await guild.leaderboards.money()  // eco.balance.leaderboard('123')

    // console.log(guild.settings, guild.settings.all, guild.settings.set, guild.settings.get, guild.settings.remove, guild.settings.reset)

    // console.log(boughtItem)
    // console.log(inventoryArray)

    //guild.settings.set('dailyAmount', 1000)
    //guild.settings.set('dailyCooldown', 15000)

    // console.log(await user.rewards.getWork(), await user.balance.get(), leaderboard)
    // console.log(inventoryArray.length)

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


