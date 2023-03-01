import Economy from '../../'
import SettingsTypes from '../typings/interfaces/SettingsTypes'

console.clear()

type SettingValueType<T extends keyof SettingsTypes> = SettingsTypes[T]
const a: SettingValueType<'dailyAmount'> = 23

const eco = new Economy({
    debug: true
})

eco.on('ready', () => {
    const guild = eco.guilds.find(guild => guild.id == '123')
    // const guild1 = eco.guilds.find(guild => guild.id == '1234')

    guild.settings.get('dailyAmount')

    guild.shop.addItem<CustomItemData>({
        name: 'test',
        price: 100,

        custom: {
            category: 'Test Item',
            test: '123',
            sellingPrice: 75
        }
    })

    const item = guild.shop.find(item => item.id == 1)

    item.setCustom<CustomItemData>({
        category: 'test',
        test: '321',
        sellingPrice: 455
    })

    const user = guild.users.find(user => user.id == '123')
    const inventory = user.inventory

    //user.balance.add(2000)

    // const boughtItem = user.buyItem(1)

    const inventoryArray = inventory.toArray()
    const leaderboard = guild.leaderboards.money()  // eco.balance.leaderboard('123')

    // console.log(guild.settings, guild.settings.all, guild.settings.set, guild.settings.get, guild.settings.remove, guild.settings.reset)

    // console.log(boughtItem)
    // console.log(inventoryArray)

    //guild.settings.set('dailyAmount', 1000)
    //guild.settings.set('dailyCooldown', 15000)

    console.log(user.rewards.getDaily(), user.balance.get(), leaderboard)
    console.log(inventoryArray.length)
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

// - mongodb support


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


