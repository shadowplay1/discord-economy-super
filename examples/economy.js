const { Client, Intents } = require('discord.js')
const Economy = require('discord-economy-super')
const bot = new Client({ 
    partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'], 
    ws: { 
        intents: Intents.ALL 
    } 
})
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
bot.on('message', async message => {
    if (message.content.startsWith('+help')) return message.channel.send('**__Bot Commands:__**\n+help\n+balance\n+setmoney\n+addmoney\n+removemoney\n+daily\n+weekly\n+work\n+lb (+leaderboard)')
    if (message.content.startsWith('+balance') || message.content.startsWith('+bal')) {
        let member = message.mentions.members.first()
        let balance = eco.fetch(member?.user?.id || message.author.id, message.guild.id)
        message.channel.send(`**${member?.user?.username || message.author.username}**'s Balance: ${balance} coins.`)
    }
    if (message.content.startsWith('+setmoney')) {
        let args = message.content.slice(1).split(' ').slice(1)
        let member = message.mentions.members.first()
        if (!member) return message.channel.send('Specify an existing user.')
        if (!args[1]) return message.channel.send('Specify a money amount.')
        eco.set(args[1], member.id, message.guild.id)
        message.channel.send(`Successfully set **${args[1]}** coins for user ${member}.`)
    }
    if (message.content.startsWith('+addmoney')) {
        let args = message.content.slice(1).split(' ').slice(1)
        let member = message.mentions.members.first()
        if (!member) return message.channel.send('Specify an existing user.')
        if (!args[1]) return message.channel.send('Specify a money amount.')
        eco.add(args[1], member.id, message.guild.id)
        message.channel.send(`Successfully added **${args[1]}** coins for user ${member}.`)
    }
    if (message.content.startsWith('+removemoney')) {
        let args = message.content.slice(1).split(' ').slice(1)
        let member = message.mentions.members.first()
        if (!member) return message.channel.send('Specify an existing user.')
        if (!args[1]) return message.channel.send('Specify a money amount.')
        eco.subtract(args[1], member.id, message.guild.id)
        message.channel.send(`Successfully removed **${args[1]}** coins from user ${member}.`)
    }
    if (message.content.startsWith('+daily')) {
        const daily = eco.daily(message.author.id, message.guild.id)
        if (!daily.status) return message.channel.send(`You have already claimed your daily reward! Time left until next claim: **${daily.value.days}** days, **${daily.value.hours}** hours, **${daily.value.minutes}** minutes, **${daily.value.seconds}** seconds and **${daily.value.milliseconds}** milliseconds.`)
        message.channel.send(`You have received **${daily.reward}** daily coins!`)
    }
    if (message.content.startsWith('+work')) {
        let work = eco.work(message.author.id, message.guild.id)
        if (!work.status) return message.channel.send(`You have already worked! Time left until next work: **${work.value.days}** days, **${work.value.hours}** hours, **${work.value.minutes}** minutes, **${work.value.seconds}** seconds and **${work.value.milliseconds}** milliseconds.`)
        message.channel.send(`You worked hard and earned **${work.pretty}** coins!`)
    }
    if (message.content.startsWith('+weekly')) {
        let weekly = eco.weekly(message.author.id, message.guild.id)
        if (!weekly.status) return message.channel.send(`You have already claimed your weekly reward! Time left until next claim: **${weekly.value.days}** days, **${weekly.value.hours}** hours, **${weekly.value.minutes}** minutes, **${weekly.value.seconds}** seconds and **${weekly.value.milliseconds}** milliseconds.`)
        message.channel.send(`You have received **${weekly.reward}** weekly coins!`)
    }
    if (message.content.startsWith('+lb') || message.content.startsWith('+leaderboard')) {
        const lb = eco.leaderboard(message.guild.id)
        if(!lb.length) return message.channel.send('Cannot generate a leaderboard: the server database is empty.')
        message.channel.send(`Money Leaderboard for **${message.guild.name}**\n-----------------------------------\n` + lb.map((x, i) => `${i + 1}. <@${x.userID}> - ${x.money} coins`).join('\n'))
    }
})
bot.login('token')