import readline from 'readline'
import Economy from '../mongodb'

import { ShopItem, InventoryItem, HistoryItem } from '../mongodb/EconomyItems'


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
    connection: {
        // connectionURI: 'mongodb+srv://replit:replit@cluster0.5nbla.mongodb.net/test',
        connectionURI: 'mongodb://user:hannelbannel123@ac-s2jrfjk-shard-00-00.lame8ex.mongodb.net:27017,ac-s2jrfjk-shard-00-01.lame8ex.mongodb.net:27017,ac-s2jrfjk-shard-00-02.lame8ex.mongodb.net:27017/?ssl=true&replicaSet=atlas-12href-shard-0&authSource=admin&retryWrites=true&w=majority',
        collectionName: 'economyTest',
        dbName: 'test'
    },

    updater: {
        checkUpdates: true,
        upToDateMessage: false
    },

    // @ts-expect-error
    test123: 'test123',

    debug: true
})

eco.on('ready', async () => {
    setTimeout(async () => {
        // await eco.database.clear()
        // process.exit(0)
        const guild = eco.cache.guilds.get({ guildID: '321' })
        const user = eco.cache.users.get({ memberID: '123', guildID: '321' })

        // const inventory = eco.cache.inventory.get<InventoryItem<CustomItemData>>({ memberID: user.id, guildID: guild.id })[0]

        // const a = await eco.inventory.stack<CustomItemData>(1, '213123', 'dasdasd')
        // const a1 = await user.items.stack<CustomItemData>(1)
        // const a2 = await inventory.stack()

        // a.item.custom
        // a1.item.custom
        // a2.item.custom

        const addItem = async (name: string, price: number, description?: string, printConsoleTime?: boolean): Promise<ShopItem<any>> => {
            const add = () => guild.shop.add({
                name,
                price,
                description
            })

            // const guild = await eco.guilds.get('')

            // const test = await guild.shop.find<ShopItem<CustomItemData>>(item => item.id == 123)
            // const test1 = await guild.shop.findItem<CustomItemData>(123)

            // test.custom
            // test1.custom

            // const test2 = await eco.shop.all<CustomItemData>('')
            // const test3 = await guild.shop.all<CustomItemData>()

            // test2[0].custom
            // test3[0].custom

            // const inventory = await eco.inventory.get<CustomItemData>('', '')

            // inventory.map((item, index) => {
            //     const stackedItem = item.stack()

            //     const entry =
            //         `${index + 1} - **x${stackedItem.quantity} ${stackedItem.item.name}** - ` +
            //         `${stackedItem.totalPrice} coins in total`

            //     return entry
            // })

            if (printConsoleTime) {
                console.time(`"${name}" item adding time`)
                const result = await add()
                console.timeEnd(`"${name}" item adding time`)

                return result
            }

            const result = await add()
            return result
        }

        const buyItem = async (itemID: number, quantity?: number, printConsoleTime?: boolean): Promise<void> => {
            const buy = () => user.items.buy(itemID, quantity)

            if (printConsoleTime) {
                console.time(`item ${itemID} buying time`)
                await buy()
                console.timeEnd(`item ${itemID} buying time`)
            }
        }

        // eco.cache.users.get({
        //     memberID: '123',
        //     guildID: '123'
        // }).balance.currency('$').get()


        // const daily = await user.rewards.getDaily<false>()
        // console.log(daily)

        // const work = await user.rewards.getWork<true>()
        // console.log(work)

        // const leaderboard = await guild.leaderboards.money()
        // console.log(leaderboard)

        // const balance = eco.cache.balance.get({ memberID: '123', guildID: '321' })
        // console.log(balance);




        // console.log(eco.options)


        // console.time('daily1')
        // const daily = await user.rewards.getDaily()
        // console.timeEnd('daily1')

        // console.time('daily2')
        // const daily1 = await user.rewards.getDaily()
        // console.timeEnd('daily2')

        // console.log(user);
        // console.log(daily, daily1);

        // addItem('test', 100, 'test item', true)
        // buyItem(1, 1, true)

        // console.time('inventory')
        // const inventory = await user.inventory.all()
        // console.timeEnd('inventory')

        // console.log('inventory', inventory)
        // console.log(await user.balance.get())
    }, 2000)

    text()
})


type CustomItemData = {
    category: string
    test: string
    sellingPrice: number
}
