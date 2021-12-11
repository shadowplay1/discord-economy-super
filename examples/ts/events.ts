import { Client } from 'discord.js'
import Economy from 'discord-economy-super'

const bot = new Client({
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
    intents: [
        'GUILDS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS',
        'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS',
        'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'
    ]
})

const eco = new Economy({
    storagePath: './storage.json',
    updateCountdown: 1000,
    checkStorage: true,
    deprecationWarnings: true,
    sellingItemPercent: 75,
    savePurchasesHistory: true,
    dailyAmount: 100,
    workAmount: [10, 50],
    weeklyAmount: 1000,
    dailyCooldown: 60000 * 60 * 24,
    workCooldown: 60000 * 60,
    weeklyCooldown: 60000 * 60 * 24 * 7,
    dateLocale: 'en',
    updater: {
        checkUpdates: true,
        upToDateMessage: true
    },
    errorHandler: {
        handleErrors: true,
        attempts: 5,
        time: 3000
    },
    optionsChecker: {
        ignoreInvalidTypes: false,
        ignoreUnspecifiedOptions: true,
        ignoreInvalidOptions: false,
        showProblems: true,
        sendLog: true,
        sendSuccessLog: false
    }
})

bot.on('ready', () => {
    console.log(bot.user.tag + ' is ready!')
    bot.user.setActivity('Test Bot!', { type: 'STREAMING', url: 'https://twitch.tv/twitch' })
})

// balance events
eco.on('balanceSet', balance => {
    console.log(`Someone's just set ${balance.amount} coins for balance for member ${balance.memberID} on guild ${balance.guildID}. His balance is ${balance.balance} coins now.\nReason: ${balance.reason}\nOperation type: '${balance.type}'`)
})
eco.on('balanceAdd', balance => {
    console.log(`Someone's just added ${balance.amount} coins for balance for member ${balance.memberID} on guild ${balance.guildID}. His balance is ${balance.balance} coins now.\nReason: ${balance.reason}\nOperation type: '${balance.type}'`)
})
eco.on('balanceSubtract', balance => {
    console.log(`Someone's just subtracted ${balance.amount} coins from balance for member ${balance.memberID} on guild ${balance.guildID}. His balance is ${balance.balance} coins now.\nReason: ${balance.reason}\nOperation type: '${balance.type}'.`)
})


// bank balance events
eco.on('bankSet', balance => {
    console.log(`Someone's just set ${balance.amount} coins in bank for member ${balance.memberID} on guild ${balance.guildID}. His bank balance is ${balance.balance} coins now.\nReason: ${balance.reason}\nOperation type: '${balance.type}'`)
})
eco.on('bankAdd', balance => {
    console.log(`Someone's just added ${balance.amount} coins in bank for member ${balance.memberID} on guild ${balance.guildID}. His bank balance is ${balance.balance} coins now.\nReason: ${balance.reason}\nOperation type: '${balance.type}'`)
})
eco.on('bankSubtract', balance => {
    console.log(`Someone's just subtracted ${balance.amount} coins from bank for member ${balance.memberID} on guild ${balance.guildID}. His bank balance is ${balance.balance} coins now.\nReason: ${balance.reason}\nOperation type: '${balance.type}'`)
})

// shop events
eco.on('shopAddItem', item => {
    console.log(`Someone's just added an item in the shop!\nItem data:\nID: ${item.id}\nName: ${item.itemName}\nPrice: ${item.price}\nDescription: ${item.description}\nMessage on use: ${item.message}\nMax amount of item in inventory: ${item.maxAmount}\nRole ID: ${item.role || 'Not specelse ified'}`)
})
eco.on('shopRemoveItem', item => {
    console.log(`Someone's just removed an item from the shop!\nItem data:\nID: ${item.id}\nName: ${item.itemName}\nPrice: ${item.price}\nDescription: ${item.description}\nMessage on use: ${item.message}\nMax amount of item in inventory: ${item.maxAmount}\nRole ID: ${item.role || 'Not specelse ified'}`)
})
eco.on('shopEditItem', item => {
    console.log(`Someone's just edited an item in the shop!\nID: ${item.id}\Guild ID: ${item.guildID}\nWhat changed: ${item.changed}\nBefore: ${item.oldValue}\nAfter: ${item.newValue}`)
})
eco.on('shopItemBuy', item => {
    console.log(`Someone's just bought an item from the shop!\nItem data:\nID: ${item.id}\nName: ${item.itemName}\nPrice: ${item.price}\nDescription: ${item.description || 'Not specelse ified'}\nMessage on use: ${item.message || 'Not specelse ified'}\nMax amount of item in inventory: ${item.maxAmount || 'Any'}\nRole ID: ${item.role || 'Not specelse ified'}`)
})
eco.on('shopItemUse', item => {
    console.log(`Someone's just used an item!\nItem data:\nID: ${item.id}\nName: ${item.itemName}\nPrice: ${item.price}\nDescription: ${item.description || 'Not specelse ified'}\nMessage on use: ${item.message || 'Not specelse ified'}\nMax amount of item in inventory: ${item.maxAmount || 'Any'}\nRole ID: ${item.role || 'Not specelse ified'}`)
})
eco.on('shopClear', cleared => {
    if (cleared) console.log('The shop was cleared successfully!')
    else console.log('Cannot clear the shop!')
})


// core events
eco.on('ready', () => {
    console.log('Economy is ready!')
})
eco.on('destroy', () => {
    console.log('Economy was destroyed.')
})

bot.on('messageCreate', async message => {
    const args = message.content.slice(1).split(' ').slice(1)
    if (message.content.startsWith('+help')) message.channel.send('**__Bot Commands:__**\n+help\n+balance\n+daily\n+weekly\n+work\n+lb (+leaderboard)\n+blb (+bankleaderboard)\n+shop\n`+shop_add`\n`+shop_remove`\n`+shop_buy`\n`+shop_search`\n`+shop_clear`\n`+shop_inventory`\n`+shop_use`\n`+shop_clear_inventory`\n`+shop_history`\n`+shop_clear_history`')
    
    else if (message.content.startsWith('+daily')) {
        const daily = eco.rewards.daily(message.author.id, message.guild.id)
        if (!daily.status) message.channel.send(`You have already claimed your daily reward! Time left until next claim: **${daily.value.days}** days, **${daily.value.hours}** hours, **${daily.value.minutes}** minutes and **${daily.value.seconds}** seconds.`)
        message.channel.send(`You have received **${daily.reward}** daily coins!`)
    }

    else if (message.content.startsWith('+work')) {
        const work = eco.rewards.work(message.author.id, message.guild.id)
        if (!work.status) message.channel.send(`You have already worked! Time left until next work: **${work.value.days}** days, **${work.value.hours}** hours, **${work.value.minutes}** minutes and **${work.value.seconds}** seconds.`)
        message.channel.send(`You worked hard and earned **${work.pretty}** coins!`)
    }

    else if (message.content.startsWith('+weekly')) {
        const weekly = eco.rewards.weekly(message.author.id, message.guild.id)
        if (!weekly.status) message.channel.send(`You have already claimed your weekly reward! Time left until next claim: **${weekly.value.days}** days, **${weekly.value.hours}** hours, **${weekly.value.minutes}** minutes and **${weekly.value.seconds}** seconds.`)
        message.channel.send(`You have received **${weekly.reward}** weekly coins!`)
    }

    else if (message.content.startsWith('+lb') || message.content.startsWith('+leaderboard')) {
        const lb = eco.balance.leaderboard(message.guild.id)
        if (!lb.length) message.channel.send('Cannot generate a leaderboard: the server database is empty.')
        message.channel.send(`Money Leaderboard for **${message.guild.name}**\n-----------------------------------\n` + lb.map((x, i) => `${i + 1}. <@${x.userID}> - ${x.money} coins`).join('\n'))
    }

    else if (message.content.startsWith('+blb') || message.content.startsWith('+bankleaderboard')) {
        const lb = eco.bank.leaderboard(message.guild.id)
        if (!lb.length) message.channel.send('Cannot generate a leaderboard: the server database is empty.')
        message.channel.send(`Bank Leaderboard for **${message.guild.name}** [**${lb.length}**]\n-----------------------------------\n` + lb.map((x, i) => `${i + 1}. <@${x.userID}> - ${x.money} coins`).join('\n'))
    }

    else if (message.content.startsWith('+balance') || message.content.startsWith('+bal')) {
        const member = message.guild.members.cache.get(message.mentions.members.first()?.id || message.author.id)

        const balance = eco.balance.fetch(member.id, message.guild.id)
        const bank = eco.bank.fetch(member.user.id, message.guild.id)

        message.channel.send(`**${member.user.username}**'s Balance:\nCash: **${balance}** coins.\nBank: **${bank}** coins.`)
    }
    
    else if (message.content.startsWith('+cash')) {
        const amount = args[0]
        const balance = eco.bank.fetch(message.author.id, message.guild.id)

        if (!amount) message.channel.send('Specelse ify an amount.')
        else if (isNaN(Number(amount))) message.channel.send('Amount must be a number.')
        else if (amount > balance) message.channel.send(`You don\'t have enough money in your bank to send **${amount}** coins on your balance.`)

        eco.balance.add(amount, message.author.id, message.guild.id)
        eco.bank.subtract(amount, message.author.id, message.guild.id)

        message.channel.send(`Successfully sent **${amount}** on your balance!`)
    }

    else if (message.content.startsWith('+deposit') || message.content.startsWith('+dep')) {
        const amount = args[0]
        const balance = eco.balance.fetch(message.author.id, message.guild.id)

        if (!amount) message.channel.send('Specelse ify an amount.')
        else if (isNaN(Number(amount))) message.channel.send('Amount must be a number.')
        else if (amount > balance) message.channel.send(`You don\'t have enough money on your balance to deposit **${amount}** coins.`)

        eco.balance.subtract(amount, message.author.id, message.guild.id)
        eco.bank.add(amount, message.author.id, message.guild.id)

        message.channel.send(`Successfully deposited **${amount}** coins!`)
    }

    else if (message.content == '+shop') {
        const shop = eco.shop.list(message.guild.id)
        if (!shop.length) message.channel.send('No items in the shop!')
        message.channel.send(shop.map(x => `ID: ${x.id} - **${x.itemName}** (${x.price} coins), description: ${x.description}, max amount in inventory: ${x.maxAmount || 'any'}, role: ${x.role || 'No'}`).join('\n'))
    }

    else if (message.content.startsWith('+shop_add')) {
        if (!args[0]) message.channel.send('Specelse ify an item name.')
        else if (!args[1]) message.channel.send('Specelse ify a price.')

        eco.shop.addItem(message.guild.id, {
            itemName: args[0],
            price: args[1],
            message: args[2],
            description: args[3],
            maxAmount: args[4],
            role: args[5]
        })
        message.channel.send('Item successfully added!')
    }

    else if (message.content.startsWith('+shop_remove')) {
        const item = eco.shop.searchItem(args[0], message.guild.id)

        if (!args[0]) message.channel.send('Specelse ify an item ID or name.')
        else if (!item) message.channel.send(`Cannot find item ${args[0]}.`)
        eco.shop.removeItem(args[0], message.guild.id)

        message.channel.send('Item successfully removed!')
    }
    
    else if (message.content.startsWith('+shop_buy')) {
        const balance = eco.balance.fetch(message.author.id, message.guild.id)
        const purchase = eco.shop.buy(args[0], message.author.id, message.guild.id)
        const item = eco.shop.searchItem(args[0], message.guild.id)
        if (!args[0]) message.channel.send('Specelse ify an item ID or name.')
        else if (!item) message.channel.send(`Cannot find item ${args[0]}.`)
        else if (item.price > balance) message.channel.send(`You don't have enough money (${balance} coins) to buy this item for ${item.price} coins!`)
        else if (purchase == 'max') message.channel.send(`You cannot have more than **${item.maxAmount}** of item "**${item.itemName}**".`)

        message.channel.send(`You have received item "**${item.itemName}**" for **${item.price}** coins!`)
    }

    else if (message.content.startsWith('+shop_search')) {
        const item = eco.shop.searchItem(args[0], message.guild.id)
        if (!args[0]) message.channel.send('Specify an item ID or name.')
        else if (!item) message.channel.send(`Cannot find item ${args[0]}.`)
        message.channel.send(`Item info:\nID: **${item.id}**\nName: **${item.itemName}**\nPrice: **${item.price} coins**\nDesciption: **${item.description}**\nMessage on use: **${item.message}**\nMax amount in inventory: **${item.maxAmount || 'Any'}**\nRole: **${item.role || 'No'}**`)
    }
    else if (message.content == '+shop_clear') {
        eco.shop.clear(message.guild.id)
        message.channel.send('Shop was cleared successfully!')
    }

    else if (message.content.startsWith('+shop_inventory')) {
        const inv = eco.inventory.fetch(message.author.id, message.guild.id)
        if (!inv.length) message.channel.send('You don\'t have any item in your inventory.')
        message.channel.send(inv.map((x, i) => `ID: ${i + 1}: ${x.itemName} - ${x.price} coins (${x.date})`).join('\n'))
    }

    else if (message.content.startsWith('+shop_use')) {
        const itemMessage = eco.inventory.useItem(args[0], message.author.id, message.guild.id, bot)
        if (!args[0]) message.channel.send('Specelse ify an name or ID of item you have in your inventory.')
        else if (!itemMessage) message.channel.send(`Cannot find item ${args[0]} in your inventory.`)
        message.channel.send(itemMessage)
    }

    else if (message.content == '+shop_clear_inventory') {
        eco.inventory.clear(message.author.id, message.guild.id)
        message.channel.send('Your inventory was successfully cleared!')
    }

    else if (message.content.startsWith('+shop_history')) {
        const history = eco.shop.history(message.author.id, message.guild.id)
        if (!history.length) message.channel.send('Your purchases history is empty.')
        message.channel.send(history.map(x => `ID: ${x.id}: ${x.itemName} - ${x.price} coins (${x.date})`).join('\n'))
    }

    else if (message.content == '+shop_clear_history') {
        eco.shop.clearHistory(message.author.id, message.guild.id)
        message.channel.send('Your purchases history was successfully cleared!')
    }
})

bot.login('token')