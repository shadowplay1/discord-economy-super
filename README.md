# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy framework for your [Discord Bot](https://discord.js.org/#/).

## Install
<b>Please note:</br><b>
<b>Node.js 14.0.0 or newer is required.</b><br>
<b>All types in brackets mean the type of what the method or event returns.</b>
```console
npm i discord-economy-super
```

## Table of Contents
<ul>
  <li><b><a href="https://www.npmjs.com/package/discord-economy-super#starting">Starting</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-economy-super#constructor-options">Constructor Options</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-economy-super#module-methods">Module Methods</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-economy-super#module-properties">Module Properties</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-economy-super#module-events">Module Events</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-economy-super#example-events-usage">Example Events Usage</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-economy-super#shop-methods">Shop Methods</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-economy-super#changelog">Changelog</a></b></li>
  <li><b><a href="https://www.npmjs.com/package/discord-economy-super#useful-links">Useful Links</a></b></li>
</ul>

## Starting
<b>Let's create a simple Discord.js Client:</b>

```js
const { Client, Intents } = require('discord.js'); // npm i discord.js
const client = new Client({ partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'], ws: { intents: Intents.ALL } });

client.on('ready', () => {
  console.log(`${bot.user.tag} is ready!`);
});

client.login('token') // https://discord.com/developers/applications
```
<b>Now we need to import and initialize 'discord-economy-super':</b>

```js
const { Client, Intents } = require('discord.js') // npm i discord.js
const client = new Client({ partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'], ws: { intents: Intents.ALL } });

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
<br>
<b>Now I will explain everything.</b>
<b>This Module has a Constructor to initialize this Economy Module.</b>
<br>

## Constructor Options
<ul>
  <li><b>options.storagePath</b>: <b>Path for JSON File. Default: './storage.json.' (String)</b></li>
  <li><b>options.checkStorage</b>: <b>Checks the if database file exists and if it has errors. Default: true. (Boolean)</b></li>
  <li><b>options.dailyCooldown</b>: <b>Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms. (Number)</b></li>
  <li><b>options.dailyAmount</b>: <b>Amount of money for Daily Command. Default: 100. (Number)</b></li>
  <li><b>options.workCooldown</b>: <b>Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms. (Number)</b></li>
  <li><b>options.workAmout</b>: <b>Amount of money for Work Command. Default: [10, 50]. (Number)</b></li>
  <li><b>options.updateCountdown</b>: <b>Checks for if storage file exists in specified time (in ms). Default: 1000. (Number)</b></li>
  <li><b>options.dateLocale</b>: <b>The region (example: ru; en) to format date and time. Default: ru. (String)</b></li>
  <li><b>options.updater</b>: <b>Update Checker options object:</b>
   <ul>
   <li><b>options.updater.checkUpdates.</b>: <b>Sends the update state message in console on start. Default: true. (Boolean)</b></li>
   <li><b>options.updater.upToDateMessage</b>: <b> Sends the message in console on start if module is up to date. Default: true. (Boolean)</b></li>
</ul>
  <li><b>options.errorHandler</b>: <b>Error Handler options object:</b>
   <ul>
   <li><b>options.errorHandler.handleErrors.</b>: <b>Handles all errors on startup. Default: true. (Boolean)</b></li>
   <li><b>options.errorHandler.attempts</b>: <b>Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5. (Number)</b></li>
    <li><b>options.errorHandler.time</b>: <b>Time between every attempt to start the module. Default: 3000. (Number)</b></li>
</ul>
</ul>
<b>Once the module starts, the update checker will show you a beautiful message in your console!</b>

![Up To Date Example](https://cdn.discordapp.com/attachments/824016114191302699/830855168932315136/Screenshot_6.png)

![Out Of Date Example](https://cdn.discordapp.com/attachments/824016114191302699/830855167120244736/Screenshot_5.png)

## Module Methods
<ul>
  <li><b>fetch(memberID, guildID)</b>: <b>Returns the user's balance. (Number)</b></li>
  <li><b>set(amount, memberID, guildID, reason)</b>: <b>Sets money to user's balance. (Number)</b></li>
  <li><b>add(amount, memberID, guildID, reason)</b>: <b>Adds money to user's balance. (Number)</b></li>
  <li><b>subtract(amount, memberID, guildID, reason)</b>: <b>Subtracts money from user's balance. (Number)</b></li>
<br>
  <li><b>bankFetch(memberID, guildID)</b>: <b>Returns the user's balance. (Number)</b></li>
  <li><b>bankSet(amount, memberID, guildID, reason)</b>: <b>Sets money to user's balance. (Number)</b></li>
  <li><b>bankAdd(amount, memberID, guildID, reason)</b>: <b>Adds money to user's balance. (Number)</b></li>
  <li><b>bankSubtract(amount, memberID, guildID, reason)</b>: <b>Subtracts money from user's balance. (Number)</b></li>
  <br>
  <li><b>daily(memberID, guildID)</b>: <b>Adds a daily reward on user's balance. (Number | String)</b></li>
  <li><b>work(memberID, guildID)</b>: <b>Adds a work reward on user's balance. (Number | String)</b></li>
  <li><b>weekly(memberID, guildID)</b>: <b>Adds a weekly reward on user's balance. (Number | String)</b></li>
  <br>
  <li><b>getDailyCooldown(memberID, guildID)</b>: <b>Returns a user's daily Cooldown. (Number)</b></li>
  <li><b>getWorkCooldown(memberID, guildID)</b>: <b>Returns a user's work Cooldown. (Number)</b></li>
  <li><b>getWeeklyCooldown(memberID, guildID)</b>: <b>Returns a user's weekly Cooldown. (Number)</b></li>
  <br>
  <li><b>clearDailyCooldown(memberID, guildID)</b>: <b>Clears user's daily cooldown. (Boolean)</b></li>
  <li><b>clearWorkCooldown(memberID, guildID)</b>: <b>Clears user's work cooldown. (Boolean)</b></li>
  <li><b>clearWeeklyCooldown(memberID, guildID)</b>: <b>Clears user's weekly cooldown. (Boolean)</b></li>
  <br>
  <li><b>all()</b>: <b>Returns the database contents. (Object)</b></li>
  <li><b>leaderboard(guildID)</b>: <b>Returns a leaderboard array. (Array)</b></li>
  <li><b>checkUpdates()</b>: <b>Checks for if the module is up to date. Returns a promise with data object. (Promise: Object)</b></li>
  <br>
  <li><b>removeGuild(guildID)</b>: Fully removes the guild from database. (Boolean)</li>
  <li><b>removeUser(memberID, guildID)</b>: Removes the user from database. (Boolean)</li>
  <br>
  <li><b>clearStorage()</b>: Clears the storage file. (Boolean)</li>
  <li><b>kill()</b>: Kills the Economy instance. (Economy Instance)</li>
  <li><b>init()</b>: Starts the module. (Promise: Boolean)</li>
</ul>

## Module Properties
<ul>
<li><b>Economy.version</b>: <b>Returns the module version. (Boolean)</b></li>
<li><b>Economy.options</b>: <b>Returns the options object that you put in the Constructor (Object)</b></li>
<li><b>Economy.EconomyError</b>: <b>Returns the error class that this module is using. (Class)</b></li>
<li><b>Economy.shop</b>: <b>Methods to manage and use the shop on your Discord server. (Object)</b></li>
<li><b>Economy.ready</b>: <b>Module ready status. (Boolean)</b></li>
<li><b>Economy.errored</b>: <b>Module errored status. (Boolean)</b></li>
<li><b>Economy.interval</b>: <b>Module errored status. (NodeJS.Timeout)</b></li>
<li><b>Economy.errors</b>: <b>Module errored status. (Object)</b></li>
</ul>

## Module Events
<ul>
<li><b>Economy.on('balanceSet')</b>: <b>Emits when you set the balance. (Object)</b></li>
<li><b>Economy.on('balanceAdd')</b>: <b>Emits when you add money on user's balance. (Object)</b></li>
<li><b>Economy.on('balanceSubtract')</b>: <b>Emits when you subtract money from user's balance. (Object)</b></li>
<br>
<li><b>Economy.on('bankSet')</b>: <b>Emits when you set the bank balance. (Object)</b></li>
<li><b>Economy.on('bankAdd')</b>: <b>Emits when you add money on user's bank balance. (Object)</b></li>
<li><b>Economy.on('bankSubtract')</b>: <b>Emits when you subtract money from user's bank balance. (Object)</b></li>
<br>
<li><b>Economy.on('shopAddItem')</b>: <b>Emits when you add the item in the guild shop. (Object)</b></li>
<li><b>Economy.on('shopEditItem')</b>: <b>Emits when you edit the item in the guild shop. (Object)</b></li>
<li><b>Economy.on('shopRemoveItem')</b>: <b>Emits when you remove the item from the guild shop. (Object)</b></li>
<li><b>Economy.on('shopClear')</b>: <b>Emits when you clear the shop. (Boolean)</b></li>
<li><b>Economy.on('shopItemBuy')</b>: <b>Emits when someone just bought the item from the shop. (Object)</b></li>
<li><b>Economy.on('shopItemUse')</b>: <b>Emits when someone just used the item from his inventory. (Object)</b></li>
</ul>

## Example Events Usage
```js
const { Client, Intents } = require('discord.js') // npm i discord.js
const client = new Client({ partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'], ws: { intents: Intents.ALL } });

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

client.login('token') // https://discord.com/developers/applications
```
<br>

## Shop Methods
<ul>
<li><b>Economy.shop.addItem(guildID, options)</b>: <b>Creates an item in shop. (Object)</b></li>
   <ul>
   <li><b>options.itemName</b>: <b>Name for the item. (String)</b></li>
   <li><b>options.price</b>: <b>Price of the item. (Number)</b></li>
   <li><b>options.message</b>: <b>Item message that will be returned on Economy.shop.buy() method. [Optional] (String)</b></li>
   <li><b>options.description</b>: <b>Description of the item. [Optional] (String)</b></li> 
   <li><b>options.maxAmount</b>: <b>Max amount of item that user can hold in his inventory. [Optional] (Number)</b></li>
   <li><b>options.role</b>: <b>A role ID that bot will give to others users. Please note: you need to specify a bot client in 'Economy.shop.useItem' method if you need to give a role to user on Discord server. [Optional] (String)</b></li>
</ul>
</li> 
<li><b>Economy.shop.buy(itemID, memberID, guildID, reason)</b>: <b>Buys the item from the shop. But if user try to buy an item when he reached the max amount of item in his inventory, it will return a 'max' string. (Boolean | String)</b></li>
<li><b>Economy.shop.clear(guildID)</b>: <b>Clears the shop. (Boolean)</b></li>
<li><b>Economy.shop.clearHistory(memberID, guildID)</b>: <b>Clears the user's purchases history. (Boolean)</b></li>
<li><b>Economy.shop.clearInventory(memberID, guildID)</b>: <b>Clears the user's inventory. (Boolean)</b></li>
<li><b>Economy.shop.editItem(itemID, guildID, arg, value)</b>: <b>Edits the item in shop. The 'arg' parameter must be one of these values: 'description', 'price', 'itemName', 'message', 'maxAmount' and 'role'. (Boolean)</b></li>
<li><b>Economy.shop.history(memberID, guildID)</b>: <b>Shows the user's purchases history. (Array)</b></li>
<li><b>Economy.shop.inventory(memberID, guildID)</b>: <b>Shows all items in user's inventory. (Array)</b></li>
<li><b>Economy.shop.list(guildID)</b>: <b>Shows all items in the shop. (Array)</b></li>
<li><b>Economy.shop.removeItem(memberID, guildID)</b>: <b>Removes an item from the shop. (Boolean)</b></li>
<li><b>Economy.shop.searchItem(memberID, guildID)</b>: <b>Searches for the item in the shop. (Object)</b></li>
<li><b>Economy.shop.useItem(itemID, memberID, guildID, client)</b>: <b>Uses the item from the user's inventory. Please note: 'client' parameter is your bot client and it's required only if your guild shop includes the items that will give a role to other user. If you specified your bot client, user will get his role once he buy the item. (Boolean)</b></li>
</ul>

## Changelog
<b>1.0.1</b>
<ul>
  <li><b>The first version of the module: added a basic methods: 'Economy.fetch()', 'Economy.set()', 'Economy.add()', 'Economy.subtract()', 'Economy.daily()', 'Economy.work()', 'Economy.getDailyCooldown()', 'Economy.getWorkCooldown()', 'Economy.all()' and 'Economy.leaderboard()'. Also added an EconomyError class, but you couldn't use it yourself.</b></li>
</ul>
<b>1.0.2</b>
<ul>
  <li><b>Edited README.md</b></li>
</ul>
<b>1.0.3</b>
<ul>
  <li><b>Fixed bugs.</b></li>
</ul>
<b>1.0.4</b>
<ul>
  <li><b>Fixed bugs.</b></li>
</ul>
<b>1.0.5</b>
<ul>
  <li><b>Fixed bugs.</b></li>
</ul>
<b>1.0.6</b>
<ul>
  <li><b>Edited README.md</b></li>
  <li><b>Fixed bugs.</b></li>
  <li><b>Code optimization</b></li>
  <li><b>Now you can create a shop on your Discord server using Economy.shop methods. They are listed above.</b></li>
  <li><b>Added an 'EconomyError' class property.</b></li>
  <li><b>Added a 'dateLocale' property for options object.</b></li>
</ul>
<b>1.0.7</b>
<ul>
  <li><b>Fixed bugs</b></li>
</ul>
<b>1.0.8</b>
<ul>
<li><b>Edted README.md</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Now this module is including Events. They are listed above.</b></li>
</ul>
<b>1.1.4</b>
<ul>
<li><b>Edted README.md</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Added an update checking system for this module.</b></li>
<li><b>Added a 'checkUpdates' property for options object.</b></li>
</ul>
<b>1.1.5</b>
<ul>
<li><b>Edted README.md</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Updated the examples.</b></li>
<li><b>Fixed the types.</b></li>
<li><b>Added a Table of Contents in README.md</b></li>
<li><b>If you have an earlier Node.js version than v14, you will receive an error.</b></li>
<li><b>Now you can configure the update checking system settings using 'options.updater' properties in constructor options. The 'options.checkUpdates' property was removed in favor of 'options.updater' configuration object. Use 'options.updater.checkUpdates' instead.</b></li>
<li><b>Added an error handler that will work on startup. You can configure it using 'options.errorHandler' properties in constructor options.</b></li>
<li><b>Option properties 'description, 'mesasge' and 'maxAmount', in 'Economy.shop.addItem' method are optional now.</b></li>
<li><b>Now everyone will have a Bank Balance. This is another type of money, you can use it whatever you want. :) | The methods are almost the same: 'Economy.bankFetch()', 'Economy.bankSet()', 'Economy.bankAdd()', 'Economy.bankSubtract()' and 'Economy.bankLeaderboard()'.</b></li>
<li><b>Added a new events for Bank Balance: 'bankSet', 'bankAdd' and 'bankSubtract'.</b></li>
<li><b>Now every balance and bank-balance event object is including 'type' and 'balance' properties. The first property is type of the operation ('set', 'add', 'subtract', 'bankSet', 'bankAdd', 'bankSubtract') and the second is user's new balance after the operation was completed successfully.</b></li>
<li><b>Now you can manually check the module updates using the new 'Economy.checkUpdates()' method.</b></li>
<li><b>Added an additional 'Economy.ready' and 'Economy.errored' properties to check the module state.</b></li>
<li><b>Now you can add a role to users on your Discord server. Click <a href="https://www.npmjs.com/package/discord-economy-super#shop-methods">here</a> for more info.</b></li>
<li><b>Added a new 'shopItemBuy' and 'shopItemUse' events.</b></li>
<li><b>Now if user try to buy an item when he reached the max amount of item in his inventory, the method will return a 'max' string.</b></li>
<li><b>Now this module has a Support Server. Click <b><a href = "https://discord.gg/afUTRzfb">here</a></b> to join!</b></li>
</ul>
<b>1.1.6</b>
<ul>
<li><b>Code optimization.</b></li>
<li><b>Fixed bug with "The module is not ready to work" error on.</b></li>
<li><b>Removed an accidentaly added "discord.js" module from dependencies.</b></li>
</ul>
<b>1.1.7</b>
<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>TypeScript support is finally here! Created a type defenitions for this module.</b></li>
</ul>
<b>1.1.8</b>
<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Now you can disable checking a storage file using the 'options.checkStorage' option.</b></li>
<li><b>Now you can kill the Economy instance using the 'Economy.kill()' method.</b></li>
<li><b>'Economy.init()' method is not private anymore due to 'Economy.kill()' method.</b></li>
<li><b>Added an 'interval' property that displays the database checking interval.</b></li>
<li><b>Now you can clear the entire database using the 'Economy.clearStorage()' method.</b></li>
<li><b>Now this module is using errors that in 'Economy.errors' property and in './src/errors.js' file.</b></li>
<li><b>Now you can clear any cooldown using the 'Economy.clearDailyCooldown', 'Economy.clearWorkCooldown' and ''Economy.clearWeeklyCooldown' methods.</b></li>
<li><b>Added a test for basic Economy methods. You can run it by using these commands:

```console
cd node_modules/discord-economy-super
npm test
```
The test will look like this:

![Test](https://cdn.discordapp.com/attachments/764192017542283325/838226957166313472/Screenshot_4.png)
</b></li>
</ul>
<b>1.1.9</b>
<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed type defenitions.</b></li>
</ul>
<b>1.2.0</b>
<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed typos.</b></li>
<li><b>'Economy.shop.clearInventory' is working fine now.</b></li>
</ul>
<b>1.2.1</b>
<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Now 'Econpmy.work()' method is not taking a daily cooldown as work reward anymore.</b></li>
<li><b>Added an 'Economy.removeGuild()' method to fully remove the guild from database.</b></li>
<li><b>Added an 'Economy.removeUser()' method to to remove the user from database.</b></li>
</ul>

## Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-economy-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super">Github</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/afUTRzfb">Discord Server</a></b></li>
</ul>
<b>If you found a bug, please send it in Discord to ShadowPlay#9706.</b>
<br>
<b>If you have any questions or need help, join the <a href = "https://discord.gg/afUTRzfb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# Thanks for using Discord Economy Super ♥