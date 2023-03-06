# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy module for your [Discord Bot](https://discord.js.org/#/).

## ✍ | Updating your code

## Version 1.6.1

This version takes much approach on object-orience. The most important changes are:

- new `User-` and `Guild-` managers which are used to get user and guild data from MongoDB.
- separated classes for every Economy entity (`ShopItem`, `InventoryItem`, `EconomyGuild`, `EconomyUser`, etc)
- separated classes for every Economy action on users and guilds (`Shop`, `Inventory`, `Rewards`, etc)
- some of the methods' names and/or return values were changed to make them sound better and more natural. (for example: `BalanceManager.pay(...)` → `BalanceManager.transfer(...)`)
- some of the getter methods and their aliases' names were changed.
- powerful database caching system for MongoDB
- ... and many more! You can see the full [changelog](https://des-docs.js.org/#/docs/main/1.7.5/general/changelog) to see all the changes: it will help you on migrating to v1.6.1.

These changes does not mean you will have to stop using the managers directly. You can use them as you normally would. Classes were provided as another way to use the Economy and make the code cleaner and more readable and understandable. Usage of managers is not deprecated or removed in this update. So, it means, you don't have to do much changes to make your code working again. 

For example, this code will work as before:
```js
const balance = eco.balance.get('123', '123')
const inventory = eco.inventory.get('123', '123')

console.log(balance)
console.log(inventory)
```

If you're looking for MongoDB migration guide, see the [MongoDB Migration Guide](https://des-docs.js.org/#/docs/main/1.7.5/general/migrating-to-mongo).

## Version 1.5.0

In version 1.5.0, all history related methods in ShopManager are deprecated.
It's highly recommended to switch to the new HistoryManager:

- `ShopManager.history()` ==> `HistoryManager.fetch()`
- `ShopManager.clearHistory()` ==> `HistoryManager.clear()`

See the [changelog](https://des-docs.js.org/#/docs/main/1.5.2general/changelog) for the full list of changes.

## Version 1.4.7

Since version 1.4.7, all deprecated methods/properties will not be deleted, but not be recommended to use.<br>
If you want to receive all the new features and bugfixes, please consider switching from using the deprecated methods/properties.<br>
[!!!] No support will be provided for any deprecated method or property.

In this version, all inventory related methods in ShopManager are deprecated.
It's highly recommended to switch to the new InventoryManager:

- `ShopManager.inventory()` ==> `InventoryManager.fetch()`
- `ShopManager.clearInventory()` ==> `InventoryManager.clear()`
- `ShopManager.useItem()` ==> `InventoryManager.useItem()`
- `ShopManager.searchInventoryItem()` ==> `InventoryManager.searchItem()`

See the [changelog](https://des-docs.js.org/#/docs/main/1.4.7/general/changelog) for the full list of changes.

## Version 1.3.2

Version 1.3.2 takes a much more object-oriented approach than previous versions. It also contains many bug fixes, optimizations and support for new Database Manager.

Here's some examples of methods that were changed in this version:

- `Economy.daily()` ==> `RewardManager.daily()`
- `Economy.getDailyCooldown()` ==> `CooldownManager.daily()`
- `Economy.all()` ==> `UtilsManager.all()`
  <br>

So you have to change your code like this:

- `eco.daily()` ==> `eco.rewards.daily()`
- `eco.getDailyCooldown()` ==> `eco.cooldowns.daily()`
- `eco.all()` ==> `eco.utils.all()`

See the [changelog](https://des-docs.js.org/#/docs/main/1.3.2/general/changelog) for the full list of changes.

## Version 1.2.5

In version 1.2.5 everything was optimized and all balance and bank balance methods were moved to objects:

```diff
- eco.fetch('memberID', 'guildID')
- eco.set(amount, 'memberID', 'guildID')
- eco.add(amount, 'memberID', 'guildID')
- eco.subtract(amount, 'memberID', 'guildID')
- eco.leaderboard('guildID')

+ eco.balance.fetch('memberID', 'guildID')
+ eco.balance.set(amount, 'memberID', 'guildID')
+ eco.balance.add(amount, 'memberID', 'guildID')
+ eco.balance.subtract(amount, 'memberID', 'guildID')
+ eco.balance.leaderboard('guildID')

- eco.bankFetch('memberID', 'guildID')
- eco.bankSet(amount, 'memberID', 'guildID')
- eco.bankAdd(amount, 'memberID', 'guildID')
- eco.bankSubtract(amount, 'memberID', 'guildID')
- eco.bankLeaderboard('guildID')

+ eco.bank.fetch('memberID', 'guildID')
+ eco.bank.set(amount, 'memberID', 'guildID')
+ eco.bank.add(amount, 'memberID', 'guildID')
+ eco.bank.subtract(amount, 'memberID', 'guildID')
+ eco.bank.leaderboard('guildID')
```

## ❗ | Useful Links

<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-economy-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<b>If you found a bug, have any questions or need help, join the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for choosing Discord Economy Super ❤️
