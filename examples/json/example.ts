// @ts-expect-error
import { Client } from 'discord.js'

import Economy from '../../'//'discord-economy-super'


const client = new Client({
    intents: ['GuildMembers', 'GuildMessages']
})

const eco = new Economy()


eco.on('ready', () => {
    console.log('Economy is ready!')
    client.eco = eco
})

client.on('ready', () => {
    console.log(`${client.user.tag} is ready!`)
})


client.on('message', message => {
    const prefix = '!'
    const splittedMessage = message.content.trim().split(' ')

    const command = prefix + splittedMessage[0]
    const args = splittedMessage.slice(1)


    switch (command.slice(1)) {
        case 'balance':
            const [userID] = args
            const guild = eco.guilds.get(message.guild.id)

            const user = guild.users.get(
                message.mentions.users.first()?.id ||
                message.guild.users.get(userID) ||
                message.author.id
            )

            const [balance, bank] = [
                user.balance.get(),
                user.bank.get()
            ]

            message.channel.send(`${message.author}'s balance:\nCoins: **${balance}**.\nCoins in bank: **${bank}**.`)
            break
    }
})


client.login('token')