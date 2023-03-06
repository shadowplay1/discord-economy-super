# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy module for your [Discord Bot](https://discord.js.org/#/).

## Initialation Example

```js
const { Client } = require('discord.js');
const Economy = require('discord-economy-super');

const client = new Client({
  intents: ['GuildMembers', 'GuildMessages'],
});


// all options are optional (and values below are default vales if not specified),
// they were made to configure the module.

// learn more about configuring Economy and see the full options list and full configuring example here:
// https://des-docs.js.org/#/docs/main/1.7.5/general/configuring

let eco = new Economy({
    storagePath: './storage.json',
    updateCountdown: 1000,
    checkStorage: true,
})

client.on('ready', () => {
  console.log(`${client.user.tag} is ready!`);
})

eco.on('ready', economy => {
  console.log(`Economy is ready!`);
  eco = economy
})

client.login('token');
```

## Balance Command

```js
if (command == prefix + 'balance') {
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

  message.channel.send(
      `${message.author}'s balance:\n` +
      `Coins: **${balance}**.\n` +
      `Coins in bank: **${bank}**.`
  )
}
```

## Daily, Work and Weekly Commands

```js
if (command == prefix + 'daily') {
  const guild = eco.guilds.get(message.guild.id)
  const user = guild.users.get(message.author.id)

  const dailyResult = user.rewards.getDaily<false>()

  if (dailyResult.cooldown) {
      return message.channel.send(
          `${message.author}, you can claim your daily reward in ${dailyResult.cooldown.pretty}.`
      )
  }

  message.channel.send(
      `${message.author}, you claimed your **${dailyResult.reward}** daily coins!`
  )
}


if (command == prefix + 'work') {
  const guild = eco.guilds.get(message.guild.id)
  const user = guild.users.get(message.author.id)

  const workResult = user.rewards.getWork<true>()

  if (workResult.cooldown) {
      return message.channel.send(
          `${message.author}, you can work again in ${workResult.cooldown.pretty}.`
      )
  }

  message.channel.send(
      `${message.author}, you worked hard and earned **${workResult.reward}** coins!`
  )
}


if (command == prefix + 'weekly') {
  const guild = eco.guilds.get(message.guild.id)
  const user = guild.users.get(message.author.id)

  const weeklyResult = user.rewards.getWeekly<true>()

  if (weeklyResult.cooldown) {
      return message.channel.send(
          `${message.author}, you can claim your weekly reward in ${weeklyResult.cooldown.pretty}.`
      )
  }

  message.channel.send(
      `${message.author}, you claimed your **${weeklyResult.reward}** weekly coins!`
  )
}
```

## Deposit & Withdraw Commands

```js
if (command == prefix + 'deposit') {
  const guild = eco.guilds.get(message.guild.id)
  const user = guild.users.get(message.author.id)

  const userBalance = user.balance.get()
  const amount = parseInt(args[0])

  if (userBalance < amount) {
      return message.channel.send(
          `${message.author}, you don't have enough coins` +
          `to perform this deposit.`
      )
  }

  user.balance.subtract(amount, `depositted ${amount} coins`)
  user.bank.add(amount, `depositted ${amount} coins`)

  message.channel.send(
      `${message.author}, you deposited **${amount}** coins to your bank.`
  )
}


if (command == prefix + 'withdraw') {
  const guild = eco.guilds.get(message.guild.id)
  const user = guild.users.get(message.author.id)

  const userBankBalance = user.bank.get()
  const amount = parseInt(args[0])

  if (userBankBalance < amount) {
      return message.channel.send(
          `${message.author}, you don't have enough coins` +
          `in your bank to perform this withdraw.`
      )
  }

  user.bank.subtract(amount, `withdrew ${amount} coins`)
  user.balance.add(amount, `withdrew ${amount} coins`)

  message.channel.send(
      `${message.author}, you withdrew **${amount}** coins from your bank.`
  )
}
```

# Shop Add & Display, Item Buy & Item Use

```js
// Display the guild shop
if (command == prefix + 'shop') {
    const guildShop = eco.shop.all()

    if (!guildShop.length) {
        return message.channel.send(`${message.author}, there are no items in the shop.`)
    }

    message.channel.send(
        `**${message.guild.name}** - Guild Shop **[${guildShop.length} items]**:\n\n` +

        `${guildShop
            .map((item, index) => `${index + 1} - **${item.name}** (ID: **${item.id}**) - **${item.price}** coins`)
            .join('\n')}`
    )
}

// Add the item to the shop
if (command == prefix + 'shop_add') {
    const guild = eco.guilds.get(message.guild.id)
    const user = guild.users.get(message.author.id)

    const [name, emoji, priceString] = args

    const price = parseInt(priceString)
    const messageOnUse = args.slice(3).join(' ') 
    
    // message on use is optional and defaults to `You have used this item!`

    // supports choosing a random string from a specified strings list with following syntax:
    // [random="str", "str1", "str2"]

    // for example, if specifying `What a [random="wonderful", "great", "sunny"] day!` as message on use
    // then in returned message, `[random="wonderful", "great", "sunny"]` will be replaced with either
    // "wonderful", "great" or "sunny".

    if (!name) {
        return message.channel.send(`${message.author}, please provide a name for the item.`)
    }

    if (!price) {
        return message.channel.send(`${message.author}, please provide a price for the item.`)
    }

    // see all the available item options here:
    // https://des-docs.js.org/#/docs/main/1.7.5/typedef/AddItemOptions

    // learn more about custom item data:
    // https://des-docs.js.org/#/docs/main/1.7.5/general/custom-data

    const newItem = guild.shop.addItem({
        name,
        price,
        message: messageOnUse || ''
    })

    message.channel.send(
        `${message.author}, you added **${newItem.name}** for **${newItem.price}** coins to the shop.`
    )
}

// Buy an item from the shop
// (adds the item to user's inventory and 
// subtracts its price from the user's balance if `subtractOnBuy` option is `true`)

// Learn more about configuring Economy:
// https://des-docs.js.org/#/docs/main/1.7.5/general/configuring
if (command == prefix + 'shop_buy') {
    const guild = eco.guilds.get(message.guild.id)
    const user = guild.users.get(message.author.id)

    const [itemID, quantityString] = args
    const quantity = parseInt(quantityString) || 1

    const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

    if (!itemID) {
        return message.channel.send(`${message.author}, please specify an item.`)
    }

    if (!item) {
        return message.channel.send(`${message.author}, item not found.`)
    }

    if (!item.isEnoughMoneyFor(message.author.id, quantity)) {
        return message.channel.send(
            `${message.author}, you don't have enough coins to buy ` +
            `**x${quantity} ${item.custom.emoji} ${item.name}**.`
        )
    }

    const buyingResult = user.items.buy(item.id, quantity)

    if (!buyingResult.status) {
        return message.channel.send(`${message.author}, failed to buy the item: ${buyingResult.message}`)
    }

    message.channel.send(
         `${message.author}, you bought **x${buyingResult.quantity} ` +
        `${item.custom.emoji} ${item.name}** for **${buyingResult.totalPrice}** coins.`
    )
}

// Use the item from user inventory
if (command == prefix + 'shop_use') {
    const [itemID] = args
    const item = inventory.find(item => item.id == parseInt(itemID) || item.name == itemID)

    if (!itemID) {
        return message.channel.send(`${message.author}, please specify an item in your inventory.`)
    }

    if (!item) {
        return message.channel.send(`${message.author}, item not found in your inventory.`)
    }

    // client is an optional parameter in `use` methods for items
    
    // the module does not depend on discord.js so it cannot do anything from your bot
    // specifying your bot client here allows automatically add the role whose ID was specified when creating the item

    // `use` method returns a message to be sent on using the item

    const resultMessage = item.use(client)
    message.channel.send(resultMessage)
}
```

# Custom Currencies

```js
// Create a currency for the guild
if (command == prefix + 'createCurrency') {
    const [name, symbol] = args
    
    eco.currencies.create(name, symbol, message.guild.id)
    message.channel.send(`Successfully created a new **${name} (${symbol})** currency!`)
}

// Check the currency balance on the guild
if (command == prefix + 'currencyBalance') {
    // (currency ID, currency name or currency symbol) means that
    // either currency ID (currency's unique ID), currency name or currency symbol
    // could be provided in `currency` methods.

    // currency names and symbols are NOT case sensetive!

    const [userID] = args
    const guild = eco.guilds.get(message.guild.id)

    const guildUser = guild.users.get(
        message.mentions.users.first()?.id ||
        message.guild.users.get(userID) ||
        message.author.id
    )

    const user = guild.users.get(guildUser.id)

    // here, the `get()` method fetches the user balance for specified currency and
    // `getCurrency()` method fetches the info object about specified currency

    const [currencyBalance, currency] = [
        user.balance.currency('(currency ID, currency name or currency symbol)').get(),
        user.balance.currency('(currency ID, currency name or currency symbol)').getCurrency()
    ]

    message.channel.send(
        `${message.author}'s balance: **${currencyBalance}** ${currency.symbol}`
    )
}

// Add the money on currency balance on the guild
if (command == prefix + 'currencyAdd') {
    const [userID, amount] = args
    const guild = eco.guilds.get(message.guild.id)

    const guildUser = guild.users.get(
        message.mentions.users.first()?.id ||
        message.guild.users.get(userID) ||
        message.author.id
    )

    const user = guild.users.get(guildUser.id)

    user.balance.currency('(currency ID, currency name or currency symbol)').add(amount)
    message.channel.send('Adding successful!')
}

// Subtract the money from currency balance on the guild
if (command == prefix + 'currencySubtract') {
    const [userID, amount] = args
    const guild = eco.guilds.get(message.guild.id)

    const guildUser = guild.users.get(
        message.mentions.users.first()?.id ||
        message.guild.users.get(userID) ||
        message.author.id
    )

    const user = guild.users.get(guildUser.id)

    user.balance.currency('(currency ID, currency name or currency symbol)').subtract(amount)
    message.channel.send('Subtracting successful!')
}
```
See the full bot examples for both MongoDB and JSON databases in both JavaScript and TypeScript [here](https://github.com/shadowplay1/discord-economy-super/tree/main/examples)!

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
