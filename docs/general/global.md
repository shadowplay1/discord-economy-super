# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy module for your [Discord Bot](https://discord.js.org/#/).

## Introduction
So, `discord-economy-super` is built with multi-guild support, but many of the users were asking how to create a __global__ economy, where all the data is cross-guild, where all the data is available on all the guilds.

There is a way, and it's very simple!

## Using the module globally
To make the data in your economy cross-guild, just use a static value (such as `'global'`, `'123'`, etc.) as **guild ID** in all methods, and the module will work like with only one guild.

For example: `eco.users.get(message.author.id, 'global')`, where `'global'` is a static value for the guild ID.

`UserManager.get()` accepts a **member ID** and **guiid ID** as the arguments. If you need to store the data globally, you need to use any static value everywhere.
It means, the module will work with `'global'` guild, where all the data will be stored. 

All the operations will be performed only to this "guild", so the data won't be lost on any other server!
See the [FAQ page](https://des-docs.js.org/#/docs/main/1.7.5/general/faq) to see the full example of global economy usage.

## How do I move the data from the guilds to the Global one?
Use the loop, where you iterate all the database entries, getting the object of every guild, then getting all the guild users and pushing them into the Global guild.

You can delete the guilds, if it's needed.

```js
const STATIC_GLOBAL_GUILD_ID = 'global'

const database = eco.database.all()
const databaseEntries = Object.entries(database)

for (const [guildID, guildObject] of databaseEntries) {
    const guildUserEntries = Object.entries(guildObject)

    eco.database.delete(guildID)

    for (const [userID, userObject] of guildUserEntries) {
        eco.database.set(`${STATIC_GLOBAL_GUILD_ID}.${userID}`, userObject)
    }
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
