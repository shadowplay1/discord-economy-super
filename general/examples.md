# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy framework for your [Discord Bot](https://discord.js.org/#/).

## Simple Example
```js
const { Client } = require('discord.js')
const client = new Client();

const Economy = require('discord-economy-super');
const eco = new Economy();

client.on('ready', () => {
  console.log(`${client.user.tag} is ready!`);
});

client.login('token')
```

## Options Example
```js
const Economy = require('discord-economy-super');
new Economy({
  storagePath: './storage.json', // Full path to a JSON File. Default: './storage.json'.
  checkStorage: true, // Checks the if database file exists and if it has errors. Default: true.
  dailyCooldown: 60000 * 60 * 24, // Daily Cooldown, ms (24 Hours = 1 Day). Default: 24 Hours (60000 * 60 * 24) ms.
  workCooldown: 60000 * 60, // Work Cooldown, ms (1 Hour). Default: 1 Hour (60000 * 60) ms.
  weeklyCooldown: 60000 * 60 * 24 * 7, // Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
  dailyAmount: 100, // Daily Amount. Default: 100.
  workAmount: [10, 50], // Work Amount: first element is min value, second is max value (It also can be a Number). Default: [10, 50].
  weeklyAmount: 1000, // Amount of money for Weekly Command. Default: 1000.
  updateCountdown: 1000, // Checks for if storage file exists in specified time (in ms). Default: 1000.
  dateLocale: 'ru', // The region (example: ru; en) to format date and time. Default: 'ru'.
  updater: {
        checkUpdates: true, // Sends the update state message in console on start. Default: true.
        upToDateMessage: true // Sends the message in console on start if module is up to date. Default: true.
    },
    errorHandler: {
        handleErrors: true, // Handles all errors on start. Default: true.
        attempts: 5, // Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5.
        time: 3000 // Time between every attempt to start the module. Default: 3000.
    }
});
```

## Events Example
```js
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


// core events
eco.on('ready', () => {
    console.log('Economy is ready!')
})
eco.on('destroy', () => {
    console.log('Economy was destroyed.')
})
```
## Balance Command
```js
if (message.content.startsWith('+balance')) {
    const member = message.guild.member(message.mentions.members.first() || message.author)
        
    const balance = eco.balance.fetch(member.id, message.guild.id)
    const bank = eco.bank.fetch(member.user.id, message.guild.id)
        
    message.channel.send(`**${member.user.username}**'s Balance:\nCash: **${balance}** coins.\nBank: **${bank}** coins.`)
}
```

## Daily & Work Commands
```js
if (message.content.startsWith('+daily')) {
    const daily = eco.rewards.daily(message.author.id, message.guild.id)
    if (!daily.status) return message.channel.send(`You have already claimed your daily reward! Time left until next claim: **${daily.value.days}** days, **${daily.value.hours}** hours, **${daily.value.minutes}** minutes and **${daily.value.seconds}** seconds.`)
    message.channel.send(`You have received **${daily.reward}** daily coins!`)
}

if (message.content.startsWith('+work')) {
    const work = eco.rewards.work(message.author.id, message.guild.id)
    if (!work.status) return message.channel.send(`You have already worked! Time left until next work: **${work.value.days}** days, **${work.value.hours}** hours, **${work.value.minutes}** minutes and **${work.value.seconds}** seconds.`)
    message.channel.send(`You worked hard and earned **${work.pretty}** coins!`)
}
```

## Cash & Deposit Commands
```js
const args = message.content.slice(1).trim().split(' ').slice(1)
if (message.content.startsWith('+cash')) {
    const amount = args[0]
    const balance = eco.bank.fetch(message.author.id, message.guild.id)

    if (!amount) return message.channel.send('Specify an amount.')
    if (isNaN(amount)) return message.channel.send('Amount must be a number.')
    if (amount > balance) return message.channel.send(`You don\'t have enough money in your bank to send **${amount}** coins on your balance.`)
        
    eco.balance.add(amount, message.author.id, message.guild.id)
    eco.bank.subtract(amount, message.author.id, message.guild.id)
        
    message.channel.send(`Successfully sent **${amount}** on your balance!`)
}

if (message.content.startsWith('+deposit') || message.content.startsWith('+dep')) {
    const amount = args[0]
    const balance = eco.balance.fetch(message.author.id, message.guild.id)

    if (!amount) return message.channel.send('Specify an amount.')
    if (isNaN(amount)) return message.channel.send('Amount must be a number.')
    if (amount > balance) return message.channel.send(`You don\'t have enough money on your balance to deposit **${amount}** coins.`)
        
    eco.balance.subtract(amount, message.author.id, message.guild.id)
    eco.bank.add(amount, message.author.id, message.guild.id)
 
    message.channel.send(`Successfully deposited **${amount}** coins!`)
}
```

## ❗ | Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-economy-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super/tree/main/examples">Bot Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<b>If you found a bug, please send it in Discord to ShadowPlay#9706.</b>
<br>
<b>If you have any questions or need help, join the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for using Discord Economy Super ❤️