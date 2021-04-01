# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy framework for your [Discord Bot](https://discord.js.org/#/)!

## Installation
```console
NPM:
npm i discord-economy-super
Yarn:
yarn add discord-economy-super
```

## Starting
<b>Let's create a simple Discord.js Client:</b>
```js
const { Client } = require('discord.js') // npm i discord.js
const client = new Client()

client.on('ready', () => {
  console.log(`${bot.user.tag} is ready!`)
})

client.login('token') // https://discord.com/developers/applications
```
<b>Now we need to import and initialize 'discord-economy-super':</b>
```js
const { Client } = require('discord.js') // // npm i discord.js
const client = new Client();

const Economy = require('discord-economy-super');
const Eco = new Economy({
  storagePath: './storage.json', // Storage of JSON File. Default: ./storage.json.
  dailyCooldown: 60000 * 60 * 24, // Daily Cooldown, ms (24 Hours = 1 Day).
  workCooldown: 60000 * 60, // Work Cooldown, ms (1 Hour).
  dailyAmount: 100, // Daily Amount.
  workAmount: [10, 50] // Work Amount: first element is min value, second is max value (It also can be a Number).
  updateCountdown: 1000 // Checks for if storage file exists in specified time (in ms). Default: 1000.
  dateLocale: 'ru' // The region (example: ru; en) to format date and time. Default: ru.
});

client.on('ready', () => {
  console.log(`${bot.user.tag} is ready!`);
});

client.login('token') // https://discord.com/developers/applications
```
<br>
<b>Now I will explain everything.</b>
<b>This Module has a Constructor to initialize this Economy Module.</b>
<br/>
<b>Constructor Options:</b>
<ul>
  <li><b>options.storagePath</b>: <b>Path for JSON File. Default: ./storage.json. (String)</b></li>
  <li><b>options.dailyCooldown</b>: <b>Cooldown for Daily Command (in ms). (Number)</b></li>
  <li><b>options.dailyAmount</b>: <b>Amount of money for Daily Command. (Number)</b></li>
  <li><b>options.workCooldown</b>: <b>Cooldown for Work Command (in ms). (Number)</b></li>
  <li><b>options.workAmout</b>: <b>Amount of money for Work Command. (Number)</b></li>
  <li><b>options.updateCountdown</b>: <b>Checks for if storage file exists in specified time (in ms). Default: 1000. (Number)</b></li>
  <li><b>options.dateLocale</b>: <b>The region (example: ru; en) to format date and time. Default: ru. (String)</b></li>
</ul>
<b>Module Methods:</b>
<ul>
  <li><b>fetch(memberID, guildID)</b>: <b>Returns User's balance.</b></li>
  <li><b>set(amount, memberID, guildID)</b>: <b>Set's Balance to User.</b></li>
  <li><b>add(amount, memberID, guildID)</b>: <b>Add's Balance to User.</b></li>
  <li><b>subtract(amount, memberID, guildID)</b>: <b>Remove's Balance to User.</b></li>
  <li><b>all()</b>: <b>Return's All Guild Base.</b></li>
  <li><b>daily(memberID, guildID)</b>: <b>Use with Daily Command.</b></li>
  <li><b>work(memberID, guildID)</b>: <b>Use with Work Command.</b></li>
  <li><b>getDailyCooldown(memberID, guildID)</b>: <b>Return's User Daily Cooldown.</b></li>
  <li><b>getWorkCooldown(memberID, guildID)</b>: <b>Return's User Work Cooldown.</b></li>
  <li><b>leaderboard(guildID)</b>: <b>Return's Array with Objects (userID and Money).</b></li>
</ul>
<b>Module Properties:</b>
<ul>
<li><b>Economy.version</b>: <b>Returns the module version.</b></li>
<li><b>Economy.options</b>: <b>Returns the options object that you put in the Constructor</b></li>
<li><b>Economy.EconomyError</b>: <b>Returns the error class that this module is using.</b></li>
<li><b>Economy.shop</b>: <b>Methods to manage and use a shop on your Discord server.</b></li>
</ul>
<b>Shop Methods</b>
<ul>
<li><b>Economy.shop.addItem(guildID, options)</b>: <b>123</b></li>
<li><b>Economy.shop.buy(itemID, memberID, guildID)</b>: <b>123</b></li>
<li><b>Economy.shop.clear(guildID)</b>: <b>123</b></li>
<li><b>Economy.shop.clearHistory(memberID, guildID)</b>: <b>123</b></li>
<li><b>Economy.shop.clearInventory(memberID, guildID)</b>: <b>123</b></li>
<li><b>Economy.shop.editItem(itemID, guildID, arg)</b>: <b>123</b></li>
<li><b>Economy.shop.history(memberID, guildID)</b>: <b>123</b></li>
<li><b>Economy.shop.inventory(memberID, guildID)</b>: <b>123</b></li>
<li><b>Economy.shop.list(guildID)</b>: <b>123</b></li>
<li><b>Economy.shop.removeItem(memberID, guildID)</b>: <b>123</b></li>
<li><b>Economy.shop.searchItem(memberID, guildID)</b>: <b>123</b></li>
<li><b>Economy.shop.useItem(memberID, guildID)</b>: <b>123</b></li>
</ul>
<b>Economy.shop.addItem method options:</b>
<li><b>options.itemName</b>: <b>Name for the item. (String)</b></li>
<li><b>options.price</b>: <b>Price for the item. (Number)</b></li>
<li><b>options.message</b>: <b>Item message that will be returned on Economy.shop.buy() method. (String)</b></li>
<li><b>options.description</b>: <b>Description of the item. (String)</b></li> 
<li><b>options.maxAmount</b>: <b>Max amount of item that user can hold in his inventory. (Number)</b></li>
</li>

## Changelog
<b>1.0.1</b>
<ul>
  <li><b>The first version of the module.</b></li>
</ul>
<b>1.0.2</b>
<ul>
  <li><b>Edited README.md</b></li>
</ul>
<b>1.0.3</b>
<ul>
  <li><b>Fixed bugs</b></li>
</ul>
<b>1.0.4</b>
<ul>
  <li><b>Fixed bugs</b></li>
</ul>
<b>1.0.5</b>
<ul>
  <li><b>Fixed bugs</b></li>
</ul>
<b>1.0.6</b>
<ul>
  <li><b>Edited README.md</b></li>
  <li><b>Fixed bugs</b></li>
  <li><b>Code optimization</b></li>
  <li><b>Now you can create a shop on your Discord server using Economy.shop methods</b></li>
  <li><b>Added a 'dateLocale' property for options object</b></li>
</ul>

## Other
<b>If you found a bug, please send them in Discord to ShadowPlay#9706!</b> <br/>
<b>Module Created by ShadowPlay.</b>
# Thanks for using Discord Economy Super ♥!
