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

eco.on('ready', () => {
    console.log('Economy is ready!')
})

bot.on('messageCreate', async message => {
    const args = message.content.slice(1).trim().split(' ').slice(1)

    if (message.content.startsWith('+help')) message.channel.send('**__Bot Commands:__**\n+help\n+balance\n+daily\n+weekly\n+work\n+lb (+leaderboard)\n+blb (+bankleaderboard)\n+blb (+bankleaderboard)\n+cash\n+deposit (+dep)')

    else if (message.content.startsWith('+daily')) {
        const daily = eco.rewards.daily(message.author.id, message.guild.id)
        if (!daily.status) message.channel.send(`You have already claimed your daily reward! Time left until next claim: **${daily.value.days}** days, **${daily.value.hours}** hours, **${daily.value.minutes}** minutes and **${daily.value.seconds}** seconds.`)
        else message.channel.send(`You have received **${daily.reward}** daily coins!`)
    }
    
    else if (message.content.startsWith('+work')) {
        const work = eco.rewards.work(message.author.id, message.guild.id)

        if (!work.status) message.channel.send(`You have already worked! Time left until next work: **${work.value.days}** days, **${work.value.hours}** hours, **${work.value.minutes}** minutes and **${work.value.seconds}** seconds.`)
        else message.channel.send(`You worked hard and earned **${work.pretty}** coins!`)
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
    
    else if (message.content.startsWith('+balance')) {
        const member = message.guild.members.cache.get(message.mentions.members.first()?.id || message.author.id)

        const balance = eco.balance.fetch(member.id, message.guild.id)
        const bank = eco.bank.fetch(member.user.id, message.guild.id)

        message.channel.send(`**${member.user.username}**'s Balance:\nCash: **${balance}** coins.\nBank: **${bank}** coins.`)
    }

    else if (message.content.startsWith('+cash')) {
        const amount = args[0]
        const balance = eco.bank.fetch(message.author.id, message.guild.id)

        if (!amount) message.channel.send('Specify an amount.')
        else if (isNaN(Number(amount))) message.channel.send('Amount must be a number.')
        else if (amount > balance) message.channel.send(`You don\'t have enough money in your bank to send **${amount}** coins on your balance.`)

        eco.balance.add(amount, message.author.id, message.guild.id)
        eco.bank.subtract(amount, message.author.id, message.guild.id)

        message.channel.send(`Successfully sent **${amount}** on your balance!`)
    }

    else if (message.content.startsWith('+deposit') || message.content.startsWith('+dep')) {
        const amount = args[0]
        const balance = eco.balance.fetch(message.author.id, message.guild.id)

        if (!amount) message.channel.send('Specify an amount.')
        else if (isNaN(Number(amount))) message.channel.send('Amount must be a number.')
        else if (amount > balance) message.channel.send(`You don\'t have enough money on your balance to deposit **${amount}** coins.`)

        eco.balance.subtract(amount, message.author.id, message.guild.id)
        eco.bank.add(amount, message.author.id, message.guild.id)

        message.channel.send(`Successfully deposited **${amount}** coins!`)
    }
})

bot.login('token')
