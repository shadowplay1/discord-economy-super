# Discord Economy Super - GitHub Repository

<b>Discord Economy Super</b> - module that can be used in the bot that writed using [discord.js library](https://discord.js.org/#/)

## Installing
```console
NPM:
npm i discord-economy-super

Yarn:
yarn add discord-economy-super
```

## Starting
<b>Let's create simple Discord.JS Client:</b>
```js
const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
  console.log('Client is Ready!');
});

client.login('token') // https://discord.com/developers/applications
```
<b>Now we need to import and initialize 'discord-economy-super':</b>
```js
const { Client } = require('discord.js');
const client = new Client();

const Economy = require('discord-economy-super');
const Eco = new Economy({
  storagePath: './storage.json', // Storage of JSON File.
  
  dailyCooldown: 60000 * 60 * 24, // Daily Cooldown (1 Day for Now).
  workCooldown: 60000 * 60, // Work Cooldown (1 Hour for Now).
  
  dailyAmount: 100, // Daily Amount.
  workAmount: [10, 50] // Work Amount (It can be not an Array, just a Number).
});

client.on('ready', () => {
  console.log('Client is Ready!');
});

client.login('token') // https://discord.com/developers/applications
```
<br>
<b>Now I explain, what shows this code:</b>
<b>This Module has a Constructor to initialize this Economy Module.</b>
<br />
<b>Constructor Options:</b>
<ul>
  <li><b>options.storagePath</b>: <b>Path for JSON File (String).</b></li>
  <li><b>options.dailyCooldown</b>: <b>Cooldown for Daily Command (Number).</b></li>
  <li><b>options.dailyAmount</b>: <b>Amount for Daily Command (Number).</b></li>
  <li><b>options.workCooldown</b>: <b>Cooldown for Work Command (Number).</b></li>
  <li><b>options.workAmout</b>: <b>Cooldown for Work Command (Number or Array).</b></li>
</ul>
<b>Module Method that You can use:</b>
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

## Other
<b>If You found a bug, please DM in Discord to "ShadowPlay#9706"!</b> <br />
<b>Module Created by ShadowPlay#9706</b>
# Thanks for using Discord Economy Super ♥!
