# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy module for your [Discord Bot](https://discord.js.org/#/).

# MongoDB Migration Guide

## Introduction

Before we start, I'd like to say about the most important changes in MongoDB version of economy.<br>
Firstly, you have to use (async/await)s to get methods' values as it had to be moved to Promises usage.<br>
For example, this code:

```js
const guild = eco.guilds.get("123");
const user = guild.users.get("321");

console.log(guild);
console.log(user);
```

should be changed to this:

```js
// in async function

const guild = await eco.guilds.get("123");
const user = await guild.users.get("321");

console.log(guild);
console.log(user);
```

or this:

```js
eco.guilds.get("123").then((guild) => {
  guild.users.get("321").then((user) => {
    console.log(guild);
    console.log(user);
  });
});
```

## First Steps

To use the Mongo version of Economy, we need to require it:

```js
const Economy = require("discord-economy-super/mongodb");
// or:
import Economy from "discord-economy-super/mongodb";
```

## Configuring the Connection

Now we need to configure the connection to MongoDB. In this version, having a configuration object is required as we need to provide the connection data to our cluster.

Please note that `storagePath`, `checkStorage` and `updateCountdown` options were removed as they don't belong to MongoDB.

```js
const eco = new Economy({
    connection: {
        connectionURI: '...', // mongodb connection URI
        collectionName: 'collection', // optional
        dbName: 'db' // optional
        mongoClientOptions: { ... } // optional
    }
})
```

## Important Things

- `FetchManager`, `DotParser` and everything JSON-related was deleted.
- All the code in MongoDB version is 100% Promise based.
- All the deprecated methods were removed from MongoDB version as they caused a lot of problems.

## Before you start...

Version 1.6.1 has A LOT of changes (including breaking ones), it got a lot of new features and bugfixes, the code you will write will become better and more understandable with the powers of **brand new** `BaseManager`, `UserManager`, `GuildManager`'s and lots of new **Classes**!

Also the typings are now way better with the power of **generic** methods and generic types!

I suggest you to read the [changelog](https://des-docs.js.org/#/docs/main/1.7.5/general/changelog) and the [documentation](https://des-docs.js.org/#/docs/main/1.7.5/general/welcome) to know what's new, what's changed and how to update your code.

Also you can check the [summary](https://des-docs.js.org/#/docs/main/1.7.5/general/updating) to see the main changes in this update.

Now, remove the usage all the deprecated methods (in MongoDB version, all deprecated methods were removed), change your code to async/awaits and you're ready to go!

Here's a little working MongoDB example:

```js
const eco = new Economy({
    connection: {
        connectionURI: '...', // mongodb connection uri
        collectionName: 'collection', // optional
        dbName: 'db' // optional
        mongoClientOptions: { ... } // optional
    }
})

eco.on('ready', async () => {
    console.log('Economy is ready!')

    const guild = await eco.guilds.get('guildID')
    const user = await guild.users.get('userID')

    const dailyReward = await user.rewards.getDaily()


    console.log(guild.id)
    console.log(user.id)

    console.log(dailyReward)
})
```

All the examples for both JavaScript and TypeScript are available on [GitHub](https://github.com/shadowplay1/discord-economy-super/tree/main/examples).

## ❗ | Useful Links

<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-economy-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super/tree/main/examples">Bot Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<b>If you found a bug, have any questions or need help, join the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for choosing Discord Economy Super ❤️
