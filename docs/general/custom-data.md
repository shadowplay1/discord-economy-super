# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy module for your [Discord Bot](https://discord.js.org/#/).

## Introduction
*Shop Items*, *Inventory Items*, *History Items* and *Currencies* have got the `custom` property in their objects. In this article, the magic `custom` property and its usage will be explained!

## Custom Property Explained
The `custom` property is a normal JavaScript object and is made to store any custom information inside the object. Literally anything!

By default, this property is an empty object (`{}`) but you may change its value anytime!

Here's the list of `classes` / `managers` that have support of Custom Item Data (the `custom` property):

- `ShopItem` / `ShopManager`
- `InventoryItem` / `InventoryManager`
- `HistoryItem` / `HistoryManager`
- `Currency` / `CurrencyManager`

## Taking A Look
Let's say we want a shop item that can be hidden, locked and will have its own emoji to display.

Let's add the item in the shop:

```js
guild.shop.addItem({
    name: 'Testing Item 123',
    price: 500,
    message: 'Hello World!',

    custom: { // defaulting all the custom object values that we want to have
        emoji: '👍',
        hidden: false,
        locked: false
    }
})
```
For TypeScript, we can add an interface for our custom item data object and use **generics** for better experience:
```ts
guild.shop.addItem<ICustomItemData>({
    name: 'Testing Item 123',
    price: 500,
    message: 'Hello World!',

    custom: { // `custom` property and all properties inside will refer to `ICustomItemData` interface
        emoji: '👍',
        hidden: false,
        locked: false
    }
})

interface ICustomItemData {
    emoji: string
    hidden: boolean
    locked: boolean
}
```
So, now we have the item in our database, let's try getting it. There are a few ways to do it, any of this ways is correct and will work fine (continuing in TypeScript):
```ts
import { ShopItem } from 'discord-economy-super/EconomyItems' // put `discord-economy-super/mongodb/EconomyItems` if using MongoDB version - this is important!
// ^ this is not required if using JavaScript

// 1.
const item = eco.shop.findItem<ICustomItemData>(itemID, 'guildID')

// 2.
const economyGuild = eco.guilds.get('guildID')
const item = economyGuild.shop.findItem<ICustomItemData>(itemID)

// 3.
const economyGuild = eco.guilds.get('guildID')
const item = economyGuild.shop.find<ShopItem<CustomItemData>>(item => item.id == itemID) // or any other condition to find the item with

// 4. (for MongoDB)
const shop = eco.cache.shop.get<ShopItem<ICustomItemData>>({
    guildID: 'guildID'
})

const item = shop.find(item => item.id == itemID) // or any other condition to find the item with


item.custom // { emoji: '👍', hidden: false, locked: false } 
//   ^ will refer to `ICustomItemData` interface
```

Now let's try changing our object: let's hide and lock it. But there are also a few different ways do edit out item! Feel free to use any of them:
```ts
// 1. (custom object only)
item.setCustom<ICustomItemData>({
    emoji: '👍',
    hidden: true,
    locked: true
})

// 2.
item.edit('custom', {
    emoji: '👍',
    hidden: true,
    locked: true
})

// 3.
item.custom = {
    emoji: '👍',
    hidden: true,
    locked: true
}

item.save()
```

Now let's get its `custom` property again:
```ts
item.custom // { emoji: '👍', hidden: true, locked: true }
```
And here it is! The object inside that property was successfully changed!

## Command Examples
So we have a shop that can be received in 3 different ways:
```ts
import { ShopItem } from 'discord-economy-super/EconomyItems' // put `discord-economy-super/mongodb/EconomyItems` if using MongoDB version - this is important!
// ^ this is not required if using JavaScript

// 1.
const item = eco.shop.all<ICustomItemData>(itemID, 'guildID')

// 2.
const economyGuild = eco.guilds.get('guildID')
const item = economyGuild.shop.all<ICustomItemData>(itemID)

// 3. (for MongoDB)
const shop = eco.cache.shop.get<ShopItem<ICustomItemData>>({
    guildID: 'guildID'
})
```

Now let's say we have a shop with hidden and locked items - we need to display the shop correctly: display the emoji we put earlier, don't show the hidden items and tell if the item is locked and not buyable:

```ts
if (command == prefix + 'shop') {
    const shop = eco.
    const guildShop = shop.filter(item => !item.custom.hidden) // filtering out the hidden items

    if (!guildShop.length) { // checking if there's anything in the shop
        return message.channel.send(`${message.author}, there are no items in the shop.`)
    }

    message.channel.send(
        `**${message.guild.name}** - Guild Shop **[${guildShop.length} items]**:\n\n` +

        `${guildShop
            .map((item, index) =>
                `${index + 1} - ${item.custom.locked ? ' 🔒 | ' : ' '}${item.custom.emoji} ` + // if the item is locked and not buyable, it will have the 🔒 icon next to th item's emoji
                `**${item.name}** (ID: **${item.id}**) - **${item.price}** coins`)
            .join('\n')}`
    )
}
```

And let's make the `shop_buy` command that won't allow us to buy an item if it's locked or hidden:

```ts
if (command == prefix + 'shop_buy') {
    const [itemID, quantityString] = args
    const quantity = parseInt(quantityString) || 1

    const item = shop.find(item => item.id == parseInt(itemID) || item.name == itemID)

    if (!itemID) { // checking if item ID or its name is specified
        return message.channel.send(`${message.author}, please specify an item.`)
    }

    if (!item || item?.custom?.hidden) { // checking if the item exists and is it hidden
        return message.channel.send(`${message.author}, item not found.`)
    }

    if (item.custom.locked) { // checking is the item locked
        return message.channel.send(`${message.author}, this item is locked - you cannot buy it.`)
    }

    if (!await item.isEnoughMoneyFor(message.author.id, quantity)) { // checking if the user has enough money to buy the item
        return message.channel.send(
            `${message.author}, you don't have enough coins to buy ` +
            `**x${quantity} ${item.custom.emoji} ${item.name}**.`
        )
    }

    const buyingResult = await user.items.buy<CustomItemData>(item.id, quantity)

    if (!buyingResult.status) { // checking if failed to buy the item
        return message.channel.send(`${message.author}, failed to buy the item: ${buyingResult.message}`) as any
    }

    message.channel.send(
        `${message.author}, you bought **x${buyingResult.quantity} ` +
        `${item.custom.emoji} ${item.name}** for **${buyingResult.totalPrice}** coins.`
    )
}
```
And that's it! This is how you may use the magical `custom` property that you may never heard about before!

## Full Bot Examples
See the **full** example in a **full bot** on how to use the Custom Item Data of the items by following one of the links below (language + database):
- **[JavaScript + JSON](https://github.com/shadowplay1/discord-economy-super/blob/main/examples/json/example.js#L472)**
- **[JavaScript + MongoDB](https://github.com/shadowplay1/discord-economy-super/blob/main/examples/mongodb/example.ts#L515)**
- **[TypeScript + JSON](https://github.com/shadowplay1/discord-economy-super/blob/main/examples/json/example.ts#L473)**
- **[TypeScript + MongoDB](https://github.com/shadowplay1/discord-economy-super/blob/main/examples/mongodb/example.ts#L516)**

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
