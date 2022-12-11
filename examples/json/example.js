// !!!

// This bot is an one-file and all-in-one example bot for Economy usage that shows the main things that
// you can do with discord-economy-super.

// It includes 32 economy commands, such as `daily`, `weekly`, `work`, `balance`, etc.
// Also included the full shop/inventory system in this bot.

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


const config = require('./config')
const { Client, ActivityType, OAuth2Scopes } = require('discord.js')

const Economy = require('discord-economy-super')


const client = new Client({
    intents: ['GuildMembers', 'GuildMessages', 'Guilds', 'MessageContent']
})

let eco = new Economy({
    dailyAmount: 100,
    workAmount: [50, 200],
    weeklyAmount: 5000
})


const getUser = userID => client.users.cache.get(userID)

client.on('messageCreate', async message => {
    const prefix = '!'

    const messageContent = message.content
    const splittedMessage = messageContent.trim().split(' ')

    const command = splittedMessage[0]
    const args = splittedMessage.slice(1)

    let guild = eco.guilds.get(message.guild.id)
    let user = eco.users.get(message.author.id, message.guild.id)

    const userID = message.mentions.members?.first()?.id ||
        message.guild.members.cache.find(member => member.user.username == args[0])?.id
        || getUser(args[0])?.id

    let argumentUser = eco.users.get(userID, message.guild.id)


    const shop = eco.shop.get(message.guild.id) || []

    const inventory = eco.inventory.get(message.author.id, message.guild.id) || []
    const history = eco.history.get(message.author.id, message.guild.id) || []

    if (message.author.bot) return

    if (userID && !argumentUser) {
        argumentUser = eco.users.create(userID, message.guild.id)
    }

    if (!guild) {
        guild = eco.guilds.create(message.guild.id)
    }

    if (!user) {
        const ecoUser = eco.users.get(message.author.id, message.guild.id)

        if (ecoUser) {
            user = ecoUser
            return
        }

        user = guild.users.create(message.author.id)
    }


    if (command == prefix + 'help') {
        message.channel.send(
            `${message.author}, here's the help for this bot [**32 commands**]:\n\n` +

            `\`${prefix}help\` - shows this message\n` +
            `\`${prefix}ping\` - shows the latencies of the bot\n` +
            `\`${prefix}invite\` - shows the link to invite this bot\n\n` +

            `\`${prefix}money_add <user> <amount>\` - adds the coins to specified user\n` +
            `\`${prefix}money_subtract <user> <amount | all>\` - subtracts the coins from specified user\n\n` +

            `\`${prefix}balance [user]\` - shows your or [user]'s balance\n` +
            `\`${prefix}leaderboard\` - shows the money leaderboard\n\n` +

            `\`${prefix}transfer <user> <amount | all>\` - transfers <amount> to <user>\n\n` +

            `\`${prefix}daily\` - gets your daily reward\n` +
            `\`${prefix}work\` - gets your work reward\n` +
            `\`${prefix}weekly\` - gets your weekly reward\n\n` +

            `\`${prefix}deposit <amount | all>\` - deposits <amount> to your balance\n` +
            `\`${prefix}withdraw <amount | all>\` - withdraws <amount> from your balance\n\n` +

            `\`${prefix}shop\` - shows the available items in the shop\n` +
            `\`${prefix}shop_buy <item> [quantity]\` - buys X items from the shop\n` +
            `\`${prefix}shop_sell <item> [quantity]\` - sells X items to the shop\n\n` +

            `\`${prefix}shop_add <name> <emoji> <price> [messageOnUse]\` - adds an item to the shop\n` +
            `\`${prefix}shop_remove <item>\` - removes an item from the shop\n` +
            `\`${prefix}shop_edit <item> <itemProperty> <newValue>\` - edits an item in the shop\n\n` +

            `\`${prefix}shop_find <item>\` - shows all the info about specified item\n` +
            `\`${prefix}shop_use <inventoryItem>\` - uses the item from the inventory\n\n` +

            `\`${prefix}shop_clear\` - clears the shop\n\n` +

            `\`${prefix}inventory\` - shows your inventory\n` +
            `\`${prefix}inventory_clear\` - clears your inventory\n\n` +

            `\`${prefix}history\` - shows your purchases history\n` +
            `\`${prefix}history_clear\` - clears your purchases history\n\n` +

            `\`${prefix}shop_hide <item>\` - hides an item from the shop\n` +
            `\`${prefix}shop_hidden\` - shows the hidden items\n` +
            `\`${prefix}shop_show <item>\` - shows an item in the shop\n\n` +

            `\`${prefix}shop_lock <item>\` - locks an item in the shop\n` +
            `\`${prefix}shop_locked\` - shows the locked items\n` +
            `\`${prefix}shop_unlock <item>\` - unlocks an item in the shop`
        )
    }

    if (command == prefix + 'ping') {
        const msg = await message.channel.send('Pinging...')
        const editingLatency = msg.createdTimestamp - message.createdTimestamp

        msg.edit(
            '🏓 | **__Core:__**\n' +
            `Bot Latency: **${editingLatency}ms**\n` +
            `WebSocket latency: **${client.ws.ping}ms**`
        )
    }

    if (command == prefix + 'invite') {
        const inviteLink = client.generateInvite({
            permissions: ['Administrator'],
            scopes: [OAuth2Scopes.Bot]
        })

        message.channel.send(
            `${message.author}, here's the link to invite this bot:\n\n${inviteLink}`
        )
    }


    if (command == prefix + 'money_add') {
        const [userID] = args
        const user = message.mentions.users.first() || getUser(userID)

        if (!userID) {
            return message.channel.send(
                `${message.author}, please specify a user to add money to.`
            )
        }

        if (!user) {
            return message.channel.send(
                `${message.author}, user not found.`
            )
        }

        const amount = parseInt(args[1])

        if (!amount) {
            return message.channel.send(
                `${message.author}, please specify an amount to add.`
            )
        }

        if (isNaN(amount)) {
            return message.channel.send(
                `${message.author}, please specify a valid amount number.`
            )
        }


        argumentUser.balance.add(amount)

        message.channel.send(
            `${message.author}, successfully added **${amount}** coins to **${user}**'s balance.`
        )
    }

    if (command == prefix + 'money_subtract') {
        const [userID] = args
        const user = message.mentions.users.first() || getUser(userID)

        if (!userID) {
            return message.channel.send(
                `${message.author}, please specify a user to subtract money from.`
            )
        }

        if (!user) {
            return message.channel.send(
                `${message.author}, user not found.`
            )
        }

        const userBalance = argumentUser.balance.get() || 0
        const amount = args[1] == 'all' ? userBalance : parseInt(args[1])

        if (!amount) {
            return message.channel.send(
                `${message.author}, please specify an amount to subtract.`
            )
        }

        if (isNaN(amount)) {
            return message.channel.send(
                `${message.author}, please specify a valid amount number.`
            )
        }


        argumentUser.balance.subtract(amount)

        message.channel.send(
            `${message.author}, successfully subtracted **${amount}** coins from **${user}**'s balance.`
        )
    }


    if (command == prefix + 'balance') {
        const [userID] = args

        const member =
            message.mentions.users.first() ||
            getUser(userID)


        const economyUser = member ? argumentUser : user

        const [balance, bank] = [
            economyUser.balance.get(),
            economyUser.bank.get(),
        ]

        message.channel.send(
            `${getUser(economyUser.id)}'s balance:\n` +
            `Coins: **${balance || 0}**.\n` +
            `Coins in bank: **${bank || 0}**.`
        )
    }


    if (command == prefix + 'daily') {
        const dailyResult = user.rewards.getDaily()

        if (dailyResult.cooldown) {
            const cooldownTime = dailyResult.cooldown.time

            const cooldownTimeString =
                `${cooldownTime.days ? `**${cooldownTime.days}** days, ` : ''}` +

                `${cooldownTime.days || cooldownTime.hours ?
                    `**${cooldownTime.hours}** hours, `
                    : ''}` +

                `${cooldownTime.hours || cooldownTime.minutes ?
                    `**${cooldownTime.minutes}** minutes, ` :
                    ''}` +
                `**${cooldownTime.seconds}** seconds`


            return message.channel.send(
                `${message.author}, you can claim your daily reward in ${cooldownTimeString}.`
            )
        }

        message.channel.send(
            `${message.author}, you claimed your **${dailyResult.reward}** daily coins!`
        )
    }

    if (command == prefix + 'work') {
        const workResult = user.rewards.getWork()

        if (workResult.cooldown) {
            const cooldownTime = workResult.cooldown.time

            const cooldownTimeString =
                `${cooldownTime.days ? `**${cooldownTime.days}** days, ` : ''}` +

                `${cooldownTime.days || cooldownTime.hours ?
                    `**${cooldownTime.hours}** hours, `
                    : ''}` +

                `${cooldownTime.hours || cooldownTime.minutes ?
                    `**${cooldownTime.minutes}** minutes, ` :
                    ''}` +
                `**${cooldownTime.seconds}** seconds`


            return message.channel.send(
                `${message.author}, you can work again in ${cooldownTimeString}.`
            )
        }

        message.channel.send(
            `${message.author}, you worked hard and earned **${workResult.reward}** coins!`
        )
    }

    if (command == prefix + 'weekly') {
        const weeklyResult = user.rewards.getWeekly()

        if (weeklyResult.cooldown) {
            const cooldownTime = weeklyResult.cooldown.time

            const cooldownTimeString =
                `${cooldownTime.days ? `**${cooldownTime.days}** days, ` : ''}` +

                `${cooldownTime.days || cooldownTime.hours ?
                    `**${cooldownTime.hours}** hours, `
                    : ''}` +

                `${cooldownTime.hours || cooldownTime.minutes ?
                    `**${cooldownTime.minutes}** minutes, ` :
                    ''}` +
                `**${cooldownTime.seconds}** seconds`


            return message.channel.send(
                `${message.author}, you can claim your weekly reward in ${cooldownTimeString}.`
            )
        }

        message.channel.send(
            `${message.author}, you claimed your **${weeklyResult.reward}** weekly coins!`
        )
    }


    if (command == prefix + 'transfer') {
        const [id, amountString] = args

        const sender = user
        const receiver = argumentUser

        const senderBalance = sender.balance.get()
        const amount = amountString == 'all' ? senderBalance : parseInt(amountString)

        if (!id) {
            return message.channel.send(
                `${message.author}, please specify a user to transfer coins to.`
            )
        }

        if (!userID) {
            return message.channel.send(`${message.author}, user not found.`)
        }

        if (!amount) {
            return message.channel.send(
                `${message.author}, please specify an amount of coins to transfer.`
            )
        }

        if (senderBalance < amount) {
            return message.channel.send(
                `${message.author}, you don't have enough coins` +
                'to perform this transfer.'
            )
        }

        const transferingResult = receiver.balance.transfer({
            amount,
            senderMemberID: message.author.id,

            sendingReason: `transfered ${amount} coins to ${getUser(argumentUser.id).tag}.`,
            receivingReason: `received ${amount} coins from ${message.author.tag}.`
        })

        message.channel.send(
            `${message.author}, you transfered **${transferingResult.amount}** ` +
            `coins to ${getUser(argumentUser.id)}.`
        )
    }


    if (command == prefix + 'deposit') {
        const [amountString] = args

        const userBalance = user.balance.get()
        const amount = amountString == 'all' ? userBalance : parseInt(amountString)

        if (userBalance < amount || !userBalance) {
            return message.channel.send(
                `${message.author}, you don't have enough coins ` +
                'to perform this deposit.'
            )
        }

        user.balance.subtract(amount, `depositted ${amount} coins`)
        user.bank.add(amount, `depositted ${amount} coins`)

        message.channel.send(
            `${message.author}, you depositted **${amount}** coins to your bank.`
        )
    }

    if (command == prefix + 'withdraw') {
        const [amountString] = args

        const userBankBalance = user.bank.get()
        const amount = amountString == 'all' ? userBankBalance : parseInt(amountString)

        if (userBankBalance < amount || !userBankBalance) {
            return message.channel.send(
                `${message.author}, you don't have enough coins ` +
                'in your bank to perform this withdraw.'
            )
        }

        user.balance.add(amount, `withdrew ${amount} coins`)
        user.bank.subtract(amount, `withdrew ${amount} coins`)

        message.channel.send(
            `${message.author}, you withdrew **${amount}** coins from your bank.`
        )
    }


    if (command == prefix + 'leaderboard') {
        const rawLeaderboard = guild.leaderboards.money()

        const leaderboard = rawLeaderboard
            .filter(lb => !getUser(lb.userID)?.bot)
            .filter(lb => !!lb.money)

        if (!leaderboard.length) {
            return message.channel.send(`${message.author}, there are no users in the leaderboard.`)
        }

        message.channel.send(
            `**${message.guild.name}** - Money Leaderboard **[${leaderboard.length}]**:\n\n` +
            `${leaderboard
                .map((lb, index) => `${index + 1} - <@${lb.userID}> - **${lb.money}** coins`)
                .join('\n')}`
        )
    }


    if (command == prefix + 'shop') {
        const guildShop = shop.filter(item => !item.custom.hidden)

        if (!guildShop.length) {
            return message.channel.send(`${message.author}, there are no items in the shop.`)
        }

        message.channel.send(
            `**${message.guild.name}** - Guild Shop **[${guildShop.length} items]**:\n\n` +

            `${guildShop
                .map((item, index) =>
                    `${index + 1} - ${item.custom.locked ? ' 🔒 | ' : ' '}${item.custom.emoji} ` +
                    `**${item.name}** (ID: **${item.id}**) - **${item.price}** coins`)
                .join('\n')}`
        )
    }

    if (command == prefix + 'shop_find') {
        const [itemID] = args

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item.`)
        }

        if (!item || item?.custom?.hidden) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        message.channel.send(
            `**${item.custom.emoji} ${item.name}** - Item Info:\n\n` +

            `Name: ${item.name}` +
            `${item.custom.locked ? ` [🔒 | Locked since ${new Date(item.custom.lockedSince)
                .toLocaleString()}]` : ''}\n` +

            `ID: **${item.id}**\n` +
            `Emoji: ${item.custom.emoji}\n\n` +

            `Price: **${item.price}** coins\n` +
            `Description: **${item.description}**\n` +
            `Max quantity in inventory: **${item.maxAmount}**\n\n` +

            `${item.role ? `Role: **<@&${item.role}>**\n` : ''}` +
            `Hidden: **${item.custom.hidden ? 'Yes' : 'No'}**\n` +
            `Locked: **${item.custom.locked ? 'Yes' : 'No'}**\n\n` +

            `Message on use: **${item.message}**\n` +
            `Created at: **${item.date}**`
        )
    }


    if (command == prefix + 'shop_add') {
        const [name, emoji, priceString] = args

        const price = parseInt(priceString)
        const messageOnUse = args.slice(3).join(' ')

        if (!name) {
            return message.channel.send(`${message.author}, please provide a name for the item.`)
        }

        if (!emoji) {
            return message.channel.send(`${message.author}, please provide an emoji for the item.`)
        }

        if (!price) {
            return message.channel.send(`${message.author}, please provide a price for the item.`)
        }

        const newItem = guild.shop.addItem({
            name,
            price,
            message: messageOnUse,

            custom: {
                emoji,
                hidden: false,
                locked: false,
                hiddenSince: null,
                lockedSince: null
            }
        })

        message.channel.send(
            `${message.author}, you added **${newItem.name}** for **${newItem.price}** coins to the shop.`
        )
    }

    if (command == prefix + 'shop_remove') {
        const [itemID] = args

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        item.delete()

        message.channel.send(
            `${message.author}, you removed **${item.name}** from the shop.`
        )
    }

    if (command == prefix + 'shop_edit') {
        const itemProperties = ['description', 'price', 'name', 'message', 'maxAmount', 'role']

        const [itemID, itemProperty] = args
        const newValue = args.slice(2).join(' ')

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

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

        item.edit(itemProperty, newValue)

        message.channel.send(
            `${message.author}, you changed **${item.name}**'s **${itemProperty}** to **${newValue}**.`
        )
    }


    if (command == prefix + 'shop_hide') {
        const [itemID] = args
        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (item.custom.hidden) {
            return message.channel.send(`${message.author}, item is already hidden.`)
        }

        item.setCustom({
            emoji: item.custom.emoji,
            hidden: true,
            hiddenSince: Date.now(),
            locked: item.custom.locked,
            lockedSince: item.custom.lockedSince
        })

        message.channel.send(
            `${message.author}, you hid the item **${item.name}** from the shop.`
        )
    }

    if (command == prefix + 'shop_hidden') {
        const hiddenShop = shop.filter(item => item.custom.hidden)

        if (!hiddenShop.length) {
            return message.channel.send(`${message.author}, there are no hidden items in the shop.`)
        }

        message.channel.send(
            `**${message.guild.name}** - Hidden Shop **[${hiddenShop.length} items]**:\n\n` +

            `${hiddenShop
                .map((item, index) =>
                    `${index + 1} - ${item.custom.locked ? ' 🔒 | ' : ' '}${item.custom.emoji} ` +
                    `**${item.name}** (ID: **${item.id}**) - **${item.price}** coins ` +
                    `(Since **${new Date(item.custom.hiddenSince).toLocaleString()}**)`
                )
                .join('\n')}`
        )
    }

    if (command == prefix + 'shop_show') {
        const [itemID] = args
        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (!item.custom.hidden) {
            return message.channel.send(`${message.author}, item is already visible.`)
        }

        item.setCustom({
            emoji: item.custom.emoji,
            hidden: false,
            hiddenSince: null,
            locked: item.custom.locked,
            lockedSince: item.custom.lockedSince
        })

        message.channel.send(
            `${message.author}, item **${item.name}** is now visible in the shop.`
        )
    }


    if (command == prefix + 'shop_lock') {
        const [itemID] = args
        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`${message.author}, item is already locked.`)
        }

        item.setCustom({
            emoji: item.custom.emoji,
            hidden: item.custom.hidden,
            hiddenSince: item.custom.hiddenSince,
            locked: true,
            lockedSince: Date.now()
        })

        message.channel.send(
            `${message.author}, you locked the item **${item.name}** in the shop.`
        )
    }

    if (command == prefix + 'shop_locked') {
        const lockedShop = shop.filter(item => item.custom.locked)

        if (!lockedShop.length) {
            return message.channel.send(`${message.author}, there are no locked items in the shop.`)
        }

        message.channel.send(
            `**${message.guild.name}** - Locked Shop **[${lockedShop.length} items]**:\n\n` +

            `${lockedShop
                .map((item, index) =>
                    `${index + 1} - ${item.custom.locked ? ' 🔒 | ' : ' '}${item.custom.emoji} ` +
                    `**${item.name}** (ID: **${item.id}**) - **${item.price}** coins ` +
                    `(Since **${new Date(item.custom.lockedSince).toLocaleString()}**)`
                )
                .join('\n')}`
        )
    }

    if (command == prefix + 'shop_unlock') {
        const [itemID] = args

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please provide an item ID.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found.`)
        }

        if (!item.custom.locked) {
            return message.channel.send(`${message.author}, item is already unlocked.`)
        }

        item.setCustom({
            emoji: item.custom.emoji,
            hidden: item.custom.hidden,
            hiddenSince: item.custom.hiddenSince,
            locked: false,
            lockedSince: null
        })

        message.channel.send(
            `${message.author}, you unlocked the item **${item.name}** in the shop.`
        )
    }


    if (command == prefix + 'shop_clear') {
        if (!shop.length) {
            return message.channel.send(`${message.author}, there are no items in the shop.`)
        }

        guild.shop.clear()

        message.channel.send(
            `${message.author}, cleared **${shop.length}** items from the shop.`
        )
    }


    if (command == prefix + 'inventory') {
        const userInventory = inventory.filter(item => !item.custom.hidden)

        if (!userInventory.length) {
            return message.channel.send(`${message.author}, you don't have any items in your inventory.`)
        }

        const cleanInventory = [...new Set(userInventory.map(item => item.name))]
            .map(itemName => shop.find(shopItem => shopItem.name == itemName))
            .map(item => {
                const quantity = userInventory.filter(invItem => invItem.name == item.name).length

                return {
                    quantity,
                    totalPrice: item.price * quantity,
                    item
                }
            })

        message.channel.send(
            `${message.author}, here's your inventory [**${userInventory.length} items**]:\n\n` +
            cleanInventory
                .map(
                    (data, index) =>
                        `${index + 1} - **x${data.quantity} ${data.item.custom.emoji} ` +
                        `${data.item.name}** (ID: **${data.item.id}**) ` +
                        `for **${data.totalPrice}** coins`
                )
                .join('\n')
        )
    }

    if (command == prefix + 'inventory_clear') {
        if (!inventory.length) {
            return message.channel.send(`${message.author}, you don't have any items in your inventory.`)
        }

        user.inventory.clear()

        message.channel.send(
            `${message.author}, cleared **${inventory.length}** items from your inventory.`
        )
    }


    if (command == prefix + 'history') {
        const userHistory = history.filter(item => !item.custom.hidden)

        if (!userHistory.length) {
            return message.channel.send(`${message.author}, you don't have any items in your purchases history.`)
        }

        message.channel.send(
            `${message.author}, here's your purchases history [**${userHistory.length} items**]:\n\n` +
            userHistory
                .map(
                    item => `**x${item.quantity} ${item.custom.emoji} ${item.name}** - ` +
                        `**${item.price}** coins (**${item.date}**)`
                )
                .join('\n')
        )
    }

    if (command == prefix + 'history_clear') {
        if (!history.length) {
            return message.channel.send(`${message.author}, you don't have any items in your purchases history.`)
        }

        user.history.clear()

        message.channel.send(
            `${message.author}, cleared **${history.length}** items from your purchases history.`
        )
    }


    if (command == prefix + 'shop_buy') {
        const [itemID, quantityString] = args
        const quantity = parseInt(quantityString) || 1

        const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item.`)
        }

        if (!item || item?.custom?.hidden) {
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

        const buyingResult = user.items.buy(item.id, quantity)

        if (!buyingResult.status) {
            return message.channel.send(`${message.author}, failed to buy the item: ${buyingResult.message}`)
        }

        message.channel.send(
            `${message.author}, you bought **x${buyingResult.quantity} ` +
            `${item.custom.emoji} ${item.name}** for **${buyingResult.totalPrice}** coins.`
        )
    }

    if (command == prefix + 'shop_use') {
        const [itemID] = args
        const item = inventory.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item in your inventory.`)
        }

        if (!item || item?.custom?.hidden) {
            return message.channel.send(`${message.author}, item not found in your inventory.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`${message.author}, this item is locked - you cannot use it.`)
        }

        const resultMessage = item.use(client)
        message.channel.send(resultMessage)
    }

    if (command == prefix + 'shop_sell') {
        const [itemID, quantityString] = args
        const quantity = parseInt(quantityString) || 1

        const item = inventory.find(item => item.id == parseInt(itemID) || item.name == itemID)

        if (!itemID) {
            return message.channel.send(`${message.author}, please specify an item in your inventory.`)
        }

        if (!item) {
            return message.channel.send(`${message.author}, item not found in your inventory.`)
        }

        if (item.custom.locked) {
            return message.channel.send(`${message.author}, this item is locked - you cannot sell it.`)
        }

        const sellingResult = user.items.sell(item.id, quantity)

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
eco.on('ready', async economy => {
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
    console.log(`Added ${data.amount} coins to ${getUser(data.memberID).tag}.`)
})

eco.on('balanceSubtract', data => {
    console.log(`Subtracted ${data.amount} coins for ${getUser(data.memberID).tag}.`)
})


// bank events
eco.on('bankSet', data => {
    console.log(`Set ${data.amount} coins in ${getUser(data.memberID).tag}'s bank.`)
})

eco.on('bankAdd', data => {
    console.log(`Added ${data.amount} coins to ${getUser(data.memberID).tag}'s bank.`)
})

eco.on('bankSubtract', data => {
    console.log(`Subtracted ${data.amount} coins from ${getUser(data.memberID).tag}'s bank.`)
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
        `${getUser(data.boughtBy).tag} has bought the item "${data.item.name}" ` +
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


client.login(config.token)
