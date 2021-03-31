const bot = new (require('discord.js')).Client({ partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'], ws: { intents: require('discord.js').Intents.ALL } })
const Economy = require('discord-economy-super')
const eco = new Economy({
    storagePath: './storage.json',
    updateCountdown: 1000,
    dailyAmount: 100,
    dailyCooldown: 30000,
    workAmount: [10, 50],
    workCooldown: 15000
})
bot.on('ready', () => {
    console.log(bot.user.tag + ' is ready!')
    bot.user.setActivity('Test Bot!', { type: 'STREAMING', url: 'https://twitch.tv/twitch' })
})
bot.on('message', async message => {
    if (message.content.startsWith('+eval')) {
        let args = message.content.slice(1).split(' ').slice(1)
        if (!args[0]) return message.channel.send('undefined', { code: 'js' })
        function clean(text) {
            if (typeof (text) == 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            return text;
        }
        try {
            const code = args.join(' ');
            let evaled = eval(code.includes('await') ? `async function asksfjaifsifs123() { ${code} } asksfjaifsifs123()` : code)
            message.react('✅');
            if (typeof evaled !== 'string')
                evaled = require('util').inspect(evaled)
            if (evaled === 'Promise { <pending> }') return;
            message.react('✅');
            message.channel.send(clean(evaled), {
                code: 'js'
            });
        } catch (err) {
            message.react('❌');
            message.channel.send(`\`ОШИБКА!\` \`\`\`js\n${clean(err)}\n\`\`\``);
        }
    }
    if (message.content.startsWith('+help')) return message.channel.send('**__Bot Commands:__**\n+help\n+balance\n+setmoney\n+addmoney\n+removemoney\n+daily\n+work\n+lb (+leaderboard)')
    if (message.content.startsWith('+balance')) {
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
        if (daily !== eco.options.dailyAmount) return message.channel.send(`You have already claimed your daily reward! Time left until next claim: **${daily}**`)
        message.channel.send(`You have received **${daily}** daily coins!`)
    }
    if (message.content.startsWith('+work')) {
        let work = eco.work(message.author.id, message.guild.id)
        if (isNaN(work)) return message.channel.send(`You have already worked! Time left until next work: **${work}**`)
        message.channel.send(`You worked hard and earned **${work}** coins!`)
    }
    if (message.content.startsWith('+lb') || message.content.startsWith('+leaderboard')) {
        let i = 1
        try{
            const lb = eco.leaderboard(message.guild.id)
            message.channel.send(`Money Leaderboard for **${message.guild.name}**\n-----------------------------------\n` + lb.map(x => `${i++}. <@${x.userID}> - ${x.money} coins`).join('\n'))
        }catch(err){
            if(err instanceof eco.EconomyError) return message.channel.send(err.message)
            console.log(err)
        }
    }
})
bot.login('token')