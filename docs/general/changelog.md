# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy module for your [Discord Bot](https://discord.js.org/#/).

## ⏰ | Changelog


<div>

<b>v1.7.5</b>

- Fixed JSDoc typos/mismatches.
- Fixed the hard crash in **JSON** version when trying to claim `daily`, `work` or `weekly` rewards.
- Fixed the INVALID_TYPE error when getting the currencies by ID.
- **Updated the documentation** - updated the [FAQ](https://des-docs.js.org/#/docs/main/1.7.5/general/faq), added **shop** examples and more explanations of the code on [Examples](https://des-docs.js.org/#/docs/main/1.7.5/general/examples) page in the documentation + added the [Configuring Economy](https://des-docs.js.org/#/docs/main/1.7.5/general/configuring) page that explains everything about configuring the module and [Custom Item Data](https://des-docs.js.org/#/docs/main/1.7.5/general/custom-data) page explaining the `custom` property  - check them out!
- Minor bug fixes.
- Added an option for `package.json` to disable the post-install greeting logs. To disable them, you need to add this in your `package.json`:
```json
"discord-economy-super": {
    "postinstall": false
}
```
To enable them back, you need to set the `"postinstall"` property of `"discord-economy-super"` object to `true`:
```json
"discord-economy-super": {
    "postinstall": true
}
```
(or simply remove this object from your `package.json`)

<b>v1.7.4</b>

- Fixed typings.
- JSDoc changes.
- Fixed the missing configuration bug and hard crash on startup.
- Removed unnecessary things.
- Updated `EconomyItems` files.
- Added a `stacked()` method in `InventoryManager` to get the array of stacked items in the inventory.
- `InventoryItem.stack()` is no longer async! You can run it inside `Array.map()` safely now!
- `UtilsManager.checkOptions()` method was renamed to `UtilsManager.checkConfiguration()` so it could make sense.

<b>v1.7.2</b>

- Code refactoring.
- Major bug fixes.
- Fixed a hard crash on startup in JSON version.
- Fixed JSDocs.
- Fixed typings in some managers.
- Improved debugging.

<b>v1.7.1</b>

- Major bug fixes!
- Major typings fixes!
- Major JSDoc fixes!
- Improved error handling and debugging.
- Update checker fixes.
- Fixed broken inventory cache issue on startup in MongoDB version!

<br>

- **Custom currencies system! 🔥**
- Added a new `customCurrencySet`, `customCurrencyAdd` and `customCurrencySubtract` events so the changes in any custom currencies could be tracked!
- Added a new optional `currency` argument in **all item buying methods** that takes eaither *currency ID*, *name* or its *symbol* so the currency balance will be subtracted instead of core balance. Requires the `subtractOnBuy` option to be enabled.
```ts
eco.shop.buy(itemID, 'memberID', 'guildID', quantity, currency, 'reason')
```


<br>

- Added a `stack()` method for **_inventory items_** that returns the **number of specific item (quantity)** and the **total price** of it in the inventory!
- Added a new `clearDaily`, `clearWork` and `clearWeekly` methods in `CooldownItem` and `Cooldowns` classes to clear the specific cooldowns.

<br>

- Added a `save()` method for `Shop-`, `Inventory-` and `History-` **items** that allows you to edit the item's object properties save the edited objext in database!
- Added a `.toString()` method for some classes.

- `Shop-`, `Inventory-` and `History-` **items'** `itemObject` property was renamed to `rawObject` so it could make sense in the code.
- Now a warning will be displayed in console if using a dev version in both MongoDB and JSON versions (see the screenshot below).

![Development Version Usage Warning](https://cdn.discordapp.com/attachments/837068831725846568/1058154982748213359/Screenshot_27.jpg)

- Added the missing `buy()` method in `ShopItem` class.
- Added the missing `clear()` method in `Items` class.
- Fixed return values in database operations methods.

<b>v1.7.0</b>

- Major bugs/typings/JSDoc fixes!
- Fixed all the caching issues in MongoDB version! 
- Added a `create()` methods in `EconomyUser` and `EconomyGuild` classes to match the `User-` and `Guild-` managers.
- Added a new `deposit()` method in `Balance-` and `Bank-` managers and in `Balance` and `Bank` user classes.
- Added a `clearMany()` alias for `clearSpecified()` method in `CacheManager`.

<b>v1.6.9</b>

- Fixed bugs.
- Fixed typings bugs.
- Added missing JSDocs for `CacheManager` and all the `CachedItem`s!
- Added a configuration example in *Initialation Example* on the [Examples](https://des-docs.js.org/#/docs/main/1.7.5/general/examples) page of the module. 

<b>v1.6.8</b>

- Fixed bugs.
- Fixed typings bugs.
- Bank balance caching!
- Fixed the hard crash in MongoDB version when trying to obtain a balance data for the user from the cache.
- Added an `updateMany` alias for `updateSpecified` method in `CacheManager`.

<b>v1.6.7</b>

- Fixed leaderboard bugs.

<b>v1.6.6</b>

- Fixed the bug where `guildID` was `undefined` in `EmptyEconomyUser`, resulting hard crashes on lots of methods (if the user was not found).
- Removed unnecessary things.

<b>v1.6.5</b>

- Fixed the balance not caching correctly
- Fixed the `INVALID_CACHE_ITEM_NAME` error in MongoDB version that caused a hard crash on any `RewardManager` method.

<b>v1.6.4</b>

- Bug fixes
- Typings fixes

<b>v1.6.3</b>

- Major bug fixes
- Typings fixes
- Examples bug fixes
- Linting improvements

<b>v1.6.2</b>

- New `Empty-` classes for `EconomyUser` and `EconomyGuild` that will be returned if the user or guild does not exists
- Added a new `exists` property for `EconomyUser` and `EconomyGuild` classes to check if the user/guild exists in database
- Balance caching!
- Fixed bugs
- Major typings fixes
- Minor changes in documentation, JSDoc and in main README file

<b>v1.6.1</b>

<ul>
<li><b>Added a MongoDB support!</b></li>
<li><b>Fixed lots of bugs.</b></li>
<li><b>Improved typings and now they use generics!</b></li>
<li><b>Improved JSDocs.</b></li>

<li><b>

Removed the `./tests` directory from the module as nobody uses it

</b></li>
<br>
<li><b>

Added a new `BaseManager` that allows you to interact with economy items like with arrays!

</b></li>

<li><b>

Added a new `User`- and `Guild`- managers to directly interact with economy users and guilds.

</b></li>

<li><b>

Added classes for each economy subject (`ShopItem`, `InventoryItem`, etc).

</b></li>
<br>

<li><b>

Added a new `deleteAll()` method for `DatabaseManager` to wipe all the database.

</b></li>

<li><b>

Added a new `DatabaseManager.pull()` and `pop` methods.`

</b></li>
<br>

<li><b>

`DatabaseManager.keyList()` was renamed to `DatabaseManager.keysList()`.

</b></li>

<li><b>

`UtilsManager.clearStorage()` was renamed to `UtilsManager.clearDatabase()`.

</b></li>
<br>

<li><b>

`UtilsManager.reset()` method that resets the all the data from specified user in database, was renamed to `UtilsManager.resetUser()`.

</b></li>

<li><b>

`BalanceManager.pay()` was renamed to `BalanceManager.transfer()`.

</b></li>

<li><b>

`ShopManager.buy()` method's returning value is changed from weird `Boolean | 'max'` type to:

</b></li>

```ts
{
    status: boolean,
    message: string,
    item: ShopItem,
    quantity: number,
    totalPrice: number,
}
```

<li><b>

Added a new `debug` option that enables the Economy debug logs in a console.

</b></li><br>

<li><b>

`ready` event is now returning a fully woring Economy instance that was successfully initialized and could be used without any problems.

</b></li>

<li><b>

`shopItemUse` and `shopItemBuy` events are now returning an information object with guild ID, the person who performed the action, and the item the action was performed on.

</b></li>

<li><b>

All reward methods' returning values in `RewardManager` were changed from this:

</b></li>

<li><b>

`BalanceManager.transfer(...)` now returns a transfering result object instead of amount of money that was sent.

</b></li>

```ts
{
    status: boolean,
    value: number | TimeObject // money that the user received OR object with the time until the cooldown ends
    pretty: string | number // formatted cooldown time OR money that the user received
    reward: number | number[] // depends on what type of reward was specified in a config
}
```

to this:

```ts
{
    type: 'daily' | 'work' | 'weekly'
    status: boolean
    cooldown: {
        time: TimeObject // object with the time until the cooldown ends
        pretty: string // formatted cooldown time
   }
    reward: number // money that the user received
    defaultReward: number | number[] // depends on what type of reward was specified in a config
}
```

<li><b>

All reward methods' names in `RewardManager` and getting cooldowns methods in `CooldownManager` are now prefixed with `get`.<br>

For example, getting a daily reward will look like `eco.rewards.getDaily(...)` instead of `eco.rewards.daily(...)`<br>

Getting the cooldown for daily reward will look like `eco.cooldowns.getDaily(...)` instead of `eco.cooldowns.daily(...)`.</b></li>

<li><b>The message in console if the module s up to date now disabled by default.</b></li>


<br>


<li><b>

In `ShopData`, `InventoryData` and `HistoryData`, the `itemName` property was renamed to `name`.

</b></li>

<li><b>

`ShopManager.addItem(guildID, options)` method's options object now accepts the `name` property instead of `itemName`.

</b></li>

<li><b>

Added a new `custom` property to the economy items anda a new `setCustom()` method for `ShopManager` and `ShopItem` to edit a custom properties object for specified item!

</b></li>

<li><b>

Added a support for a separated configuration file! Creating a new file `economy.config.js` (or `economy.config.ts` if your project is in TypeScript) in the root directory of your project will set the config in file to the Economy constructor.

</b></li>

<br>

<li><b>Now you can specify a quantity of items to buy, sell or add to the inventory!<br>
Note that quantity and reason are always optional.</b></li>

```ts
eco.shop.buy(itemID, 'memberID', 'guildID', quantity, 'reason')
```

<br>

<li><b>

Added a new **caching** system for MongoDB! The module will cache the data in memory *on startup* and *on database updates* and will be used when you call the method. In these methods you don't have to use Promises and it will be way faster than getting data straightly from database.

```js
const databaseUser = await eco.users.get('memberID', 'guildID')
// gets the user from database - requires to invoke the Promise 
// with 'await' or '.then()'.

const cachedUser = eco.cache.users.get({
    memberID: 'memberID',
    guildID: 'guildID'
})
// gets the user from cache - doesn't require to invoke the Promise!

// it means that getting data will be many times faster
// than getting it from database directly!
```

</b></li>

</ul>

<b>v1.5.2</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Added a 'ShopManager.add()' method as alias for 'InventoryManager.addItem()' method.</b></li>
</ul>

<b>v1.5.1</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed issues with InventoryManager.</b></li>
</ul>

<b>v1.5.0</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed typings.</b></li>
<li><b>Fixed typos.</b></li>
<li><b>Fixed issues with 'ShopManager.editItem()' method.</b></li>
<li><b>Added a new 'changeElement' for the Database manager that will change the element's value in the array.</b></li>
<li><b>Added a 'InventoryManager.use()' method as alias for 'InventoryManager.useItem()' method.</b></li>
<li><b>Added a 'ShopManager.edit()' method as alias for 'ShopManager.editItem()' method.</b></li>

<li><b>Important:<br>
History related methods in ShopManager are now deprecated, but they won't be deleted.<br>
If you want to use the newest history features and get all the bugfixes,<br>
please switch to the new HistoryManager.<br>
[!!!] No help and support will be provided for deprecated methods.</b></li>
<br>

```diff
- ShopManager:

- ShopManager.history(memberID, guildID) [deprecated]
- ShopManager.clearHistory(memberID, guildID) [deprecated]


+ HistoryManager:

+ HistoryManager.fetch(memberID, guildID)
+ HistoryManager.clear(memberID, guildID)
+ HistoryManager.add(itemID, memberID, guildID)  // the 'itemID' parameter is item ID from the shop \\
+ HistoryManager.remove(memberID, guildID)
+ HistoryManager.find(id, memberID, guildID)  // the 'id' parameter is the ID of the history object \\
+ HistoryManager.search(id, memberID, guildID)  // an alias for the method above ^ \\
```

</ul>
<li><b>Now you can use the random strings in a item message!</b></li>

Syntax: `[random="item1", "item2", "etc..."]`

Example usage:

```js
eco.shop.addItem("guildID", {
  name: "good-day",
  price: 100,
  message: 'What a [random="wonderful", "great", "sunny"] day!',
});

eco.shop.buy(1, "memberID", "guildID");
eco.shop.buy(1, "memberID", "guildID");
eco.shop.buy(1, "memberID", "guildID"); // buying the item 3 times

eco.inventory.useItem(1, "memberID", "guildID"); // What a wonderful day!
eco.inventory.useItem(1, "memberID", "guildID"); // What a great day!
eco.inventory.useItem(1, "memberID", "guildID"); // What a sunny day!

// In a returning string, [random="wonderful", "great", "sunny"]
// will be replaced with the any of
// the words "wonderful", "great" or "sunny".
```

<b>v1.4.9</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed typings.</b></li>
<li><b>Added a 'savePurchasesHistory' constructor option that will indicate will the module save the purchases history or not.</b></li>
<li><b>The module will now send a message in console on startup if there's a problem with user's economy configuration.</b></li>
</ul>

<b>v1.4.8</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed typings.</b></li>
<li><b>Added a 'ShopManager.findItem()' method as alias for 'ShopManager.searchItem()' method.</b></li>
<li><b>Added a 'ShopManager.buyItem()' method as alias for 'ShopManager.buy()' method.</b></li>
<li><b>Added a 'ShopManager.fetch()' method as alias for 'ShopManager.list()' method.</b></li>
<li><b>Added a 'InventoryManager.list()' method as alias for 'InventoryManager.fetch()' method.</b></li>
<li><b>Added a 'InventoryManager.findItem()' method as alias for 'InventoryManager.searchItem()' method.</b></li>
<li><b>Added an 'InventoryManager.addItem()' method that adds the specified item to the user's inventory from the shop.</b></li>
</ul>

<b>v1.4.7</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed typings.</b></li>
<li><b>Fixed typos.</b></li>
<li><b>Fixed startup issues.</b></li>
<li><b>Fixed TypeScript examples.</b></li>
<li><b>Default date locale was changed to 'en' instead of 'ru'.</b></li>
<li><b>Now you can import all the managers directly from the module. Example:</b></li>

```js
const { BalanceManager, ShopManager } = require("discord-economy-super");
// or
import { BalanceManager, ShopManager } from "discord-economy-super";
```

<li><b>Added a new InventoryManager that includes all inventory related methods.</b></li>
<li><b>Added a 'removeItem' and 'sellItem' methods to the InventoryManager.</b></li>
<li><b>Added a new 'sellingItemPercent' option that configures the price that<br>
the item will be sold for. (It was made for InventoryManager.sellItem method)</b></li>

<li><b>Important:<br>
Inventory related methods in ShopManager are now deprecated, but they won't be deleted.<br>
If you want to use the newest inventory features and get all the bugfixes,<br>
please switch to the new InventoryManager.<br>
[!!!] No help and support will be provided for deprecated methods.</b></li>
<br>

```diff
- ShopManager:

- ShopManager.inventory(memberID, guildID) [deprecated]
- ShopManager.clearInventory(memberID, guildID) [deprecated]
- ShopManager.useItem(itemID, memberID, guildID, client?) [deprecated]
- ShopManager.searchInventoryItem(itemID, memberID, guildID) [deprecated]


+ InventoryManager:

+ InventoryManager.fetch(memberID, guildID)
+ InventoryManager.clear(memberID, guildID)
+ InventoryManager.searchItem(itemID, memberID, guildID)
+ InventoryManager.useItem(itemID, memberID, guildID, client?)
+ InventoryManager.removeItem(itemID, memberID, guildID)
+ InventoryManager.sellItem(itemID, memberID, guildID, reason?)
```

<li><b>Usage of the deprecated methods will now send a deprecation warning in the console.<br>
You can disable it by setting the `deprecationWarnings` constructor option to `false`.</b></li>
</ul>

<b>v1.4.6</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Removed "discord.js" module from dependencies that was accidentally added.</b></li>
<li><b>Fixed typings.</b></li>
</ul>

<b>v1.4.5</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed typos in a README.md.</b></li>
<li><b>Improved the FAQ.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Improved the quality of the code.</b></li>
<li><b>Added a new 'Economy.shop.searchInventoryItem()' method that searches for the item in user's inventory.</b></li>
<li><b>Improved the typings: fixed wrong types and typos and replaced the "any" types with method's generic type parameters.</b></li>
<li><b>TypeScript Examples!</b></li>
</ul>

<b>v1.4.4</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
</ul>

<b>v1.4.3</b>

<ul>
<li><b>Fixed bugs.</b></li>
</ul>

<b>v1.4.2</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed typings.</b></li>

</ul>

<b>v1.4.1</b>

<ul>
<li><b>Fixed bugs.</b></li>
</ul>

<b>v1.4.0</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed typings.</b></li>
<li><b>Now you can put an array with 2 numbers in 'dailyAmount' and 'weeklyAmount' options.</b></li>
<li><b>Now you can setup the module on different guilds using the brand new Settings Manager.</b></li>
<li><b>Removed 'lodash' from the dependencies.</b></li>
<li><b>Made a function that checks the Node.js version on the start.</b></li>
</ul>

<b>v1.3.9</b>

<ul>
<li><b>Fixed typings.</b></li>
</ul>

<b>v1.3.8</b>

<ul>
<li><b>Fixed typings.</b></li>
<li><b>Fixed a hard crash with 'Economy.rewards.work()' method.</b></li>
</ul>

<b>v1.3.7</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed the hard crash if economy configuration is not specified.</b></li>
</ul>

<b>v1.3.6</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed typos.</b></li>
<li><b>Fixed typings.</b></li>
<li><b>Fixed the economy options resetting to default.</b></li>
</ul>

<b>v1.3.5</b>

<ul>
<li><b>Fixed the 'Cannot find module `structures/Errors`' error.</b></li>
<li><b>Fixed bugs in typings.</b></li>
</ul>

<b>v1.3.4</b>

<ul>
<li><b>Full code rewrite.</b></li>
<li><b>Lots of bugfixes.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed typos.</b></li>
<li><b>Added a new Fetch Manager that allows you to fetch data from database.</b></li>
<li><b>Added an 'add()', 'subtract()', 'push()' and 'removeElement()' methods in Database Manager.</b></li>
<li><b>Added a 'checkOptions()' and 'reset()' methods in Utils Manager.</b></li>
<li><b>Added an 'optionsChecker' object property in constructor options.</b></li>
<li><b>Added a 'subtractOnBuy' property in constructor options.</b></li>
<li><b>All typings were separated into files.</b></li>
<li><b><a href="https://des-docs.js.org">Documentation</a> update: now you can view the docs for a multiple module versions.</b></li>
<li><b><a href="https://des-docs.js.org">Documentation</a> update: now you can view the weekly downloads of the module on it's main page.</b></li>
<li><b>... and more!</b></li>
</ul>

<b>v1.3.3</b>

<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Fixed bugs with Database Manager.</b></li>
</ul>

<b>v1.3.2</b>

<ul>
<li><b>Fixed typos.</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed the expired link to the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b></li>
<li><b>Updated README.md.</b></li>
<li><b>Updated documentation.</b></li>
<li><b>Added a bank example in module files.</b></li>
<li><b>Added more examples on <a href="https://des-docs.js.org">documentation website</a>.</b></li>
<li><b>The entire module structure was rewritten on Managers.</b></li>
<li><b>Added a new Database Manager that allows you to interact with module's storage file.</b></li>

<b>v1.3.0</b>

<ul>
<li><b>Fixed typos.</b></li>
<li><b>Fixed minor bugs.</b></li>
<li><b>Updated README.md.</b></li>
<li><b>Now this module has a <a href="https://des-docs.js.org">documentation website</a>!</b></li>
<li><b>Added an 'Economy.docs' property that contains a link to the documentation website.</b></li>
</ul>

<b>v1.2.8</b>

<ul>
<li><b>Fixed typos.</b></li>
<li><b>Fixed minor bugs.</b></li>
<li><b>Item IDs in shop and inventory are now synced with the last element of array. It fixes the bug with similar item IDs in the shop and inventory.</b></li>
</ul>

<b>v1.2.6</b>

<ul>
<li><b>Fixed typos.</b></li>
<li><b>Updated README.md.</b></li>
<li><b>Now 'ready' and 'destroy' events will return nothing (Void) instead of Boolean.</b></li>
</ul>

<b>v1.2.5</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed typos.</b></li>
<li><b>Updated typings.</b></li>
<li><b>Updated examples.</b></li>
<li><b>discord.js is no longer imported in the module.</b></li>
<li><b>Added a 'ready' and 'destroy' events. <a href = "https://www.npmjs.com/package/discord-economy-super#module-events">Learn more</a>.</b></li>
<li><b>All balance and bank methods were moved to objects. <a href = "https://www.npmjs.com/package/discord-economy-super#balance-methods">Learn more</a>.</b></li>
<b>Here is the difference between v1.2.4 and v1.2.5.</b>

```diff
- eco.fetch('123', '123')
- eco.set(10, '123', '123')
- eco.add(10, '123', '123')
- eco.subtract(10, '123', '123')
- eco.leaderboard('123')

+ eco.balance.fetch('123', '123')
+ eco.balance.set(10, '123', '123')
+ eco.balance.add(10, '123', '123')
+ eco.balance.subtract(10, '123', '123')
+ eco.balance.leaderboard('123')

- eco.bankFetch('123', '123')
- eco.bankSet(10, '123', '123')
- eco.bankAdd(10, '123', '123')
- eco.bankSubtract(10, '123', '123')
- eco.bankLeaderboard('123')

+ eco.bank.fetch('123', '123')
+ eco.bank.set(10, '123', '123')
+ eco.bank.add(10, '123', '123')
+ eco.bank.subtract(10, '123', '123')
+ eco.bank.leaderboard('123')
```

<li><b>'Economy.balance.leaderboard()' and 'Economy.bank.leaderboard()' methods arrays are now have an 'index' property in object.</b></li>
</ul>

<b>v1.2.4</b>

<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>'Economy.daily()', '.work()' and '.weekly()' methods will return an object** instead of Number | String.</b></li>
<li><b>Updated examples.</b></li>
</ul>

\*\* The object structure will look like this:

```js
{
    status: Boolean,
    value: { // object returns if reward is already claimed; else - number
        days: Number,
        hours: Number,
        minutes: Number,
        seconds: Number,
        milliseconds: Number
    },
    pretty: String | Number,
    reward: Number | Number[] // array returns if work reward is array
}
```

<b>v1.2.3</b>

<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>'Economy.leaderboard()' method will return an empty array if the leaderboard is empty.</b></li>
<li><b>Updated examples.</b></li>
<li><b>Fixed typos</b></li>
</ul>

<b>v1.2.2</b>

<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed another issues with 'Economy.work()' method...</b></li>
</ul>

<b>v1.2.1</b>

<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Now 'Economy.work()' method is not taking a daily cooldown as work reward anymore.</b></li>
<li><b>Added an 'Economy.removeGuild()' method to fully remove the guild from database.</b></li>
<li><b>Added an 'Economy.removeUser()' method to to remove the user from database.</b></li>
</ul>

<b>v1.2.0</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed typos.</b></li>
<li><b>'Economy.shop.clearInventory()' method is working fine now.</b></li>
</ul>

<b>v1.1.9</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed type defenitions.</b></li>
</ul>

<b>v1.1.8</b>

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

<b>v1.1.7</b>

<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>TypeScript support is finally here! Created a type defenitions for this module.</b></li>
</ul>

<b>v1.1.6</b>

<ul>
<li><b>Code optimization.</b></li>
<li><b>Fixed bug with "The module is not ready to work" error on startup.</b></li>
<li><b>Removed an accidentaly added "discord.js" module from dependencies.</b></li>
</ul>

<b>v1.1.5</b>

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
<li><b>Now you can add a role to users on your Discord server. Click <a href="https://des-docs.js.org/#/docs/main/1.4.1/class/ShopManager">here</a> for more info.</b></li>
<li><b>Added a new 'shopItemBuy' and 'shopItemUse' events.</b></li>
<li><b>Now if user try to buy an item when he reached the max amount of item in their inventory, the method will return a 'max' string.</b></li>
<li><b>Now this module has a Support Server. Click <b><a href = "https://discord.gg/4pWKq8vUnb">here</a></b> to join!</b></li>
</ul>

<b>v1.1.4</b>

<ul>
<li><b>Edted README.md</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Added an update checking system for this module.</b></li>
<li><b>Added a 'checkUpdates' property for economy configuration.</b></li>
</ul>

<b>v1.0.8</b>

<ul>
<li><b>Edted README.md</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Now this module is including Events. They are listed above.</b></li>
</ul>

<b>v1.0.7</b>

<ul>
  <li><b>Fixed bugs</b></li>
</ul>

<b>v1.0.6</b>

<ul>
  <li><b>Edited README.md</b></li>
  <li><b>Fixed bugs.</b></li>
  <li><b>Code optimization</b></li>
  <li><b>Now you can create a shop on your Discord server using Economy.shop methods. They are listed above.</b></li>
  <li><b>Added an 'EconomyError' class property.</b></li>
  <li><b>Added a 'dateLocale' property for economy configuration.</b></li>
</ul>

<b>v1.0.5</b>

<ul>
  <li><b>Fixed bugs.</b></li>
</ul>

<b>v1.0.4</b>

<ul>
  <li><b>Fixed bugs.</b></li>
</ul>

<b>v1.0.3</b>

<ul>
  <li><b>Fixed bugs.</b></li>
</ul>

<b>v1.0.2</b>

<ul>
  <li><b>Edited README.md</b></li>
</ul>

<b>v1.0.1</b>

<ul>
  <li><b>The first version of the module: added a basic methods: 'Economy.fetch()', 'Economy.set()', 'Economy.add()', 'Economy.subtract()', 'Economy.daily()', 'Economy.work()', 'Economy.getDailyCooldown()', 'Economy.getWorkCooldown()', 'Economy.all()' and 'Economy.leaderboard()'. Also added an EconomyError class, but you couldn't use it yourself.</b></li>
</ul>

</div>

## ❗ | Useful Links

<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-economy-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>

<br>
<b>If you found a bug, have any questions or need help, join the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for choosing Discord Economy Super ❤️
