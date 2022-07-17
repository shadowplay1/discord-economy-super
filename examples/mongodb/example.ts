// !!!

// This bot is an one-file and all-in-one example bot for Economy usage that shows the main things that
// you can do with discord-economy-super.

// It uses the prefix commands (not slash commands) and is made on discord.js v14.
// It has no permissions restrictions and won't be remade on a slash commands or a multiple-file bot.

// This bot is meant to test the module and show how to use the Economy module and
// might help you with any Economy-related questions.

// The bot is 100% works but it's recommended to remake it on
// slash commands and/or separate the code in a multiple files.

// This bot's code can be used in your code in any way without any restrictions.
// Enjoy!


// - shadowplay1


// Contacts:

// Discord - ShadowPlay#6072
// Support Server - https://discord.gg/4pWKq8vUnb

// !!!


// @ts-expect-error
import { Client, ActivityType } from 'discord.js'

import Economy from '../../mongodb'//'discord-economy-super'

import InventoryItem from '../../mongodb/typings/classes/InventoryItem'
import ShopItem from '../../mongodb/typings/classes/ShopItem'



const client = new Client({
    intents: [
        'GuildMembers',
        1 << 15 // message content intent
    ]
})

let eco = new Economy<true>({
    connection: {
        connectionURI: 'your connection string',
        dbName: 'dbName',
        collectionName: 'collectionName'
    },

    dailyAmount: 100,
    workAmount: [50, 200],
    weeklyAmount: 5000
})

const getUser = (userID: string) => client.users.cache.get(userID)


client.on('messageCreate', async message => {
    const prefix = '!'

    const messageContent: string = message.content
    const splittedMessage = messageContent.trim().split(' ')

    const command = prefix + splittedMessage[0]
    const args = splittedMessage.slice(1)

    let guild = eco.cache.guilds.get({
        guildID: message.guild.id
    })

    let user = eco.cache.users.get({
        memberID: message.author.id,
        guildID: message.guild.id
    })

    if (!guild) {
        guild = await eco.guilds.create(message.guild.id)
    }

    if (!user) {
        user = await guild.users.create(message.author.id)
    }


    if (command == prefix + 'help') {
        message.channel.send(
            `${message.author}. here's the help for this bot [**26 commands**]:\n\n` +

            `${prefix}help - shows this message\n` +
            `${prefix}balance [user] - shows your or [user]'s balance\n` +
            `${prefix}leaderboard - shows the money leaderboard\n\n` +

            `${prefix}transfer <user> <amount> - transfers <amount> to <user>\n\n` +

            `${prefix}daily - gets your daily reward\n` +
            `${prefix}work - gets your work reward\n` +
            `${prefix}weekly - gets your weekly reward\n\n` +

            `${prefix}deposit <amount> - deposits <amount> to your balance\n` +
            `${prefix}withdraw <amount> - withdraws <amount> from your balance\n\n` +

            `${prefix}shop - shows the available items in the shop\n` +
            `${prefix}shop_buy <item> [quantity] - buys X items from the shop\n` +
            `${prefix}shop_sell <item> [quantity] - sells X items to the shop\n\n` +

            `${prefix}shop_add <name> <emoji> <price> [description] [messageOnUse] - adds an item to the shop\n` +
            `${prefix}shop_remove <item> - removes an item from the shop\n` +
            `${prefix}shop_edit <item> <itemProperty> <newValue> - edits an item in the shop\n\n` +

            `${prefix}shop_find <item> - shows all the info about specified item\n` +
            `${prefix}shop_use <inventoryItem> - uses the item from the inventory\n\n` +

            `${prefix}shop_clear - clears the shop\n\n` +

            `${prefix}inventory - shows your inventory\n` +
            `${prefix}inventory_clear - clears your inventory\n\n` +

            `${prefix}history - shows your purchases history\n` +
            `${prefix}history_clear - clears your purchases history\n\n` +

            `${prefix}shop_hide <item> - hides an item from the shop\n` +
            `${prefix}shop_show <item> - shows an item in the shop\n\n` +

            `${prefix}shop_lock <item> - locks an item in the shop\n` +
            `${prefix}shop_unlock <item> - unlocks an item in the shop`
        )
    }

    if (command == prefix + 'balance') {
        const [userID] = args
        const guild = await eco.guilds.get(message.guild.id)

        const user = await guild.users.get(
            message.mentions.users.first()?.id ||
            message.guild.users.get(userID) ||
            message.author.id
        )

        const [balance, bank] = [
            await user.balance.get(),
            await user.bank.get()
        ]

        message.channel.send(
            `${message.author}'s balance:\n` +
            `Coins: **${balance}**.\n` +
            `Coins in bank: **${bank}**.`
        )
    }


    if (command == prefix + 'daily') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const dailyResult = await user.rewards.getDaily<false>()

        if (dailyResult.cooldown) {
            return message.channel.send(
                `${message.author}, you can claim your daily reward in ${dailyResult.cooldown.pretty}.`
            )
        }

        message.channel.send(
            `${message.author}, you claimed your **${dailyResult.reward}** daily coins!`
        )
    }

    if (command == prefix + 'work') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const workResult = await user.rewards.getWork<true>()

        if (workResult.cooldown) {
            return message.channel.send(
                `${message.author}, you can work again in ${workResult.cooldown.pretty}.`
            )
        }

        message.channel.send(
            `${message.author}, you worked hard and earned **${workResult.reward}** coins!`
        )
    }

    if (command == prefix + 'weekly') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const weeklyResult = await user.rewards.getWeekly<true>()

        if (weeklyResult.cooldown) {
            return message.channel.send(
                `${message.author}, you can claim your weekly reward in ${weeklyResult.cooldown.pretty}.`
            )
        }

        message.channel.send(
            `${message.author}, you claimed your **${weeklyResult.reward}** weekly coins!`
        )
    }


    if (command == prefix + 'transfer') {
        const [userID, amountString] = args
        const amount = parseInt(amountString)

        const user = (message.members.mentions.first() ||
            message.guild.users.get(userID) ||
            message.guild.members.find(
                member => member.user.username.toLowerCase() == userID.toLowerCase()
            ))

        const guild = await eco.guilds.get(message.guild.id)

        const sender = await guild.users.get(message.author.id)
        const receiver = await guild.users.get(user.id)

        const senderBalance = await sender.balance.get()

        if (!user) {
            return message.channel.send(`${message.author}, user not found.`)
        }

        if (senderBalance < amount) {
            return message.channel.send(
                `${message.author}, you don't have enough coins` +
                `to perform this transfer.`
            )
        }

        const transferringResult = await receiver.balance.transfer({
            amount,
            senderMemberID: message.author.id,

            sendingReason: `transferred ${amount} coins to ${user.tag}.`,
            receivingReason: `received ${amount} coins from ${message.author.tag}.`
        })

        message.channel.send(
            `${message.author}, you transferred **${transferringResult.amount}** ` +
            `coins to ${user}.`
        )
    }

    if (command == prefix + 'deposit') {
        const [amountString] = args
        const amount = parseInt(amountString)

        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const userBalance = await user.balance.get()

        if (userBalance < amount) {
            return message.channel.send(
                `${message.author}, you don't have enough coins` +
                `to perform this deposit.`
            )
        }

        await user.balance.subtract(amount, `depositted ${amount} coins`)
        await user.bank.add(amount, `depositted ${amount} coins`)

        message.channel.send(
            `${message.author}, you deposited **${amount}** coins to your bank.`
        )
    }

    if (command == prefix + 'withdraw') {
        const [amountString] = args
        const amount = parseInt(amountString)

        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const userBankBalance = await user.bank.get()

        if (userBankBalance < amount) {
            return message.channel.send(
                `${message.author}, you don't have enough coins` +
                `in your bank to perform this withdraw.`
            )
        }

        await user.bank.subtract(amount, `withdrew ${amount} coins`)
        await user.balance.add(amount, `withdrew ${amount} coins`)

        message.channel.send(
            `${message.author}, you withdrew **${amount}** coins from your bank.`
        )
    }


    if (command == prefix + 'leaderboard') {
        const guild = await eco.guilds.get(message.guild.id)
        const leaderboard = await guild.leaderboards.balance()

        if (!leaderboard.length) {
            return message.channel.send(`${message.author}, there are no users in the leaderboard.`)
        }

        message.channel.send(
            `Money Leaderboard **[${leaderboard.length}]**:\n\n` +
            `${leaderboard
                .map((lb, index) => `${index + 1} - <@${lb.userID}> - **${lb.money}** coins`)
                .join('\n')}`
        )
    }


    if (command == prefix + 'shop') {
        const guild = await eco.guilds.get(message.guild.id)

        const allShop = await guild.shop.all<CustomItemData>()
        const shop = allShop.filter(item => !item.custom.hidden)

        if (!shop.length) {
            return message.channel.send(`${message.author}, there are no items in the shop.`)
        }

        message.channel.send(
            `Shop **[${shop.length} items]**:\n\n` +

            `${shop
                .map((item, index) =>
                    `#${index + 1} - ${item.custom.locked ? '🔒' : ''} ${item.custom.emoji} ` +
                    `**${item.name}** (ID: **${item.id}**) - **${item.price}** coins`)
                .join('\n')}`
        )
    }

    if (command == prefix + 'shop_find') {
        const guild = await eco.guilds.get(message.guild.id)

        const [itemID] = args
        const item = await guild.shop.find<ShopItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        message.channel.send(
            `**${item.custom.emoji} ${item.name}** - Item Info:\n\n` +

                `Name: ${item.name}\n` +
                `ID: **${item.id}**\n` +
                `Emoji: ${item.custom.emoji}\n\n` +

                `Price: **${item.price}** coins\n` +
                `Description: **${item.description}**` +
                `Max quantity in inventory: **${item.maxAmount}**\n\n` +

                item.role ? `Role: **<@&${item.role}>**\n` : '' +
                `Hidden: **${item.custom.hidden ? 'Yes' : 'No'}**\n` +
                `Locked: **${item.custom.locked ? 'Yes' : 'No'}**\n\n` +

                `Message on use: **${item.message}**\n` +
            `Created at: **${item.date}**`
        )
    }


    if (command == prefix + 'shop_add') {
        const guild = await eco.guilds.get(message.guild.id)
        const [name, emoji, priceString, description, messageOnUse] = args

        const price = parseInt(priceString)

        if (!name) {
            return message.channel.send(`${message.author}, please provide a name for the item.`)
        }

        if (!emoji) {
            return message.channel.send(`${message.author}, please provide an emoji for the item.`)
        }

        if (!price) {
            return message.channel.send(`${message.author}, please provide a price for the item.`)
        }

        const newItem = await guild.shop.addItem<CustomItemData>({
            name,
            price,
            description,
            message: messageOnUse,

            custom: {
                emoji,
                hidden: false,
                locked: false
            }
        })

        message.channel.send(
            `${message.author}, you added **${newItem.name}** for **${newItem.price}** coins to the shop.`
        )
    }

    if (command == prefix + 'shop_remove') {
        const [itemID] = args
        const guild = await eco.guilds.get(message.guild.id)

        const item = await guild.shop.find<ShopItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        await item.delete()

        message.channel.send(
            `${message.author}, you removed **${item.name}** from the shop.`
        )
    }

    if (command == prefix + 'shop_edit') {
        const itemProperties = ['description', 'price', 'name', 'message', 'maxAmount', 'role']
        const [itemID, itemProperty, newValue] = args

        const guild = await eco.guilds.get(message.guild.id)
        const item = await guild.shop.find<ShopItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (!itemProperty) {
            return message.channel.send(
                `${message.author}, please provide an item property to change. ` +
                `Valid item properties are: ${itemProperties.map(prop => `\`${prop}\``).join(', ')}`
            )
        }

        if (!itemProperties.includes(itemProperty)) {
            return message.channel.send(
                `${message.author}, item property you specified is not valid. ` +
                `Valid item properties are: ${itemProperties.map(prop => `\`${prop}\``).join(', ')}`
            )
        }

        if (!newValue) {
            return message.channel.send(`${message.author}, please provide a new value for the item property.`)
        }

        await item.edit<any, any>(itemProperty as any, newValue)

        message.channel.send(
            `${message.author}, you changed **${item.name}**'s **${itemProperty}** to **${newValue}**.`
        )
    }


    if (command == prefix + 'shop_hide') {
        const [itemID] = args
        const guild = await eco.guilds.get(message.guild.id)

        const item = await guild.shop.find<ShopItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (item.custom.hidden) {
            return message.channel.send(`${message.author}, item is already hidden.`)
        }

        await item.setCustom<CustomItemData>({
            emoji: item.custom.emoji,
            hidden: true,
            locked: item.custom.locked
        })

        message.channel.send(
            `${message.author}, you hid the item **${item.name}** from the shop.`
        )
    }

    if (command == prefix + 'shop_show') {
        const [itemID] = args
        const guild = await eco.guilds.get(message.guild.id)

        const item = await guild.shop.find<ShopItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (!item.custom.hidden) {
            return message.channel.send(`${message.author}, item is already visible.`)
        }

        await item.setCustom<CustomItemData>({
            emoji: item.custom.emoji,
            hidden: false,
            locked: item.custom.locked
        })

        message.channel.send(
            `${message.author}, item **${item.name}** is now visible in the shop.`
        )
    }


    if (command == prefix + 'shop_lock') {
        const [itemID] = args
        const guild = await eco.guilds.get(message.guild.id)

        const item = await guild.shop.find<ShopItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`${message.author}, item is already locked.`)
        }

        await item.setCustom<CustomItemData>({
            emoji: item.custom.emoji,
            hidden: item.custom.hidden,
            locked: true
        })

        message.channel.send(
            `${message.author}, you locked the item **${item.name}** in the shop.`
        )
    }

    if (command == prefix + 'shop_unlock') {
        const [itemID] = args
        const guild = await eco.guilds.get(message.guild.id)

        const item = await guild.shop.find<ShopItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (!item.custom.locked) {
            return message.channel.send(`${message.author}, item is already unlocked.`)
        }

        await item.setCustom<CustomItemData>({
            emoji: item.custom.emoji,
            hidden: item.custom.hidden,
            locked: false
        })

        message.channel.send(
            `${message.author}, you unlocked the item **${item.name}** in the shop.`
        )
    }


    if (command == prefix + 'shop_clear') {
        const guild = await eco.guilds.get(message.guild.id)
        guild.shop.clear()

        message.channel.send(
            `${message.author}, you cleared the shop.`
        )
    }


    if (command == prefix + 'inventory') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const allInventory = await user.inventory.all<CustomItemData>()
        const inventory = allInventory.filter(item => !item.custom.hidden)

        if (!inventory.length) {
            return message.channel.send(`${message.author}, you don't have any items in your inventory.`)
        }

        message.channel.send(
            `${message.author}, here's your inventory [**${inventory.length} items**]:\n\n` +
            inventory
                .map(
                    item => `${item.custom.emoji} **${item.name}** (ID: **${item.id}**) ` +
                        `for **${item.price}** coins (**${item.date}**)`
                )
                .join('\n')
        )
    }

    if (command == prefix + 'inventory_clear') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const inventory = await user.inventory.all<CustomItemData>()

        if (!inventory.length) {
            return message.channel.send(`${message.author}, you don't have any items in your inventory.`)
        }

        await user.inventory.clear()

        message.channel.send(
            `${message.author}, cleared ${inventory.length} items from your inventory.`
        )
    }


    if (command == prefix + 'history') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const allHistory = await user.history.all<CustomItemData>()
        const history = allHistory.filter(item => !item.custom.hidden)

        if (!history.length) {
            return message.channel.send(`${message.author}, you don't have any items in your purchases history.`)
        }

        message.channel.send(
            `${message.author}, here's your purchases history [**${history.length} items**]:\n\n` +
            history
                .map(
                    item => `${item.custom.emoji} **${item.name}** - ` +
                        `**${item.price}** coins (**${item.date}**)`
                )
                .join('\n')
        )
    }

    if (command == prefix + 'history_clear') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const history = await user.history.all<CustomItemData>()

        if (!history.length) {
            return message.channel.send(`${message.author}, you don't have any items in your purchases history.`)
        }

        await user.history.clear()

        message.channel.send(
            `${message.author}, cleared ${history.length} items from your purchases history.`
        )
    }


    if (command == prefix + 'shop_buy') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const [itemID, quantityString] = args
        const quantity = parseInt(quantityString) || 1

        const item = await guild.shop.find<ShopItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`${message.author}, this item is locked - you cannot buy it.`)
        }

        if (!item.isEnoughMoneyFor(message.author.id, quantity)) {
            return message.channel.send(
                `${message.author}, you don't have enough coins to buy ` +
                `**x${quantity} ${item.custom.emoji} ${item.name}**.`
            )
        }

        const buyingResult = await user.items.buy<CustomItemData>(item.id, quantity)

        if (!buyingResult.status) {
            return message.channel.send(`${message.author}, failed to buy the item: ${buyingResult.message}`)
        }

        message.channel.send(
            `${message.author}, you bought **x${buyingResult.quantity} ` +
            `${item.custom.emoji} ${item.name}** for **${buyingResult.totalPrice}** coins.`
        )
    }

    if (command == prefix + 'shop_use') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const [itemID] = args
        const item = await user.inventory.find<InventoryItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item in your inventory.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found in your inventory.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`${message.author}, this item is locked - you cannot use it.`)
        }

        const resultMessage = await item.use(client)
        message.channel.send(resultMessage)
    }

    if (command == prefix + 'shop_sell') {
        const guild = await eco.guilds.get(message.guild.id)
        const user = await guild.users.get(message.author.id)

        const [itemID, quantityString] = args
        const quantity = parseInt(quantityString) || 1

        const item = await user.inventory.find<InventoryItem<CustomItemData>>(
            item => item.id == parseInt(itemID) || item.name == itemID
        )

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item in your inventory.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found in your inventory.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`${message.author}, this item is locked - you cannot sell it.`)
        }

        const sellingResult = await user.items.sell<CustomItemData>(item.id, quantity)

        if (!sellingResult.status) {
            return message.channel.send(`${message.author}, failed to sell the item: ${sellingResult.message}`)
        }

        message.channel.send(
            `${message.author}, you sold **x${sellingResult.quantity} ` +
            `${item.custom.emoji} ${item.name}** for **${sellingResult.totalPrice}** coins.`
        )
    }
})


client.on('ready', () => {
    console.log(`${client.user.tag} is ready!`)

    client.user.setActivity('It\'s me!', {
        type: ActivityType.Streaming,
        url: 'https://twitch.tv/shadowplay1'
    })
})


// core events
eco.on('ready', economy => {
    console.log('Economy is ready!')
    eco = economy
})

eco.on('destroy', () => {
    console.log('Economy is destroyed.')
})


// balance events
eco.on('balanceSet', data => {
    console.log(`Set ${data.amount} coins for ${getUser(data.memberID).tag}.`)
})

eco.on('balanceAdd', data => {
    console.log(`Added ${data.amount} coins to ${getUser(data.memberID).tag}}.`)
})

eco.on('balanceSubtract', data => {
    console.log(`Subtracted ${data.amount} coins for ${getUser(data.memberID).tag}}.`)
})


// bank events
eco.on('bankSet', data => {
    console.log(`Set ${data.amount} coins in ${getUser(data.memberID).tag}}'s bank.`)
})

eco.on('bankAdd', data => {
    console.log(`Added ${data.amount} coins to ${getUser(data.memberID).tag}}'s bank.`)
})

eco.on('bankSubtract', data => {
    console.log(`Subtracted ${data.amount} coins from ${getUser(data.memberID).tag}}'s bank.`)
})


// shop events
eco.on('shopClear', cleared => {
    if (cleared) console.log('The shop was cleared successfully!')
    else console.log('The shop was not cleared!')
})

eco.on('shopItemAdd', item => {
    console.log(`Added item "${item.name}" to the shop.`)
})

eco.on('shopItemBuy', data => {
    console.log(
        `${getUser(data.boughtBy).tag} has bought item "${data.item.name}"` +
        `for ${data.item.price} coins.`
    )
})


eco.on('shopItemEdit', data => {
    console.log(
        `Edited item "${data.changedProperty}" property in item ${data.item.name} in the shop. ` +
        `Value before change: "${data.oldValue}". Value after change: "${data.newValue}".`
    )
})

eco.on('shopItemUse', data => {
    console.log(`${getUser(data.usedBy).tag} has used the item "${data.item.name}".`)
})


client.login('token')


interface CustomItemData {
    emoji: string
    hidden: boolean
    locked: boolean
}