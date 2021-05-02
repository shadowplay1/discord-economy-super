const bot = new (require('discord.js')).Client({ partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'], ws: { intents: require('discord.js').Intents.ALL } })
const Economy = require('discord-economy-super')
const eco = new Economy({
    storagePath: './storage.json',
    checkStorage: true,
    updateCountdown: 1000,
    dailyAmount: 100,
    workAmount: [10, 50],
    weeklyAmount: 1000,
    dailyCooldown: 30000,
    workCooldown: 15000,
    weeklyCooldown: 60000 * 60 * 24 * 7,
    dateLocale: 'ru',
    updater: {
        checkUpdates: true,
        upToDateMessage: true
    },
    errorHandler: {
        handleErrors: true,
        attempts: 5,
        time: 3000
    }
})
bot.on('ready', () => {
    console.log(bot.user.tag + ' is ready!')
    bot.user.setActivity('Test Bot!', { type: 'STREAMING', url: 'https://twitch.tv/twitch' })
})

// balance events
eco.on('balanceSet', balance => {
    console.log(`Someone's just set ${balance.amount} coins for balance for member ${balance.memberID} on guild ${balance.guildID}. His bank balance is ${balance.balance} coins now.\nReason: ${balance.reason}\nOperation type: '${balance.type}'`)
})
eco.on('balanceAdd', balance => {
    console.log(`Someone's just added ${balance.amount} coins for balance for member ${balance.memberID} on guild ${balance.guildID}. His bank balance is ${balance.balance} coins now.\nReason: ${balance.reason}\nOperation type: '${balance.type}'`)
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
    console.log(`Someone's just added an item in the shop!\nItem data:\nID: ${item.id}\nName: ${item.itemName}\nPrice: ${item.price}\nDescription: ${item.description}\nMessage on use: ${item.message}\nMax amount of item in inventory: ${item.maxAmount}\nRole ID: ${item.role || 'Not specified'}`)
})
eco.on('shopRemoveItem', item => {
    console.log(`Someone's just removed an item from the shop!\nItem data:\nID: ${item.id}\nName: ${item.itemName}\nPrice: ${item.price}\nDescription: ${item.description}\nMessage on use: ${item.message}\nMax amount of item in inventory: ${item.maxAmount}\nRole ID: ${item.role || 'Not specified'}`)
})
eco.on('shopEditItem', item => {
    console.log(`Someone's just edited an item in the shop!\nID: ${item.id}\Guild ID: ${item.guildID}\nWhat changed: ${item.changed}\nBefore: ${item.oldValue}\nAfter: ${item.newValue}`)
})
eco.on('shopItemBuy', item => {
    console.log(`Someone's just bought an item from the shop!\nItem data:\nID: ${item.id}\nName: ${item.itemName}\nPrice: ${item.price}\nDescription: ${item.description || 'Not specified'}\nMessage on use: ${item.message || 'Not specified'}\nMax amount of item in inventory: ${item.maxAmount || 'Any'}\nRole ID: ${item.role || 'Not specified'}`)
})
eco.on('shopItemUse', item => {
    console.log(`Someone's just used an item!\nItem data:\nID: ${item.id}\nName: ${item.itemName}\nPrice: ${item.price}\nDescription: ${item.description || 'Not specified'}\nMessage on use: ${item.message || 'Not specified'}\nMax amount of item in inventory: ${item.maxAmount || 'Any'}\nRole ID: ${item.role || 'Not specified'}`)
})
eco.on('shopClear', cleared => {
    if (cleared) console.log('The shop was cleared successfully!')
    else console.log('Cannot clear the shop!')
})

bot.on('message', async message => {
    let args = message.content.slice(1).trim().split(' ')
    if (message.content.startsWith('+help')) return message.channel.send('**__Bot Commands:__**\n+help\n+balance\n+daily\n+weekly\n+work\n+lb (+leaderboard)\n+shop\n`+shop_add`\n`+shop_remove`\n`+shop_buy`\n`+shop_search`\n`+shop_clear`\n`+shop_inventory`\n`+shop_use_item`\n`+shop_clear_inventory`\n`+shop_history`\n`+shop_clear_history`')
    if (message.content.startsWith('+daily')) {
        let daily = eco.daily(message.author.id, message.guild.id)
        if (isNaN(daily)) return message.channel.send(`You have already claimed your daily reward! Time left until next claim: **${daily}**`)
        message.channel.send(`You have received **${daily}** daily coins!`)
    }
    if (message.content.startsWith('+work')) {
        let work = eco.work(message.author.id, message.guild.id)
        if (isNaN(work)) return message.channel.send(`You have already worked! Time left until next work: **${work}**`)
        message.channel.send(`You worked hard and earned **${work}** coins!`)
    }
    if (message.content.startsWith('+weekly')) {
        let weekly = eco.weekly(message.author.id, message.guild.id)
        if (isNaN(weekly)) return message.channel.send(`You have already claimed your weekly reward! Time left until next claim: **${weekly}**`)
        message.channel.send(`You have received **${weekly}** weekly coins!`)
    }
    if (message.content.startsWith('+lb') || message.content.startsWith('+leaderboard')) {
        try {
            const lb = eco.leaderboard(message.guild.id)
            message.channel.send(`Money Leaderboard for **${message.guild.name}**\n-----------------------------------\n` + lb.map((x, i) => `${i + 1}. <@${x.userID}> - ${x.money} coins`).join('\n'))
        } catch (err) {
            if (err instanceof eco.EconomyError) return message.channel.send(err.message)
            console.log(err)
        }
    }
    if (message.content.startsWith('+balance')) {
        let member = message.mentions.members.first()
        let balance = eco.fetch(member?.user?.id || message.author.id, message.guild.id)
        message.channel.send(`**${member?.user?.username || message.author.username}**'s Balance: ${balance} coins.`)
    }
    if (message.content.startsWith('+shop')) {
        const shop = eco.shop.list(message.guild.id);
        if (!shop.length) return message.channel.send(`No items in the shop!`)
        message.channel.send(shop.map(x => `ID: ${x.id} - **${x.itemName}** (${x.price} coins), description: ${x.description}, max amount in inventory: ${x.maxAmount}`).join('\n'))
    }
    if (message.content.startsWith('+shop_add')) {
        if (!args[0]) return message.channel.send('Specify an item name.');
        if (!args[1]) return message.channel.send('Specify a price.');
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
    if (message.content.startsWith('+shop_remove')) {
        if (!args[0]) return channel.send('Specify an item ID or name.');
        const item = eco.shop.searchItem(args[0], message.guild.id)
        if (!item) return message.channel.send(`Cannot find item ${args[0]}.`)
        eco.shop.removeItem(args[0], message.guild.id);
        return message.channel.send('Item successfully removed!');
    }
    if (message.content.startsWith('+shop_buy')) {
        const balance = eco.fetch(message.author.id, message.guild.id)
        if (!args[0]) return message.channel.send('Specify an item ID or name.');
        const item = eco.shop.searchItem(args[0], message.guild.id)
        if (!item) return message.channel.send(`Cannot find item ${args[0]}.`)
        if (item.price > balance) return message.channel.send(`You don't have enough money (${balance} coins) to buy this item for ${item.price} coins!`)
        const purchase = eco.shop.buy(args[0], message.author.id, message.guild.id);
        if (purchase == 'max') return message.channel.send(`You cannot have more than **${item.maxAmount}** of item "**${item.itemName}**".`)
        if (err.message.includes('You cannot')) return message.channel.send(`You cannot have more than **${item.maxAmount}** of item "**${item.itemName}**".`)
        return message.channel.send(`You have received item "**${item.itemName}**" for **${item.price}** coins!`);
    }
    if (message.content.startsWith('+shop_search')) {
        if (!args[0]) return message.channel.send('Specify an item ID or name.')
        const item = eco.shop.searchItem(args[0], message.guild.id);
        if (!item) return message.channel.send(`Cannot find item ${args[0]}.`);
        return message.channel.send(`Item info:\nID: ${item.id}\nName: ${item.itemName}\nPrice: ${item.price} coins\nDesciption: ${item.description}\nMessage on use: ${item.message}\nMax amount in inventory: ${x.maxAmount}`)
    }
    if (message.content.startsWith('+shop_clear')) {
        eco.shop.clear(message.guild.id)
        return message.channel.send('Shop was cleared successfully!')
    }
    if (message.content.startsWith('+shop_inventory')) {
        const inv = eco.shop.inventory(message.author.id, message.guild.id);
        if (!inv.length) return message.channel.send('You don\'t have any item in your inventory.');
        return message.channel.send(inv.map((x, i) => `ID: ${i + 1}: ${x.itemName} - ${x.price} coins (${x.date})`).join('\n'))
    }
    if (message.content.startsWith('+shop_use_item')) {
        if (!args[0]) return message.channel.send('Specify an name or ID of item you have in your inventory.');
        const itemMessage = eco.shop.useItem(args[0], message.author.id, message.guild.id, bot);
        if (!itemMessage) return message.channel.send(`Cannot find item ${args[0]} in your inventory.`);
        return message.channel.send(itemMessage);
    }
    if (message.content.startsWith('+shop_clear_inventory')) {
        eco.shop.clearInventory(message.author.id, message.guild.id);
        return message.channel.send(`Your inventory was successfully cleared!`);
    }
    if (message.content.startsWith('+shop_history')) {
        const history = eco.shop.history(message.author.id, message.guild.id)
        if (!history.length) return message.channel.send('Your purchases history is empty.')
        return message.channel.send(history.map(x => `ID: ${x.id}: ${x.itemName} - ${x.price} coins (${x.date})`).join('\n'))
    }
    if (message.content.startsWith('+shop_clear_history')) {
        eco.shop.clearHistory(message.author.id, message.guild.id)
        return message.channel.send('Your purchases history was successfully cleared!')
    }
})
bot.login('token')