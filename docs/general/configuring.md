# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy module for your [Discord Bot](https://discord.js.org/#/).

## Introduction
You know that the module has a lot of different settings and you can set them up like you want. In this article, we will go through everything about configuring the Economy system and how to set it up for different guilds!

## Available Options
Full list of available Economy options is available [here](https://des-docs.js.org/#/docs/main/1.7.5/typedef/EconomyConfiguration).

Please note: 
1. For JSON version, all the options for are **optional** 
2. For MongoDB version, `connection` object is required to be specified in the configuration for MongoDB version. [Learn more about connecting MongoDB to Economy](https://des-docs.js.org/#/docs/main/1.7.5/general/migrating-to-mongo)

## Passing Configuration to the Module
There are 2 ways of passing the configuration object to the module:
- Specifying the config in the constructor:

```js
new Economy({
    // configuration goes here...
})
```
- Or making the `economy.config.js` or `economy.config.ts` file **(depends on which language your project is using - JavaScript or TypeScript)** in root of your project directory *(that's why specifying the config in constructor in MongoDB version is optional even though the `connection` property is required)*:

```js
/* ./economy.config.js */

/**
 * put `discord-economy-super/mongodb/EconomyItems.d.ts` if using MongoDB version of Economy
 * @type {import('discord-economy-super/EconomyItems.d.ts').EconomyConfiguration} 
 */
const economyConfig = {
    // configuration goes here...
}

module.exports = economyConfig
```

```ts
/* ./economy.config.ts */

// put `discord-economy-super/mongodb/EconomyItems` if using MongoDB version of Economy
import { EconomyConfiguration } from 'discord-economy-super/EconomyItems' 

const economyConfig: EconomyConfiguration {
    // configuration goes here...
}

export default economyConfig
```
If using the config file, the module will use them **first**. 

**Don't specify the options in the constructor if using the file to avoid confusion!**

## Daily, Work & Weekly Rewards Configuration
`dailyAmount`, `workAmount` and `weeklyAmount` setting are accepting the **number** or an **array** of 2 numbers - `[min, max]`.

Passing the `[min, max]` array allows to pick the random number in range between `min` and `max` to add on the user's balance when claiming rewards!

Use a *single number* for static reward amount values.

```js
dailyAmount: [100, 500] // when claiming the daily reward, a random number between 100 and 500 will be picked and added to the user' balance
workAmount: [10, 50] // the same as `dailyAmount` but the range is between 10 and 50
weeklyAmount: 1000 // static value - 1000 will be added to the user's balance on claiming weekly reward, passing the [min, max] array is still allowed.
```

## Configuring Economy for Different Guilds
To edit the configuration keys for a specific guild, you may use the [SettingsManager](https://des-docs.js.org/#/docs/main/1.7.5/class/SettingsManager) for this:
```js
eco.settings.set('key', value, 'guildID')
```
Once the key is edited, **the value from settings** will be used on specified server for the key.
For example, let's change the `dailyAmount` setting to `500` (default is `100`) for guild with ID `'123'`:
```js
eco.settings.set('dailyAmount', 500, '123')
```
From now, everyone on guild with ID `'123'` will receive **500** coins on dailies instead of **100**. This change will affect only our guild with ID `'123'`.

## Full Configuration Example
Here's the **full** example of Economy configuration object and how everything should look like.

This example will contain default values for each setting. 

Note that all settings (except `connection` for MongoDB version) are **optional** and you won't have to specify them all!

```js
const economyConfigExample = {
    storagePath: './storage.json', // specify if using JSON version (optional)
    updateCountdown: 1000, // specify if using JSON version (optional)
    checkStorage: true, // specify if using JSON version (optional)

    connection: { // specify if using MongoDB version (required)
        connectionURI: '...', // mongodb connection URI
        collectionName: 'database', // specify if using MongoDB version (optional)
        dbName: 'db', // specify if using MongoDB version (optional)
        mongoClientProperties: {} // specify if using MongoDB version (optional)
    },

    dailyAmount: 100, // [min, max] array allowed
    workAmount: [10, 50], // [min, max] array allowed
    weeklyAmount: 1000, // [min, max] array allowed
    dailyCooldown: 86400000,
    workCooldown: 3600000,
    weeklyCooldown: 604800000,
    sellingItemPercent: 75,
    savePurchasesHistory: true,
    deprecationWarnings: true,
    dateLocale: 'en',
    subtractOnBuy: true,

    updater: {
        checkUpdates: true,
        upToDateMessage: false
    },

    errorHandler: {
        handleErrors: true,
        attempts: 5,
        time: 5000
    },

    optionsChecker: {
        ignoreInvalidTypes: false,
        ignoreUnspecifiedOptions: true,
        ignoreInvalidOptions: false,
        showProblems: true,
        sendLog: true,
        sendSuccessLog: false
    },

    debug: false
}
```

## ❗ | Useful Links

<ul>
<li><b><a href = 'https://www.npmjs.com/package/discord-economy-super'>NPM</a></b></li>
<li><b><a href = 'https://github.com/shadowplay1/discord-economy-super'>GitHub</a></b></li>
<li><b><a href = 'https://github.com/shadowplay1/discord-economy-super/tree/main/examples'>Bot Examples</a></b></li>
<li><b><a href = 'https://discord.gg/4pWKq8vUnb'>Discord Server</a></b></li>
</ul>
<b>If you found a bug, have any questions or need help, join the <a href = 'https://discord.gg/4pWKq8vUnb'>Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for choosing Discord Economy Super ❤️
