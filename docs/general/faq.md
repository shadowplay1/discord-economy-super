# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy module for your [Discord Bot](https://discord.js.org/#/).

## ❓ | Frequently Asked Questions

### **Q:** Is it possible to use MongoDB in Economy?

#### **A:** Of course! Just follow the [migration guide](https://des-docs.js.org/#/docs/main/1.7.5/general/migrating-to-mongo) to start using Economy with MongoDB.

<br>

### **Q:** I have dublicate items in my inventory. How do I filter them out?

#### **A:** There's a `stack()` method in `InventoryItem` that allows you to do this easliy:
```js
// Assuming that `inventory` variable is inventory array (e. g. array of `InventoryItem`s):

message.channel.send(
	`${message.author} - User Inventory [**${inventory.length}** items]:\n\n` +

	inventory.map((item, index) => {
    	const stackedItem = item.stack()

    	const entry =
        	`${index + 1} - **x${stackedItem.quantity} ${stackedItem.item.name}** - ` +
        	`${stackedItem.totalPrice} coins in total`

    	return entry
	}).join('\n')
)
```

<br>

### **Q:** Why do I get a "Cannot read property '(any manager property or method)' of null"?

#### **A:** Because the module is not started and not ready yet. Assign the economy property to your bot client or reassign the economy variable in "ready" event to fix this problem:

```js
const Economy = require('discord-economy-super')
let economy = new Economy(options)

economy.on('ready', eco => {
    <client>.eco = eco
	// or
	economy = eco
})


// both ways will work fine:

const economyUsers = eco.users.all()
const economyUsers1 = bot.eco.users.all()
```

<br>

### **Q:** Why do I get a "SyntaxError: Unexpected token '.' "?

#### **A:** Because the module is supporting only Node.js v14.0.0 or above. Earlier versions are not supporting the "?." operator. You need to update Node.js to make the module work.

<br>

### **Q:** Why is the code from examples not working?

#### **A:** Examples provided in documentation and in GitHub are for one-file bot. For multiple-files bot it might need to be changed. See the questions above to get more info. If it's a bug, see the question below.

### **Q:** I found a bug or have an idea. Where I could submit it?

#### **A:** In our [Support Server](https://discord.gg/4pWKq8vUnb). We appreciate that!

<br>

### **Q:** Can I use the module globally?

#### **A:** Yes! Just use a static value (such as 'global', '123', etc.) as guildID in all methods, and the module will work like with only one guild. 
#### For example, we have this database: 

```js
{
    "global": {
	    "123": {
		    "money": 1150,
		    "dailyCooldown": 1638034751398,
		    "weeklyCooldown": 1636811771994,
		    "workCooldown": 1636817161065,
		    "inventory": [],
		    "history": []
	    }
    },
	"other_guild_id": {
		"123": {
			"money": 2000,
			"dailyCooldown": 1638034751398,
			"weeklyCooldown": 1636811771994,
			"workCooldown": 1636817161065,
			"inventory": [],
			"history": []
		}
	}
}
```

And here's the example code with that database:
```js
const STATIC_GUILD_ID = 'global'
const OTHER_GUILD_ID = 'other_guild_id'

const guild = eco.guilds.get(STATIC_GUILD_ID)
const guild1 = eco.guilds.get(OTHER_GUILD_ID)

const user = guild.users.get('123')
const user1 = guild1.users.get('123')

const balance = user.balance.get() // 1150
const balance1 = user1.balance.get() // 2000
```
In this code, `global` and `other_guild_id` are different values. It means, that the module will search for the data in different guilds. Using the same value will search for the data in the same guild. So, the data from every Discord guild will be stored in the same Economy guild and the data will be accessible on every Discord guild.

See [this page](https://des-docs.js.org/#/docs/main/1.7.5/general/global) for additional info about using the module globally.

<br>

### **Q:** Can I send a random messages on using the item?

#### **A:** Yes! Here's the example of it:

Random string syntax: `[random="item1", "item2", "etc..."]`
Example usage:

```js
const guild = eco.guilds.get('guildID')
const user = eco.users.get('userID')

guild.shop.addItem({
  name: 'good day',
  price: 100,
  message: 'What a [random="wonderful", "great", "sunny"] day!',
});

user.items.buy(1, "memberID", "guildID")

eco.inventory.useItem(1, "memberID", "guildID"); // What a wonderful day!
eco.inventory.useItem(1, "memberID", "guildID"); // What a great day!
eco.inventory.useItem(1, "memberID", "guildID"); // What a sunny day!

// In a returning string, [random="wonderful", "great", "sunny"]
// will be replaced with the any of
// the words "wonderful", "great" or "sunny".
```

<br>

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
