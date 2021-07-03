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

## Advanced Example
```js
const { Client, Intents } = require('discord.js') // npm i discord.js
const client = new Client({
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'], 
    ws: {
        intents: Intents.ALL 
    } 
});

const Economy = require('discord-economy-super');
const eco = new Economy({
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

client.on('ready', () => {
  console.log(`${bot.user.tag} is ready!`);
});

client.login('token') // https://discord.com/developers/applications
```

## Example Events Usage
```js
const { Client, Intents } = require('discord.js') // npm i discord.js
const client = new Client({
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'], 
    ws: {
        intents: Intents.ALL 
    }
});

const Economy = require('discord-economy-super');
const eco = new Economy({
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

client.on('ready', () => {
  console.log(`${bot.user.tag} is ready!`);
});

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
  if(cleared) console.log('The shop was cleared successfully!')
  else console.log('Cannot clear the shop!')
})


// core events
eco.on('ready', () => {
    console.log('Economy is ready!')
})
eco.on('destroy', () => {
    console.log('Economy was destroyed.')
})

client.login('token') // https://discord.com/developers/applications
```

## Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-economy-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super/tree/main/examples">Bot Examples</a></b></li>
<li><b><a href = "https://discord.gg/afUTRzfb">Discord Server</a></b></li>
</ul>
<b>If you found a bug, please send it in Discord to ShadowPlay#9706.</b>
<br>
<b>If you have any questions or need help, join the <a href = "https://discord.gg/afUTRzfb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# Thanks for using Discord Economy Super ♥