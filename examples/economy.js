const Discord = require('discord.js')
const Economy = require('discord-economy-super')
const bot = new Discord.Client({ partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'], ws: { intents: require('discord.js').Intents.ALL } })
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.events = new Discord.Collection();
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
        const lb = eco.leaderboard(message.guild.id)
        if(!lb.length) return message.channel.send('Cannot generate a leaderboard: the server database is empty.')
        message.channel.send(`Money Leaderboard for **${message.guild.name}**\n-----------------------------------\n` + lb.map((x, i) => `${i + 1}. <@${x.userID}> - ${x.money} coins`).join('\n'))
    }
})
bot.login('token')