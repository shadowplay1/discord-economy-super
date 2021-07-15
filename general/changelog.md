# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy framework for your [Discord Bot](https://discord.js.org/#/).

## ⏰ | Changelog
<b>1.0.1</b>
<ul>
  <li><b>The first version of the module: added a basic methods: 'Economy.fetch()', 'Economy.set()', 'Economy.add()', 'Economy.subtract()', 'Economy.daily()', 'Economy.work()', 'Economy.getDailyCooldown()', 'Economy.getWorkCooldown()', 'Economy.all()' and 'Economy.leaderboard()'. Also added an EconomyError class, but you couldn't use it yourself.</b></li>
</ul>
<b>1.0.2</b>
<ul>
  <li><b>Edited README.md</b></li>
</ul>
<b>1.0.3</b>
<ul>
  <li><b>Fixed bugs.</b></li>
</ul>
<b>1.0.4</b>
<ul>
  <li><b>Fixed bugs.</b></li>
</ul>
<b>1.0.5</b>
<ul>
  <li><b>Fixed bugs.</b></li>
</ul>
<b>1.0.6</b>
<ul>
  <li><b>Edited README.md</b></li>
  <li><b>Fixed bugs.</b></li>
  <li><b>Code optimization</b></li>
  <li><b>Now you can create a shop on your Discord server using Economy.shop methods. They are listed above.</b></li>
  <li><b>Added an 'EconomyError' class property.</b></li>
  <li><b>Added a 'dateLocale' property for options object.</b></li>
</ul>
<b>1.0.7</b>
<ul>
  <li><b>Fixed bugs</b></li>
</ul>
<b>1.0.8</b>
<ul>
<li><b>Edted README.md</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Now this module is including Events. They are listed above.</b></li>
</ul>
<b>1.1.4</b>
<ul>
<li><b>Edted README.md</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Added an update checking system for this module.</b></li>
<li><b>Added a 'checkUpdates' property for options object.</b></li>
</ul>
<b>1.1.5</b>
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
<li><b>Now you can add a role to users on your Discord server. Click <a href="https://des-docs.tk/#/docs/main/stable/class/ShopManager">here</a> for more info.</b></li>
<li><b>Added a new 'shopItemBuy' and 'shopItemUse' events.</b></li>
<li><b>Now if user try to buy an item when he reached the max amount of item in his inventory, the method will return a 'max' string.</b></li>
<li><b>Now this module has a Support Server. Click <b><a href = "https://discord.gg/4pWKq8vUnb">here</a></b> to join!</b></li>
</ul>
<b>1.1.6</b>
<ul>
<li><b>Code optimization.</b></li>
<li><b>Fixed bug with "The module is not ready to work" error on startup.</b></li>
<li><b>Removed an accidentaly added "discord.js" module from dependencies.</b></li>
</ul>
<b>1.1.7</b>
<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>TypeScript support is finally here! Created a type defenitions for this module.</b></li>
</ul>
<b>1.1.8</b>
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
<b>1.1.9</b>
<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed type defenitions.</b></li>
</ul>
<b>1.2.0</b>
<ul>
<li><b>Fixed bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed typos.</b></li>
<li><b>'Economy.shop.clearInventory()' method is working fine now.</b></li>
</ul>
<b>1.2.1</b>
<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Now 'Economy.work()' method is not taking a daily cooldown as work reward anymore.</b></li>
<li><b>Added an 'Economy.removeGuild()' method to fully remove the guild from database.</b></li>
<li><b>Added an 'Economy.removeUser()' method to to remove the user from database.</b></li>
</ul>
<b>1.2.2</b>
<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>Fixed another issues with 'Economy.work()' method...</b></li>
</ul>
<b>1.2.3</b>
<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>'Economy.leaderboard()' method will return an empty array if the leaderboard is empty.</b></li>
<li><b>Updated examples.</b></li>
<li><b>Fixed typos</b></li>
</ul>
<b>1.2.4</b>
<ul>
<li><b>Fixed minor bugs.</b></li>
<li><b>Code optimization.</b></li>
<li><b>'Economy.daily()', '.work()' and '.weekly()' methods will return an object** instead of Number | String.</b></li>
<li><b>Updated examples.</b></li>
</ul>

** The object structure will look like this:

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
    reward: Number | Array<Number> // array returns if work reward is array
}
```

<b>1.2.5</b>
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
<b>1.2.6</b>
<ul>
<li><b>Fixed typos.</b></li>
<li><b>Updated README.md.</b></li>
<li><b>Now 'ready' and 'destroy' events will return nothing (Void) instead of Boolean.</b></li>
</ul>
<b>1.2.8</b>
<ul>
<li><b>Fixed typos.</b></li>
<li><b>Fixed minor bugs.</b></li>
<li><b>Item IDs in shop and inventory are now synced with the last element of array. It fixes the bug with similar item IDs in the shop and inventory.</b></li>
</ul>
<b>1.3.0</b>
<ul>
<li><b>Fixed typos.</b></li>
<li><b>Fixed minor bugs.</b></li>
<li><b>Updated README.md.</b></li>
<li><b>Now this module has a <a href="https://des-docs.tk">documentation website</a>!</b></li>
<li><b>Added an 'Economy.docs' property that contains a link to the documentation website.</b></li>
<li><b>I think this is the last version of this module. Next versions would be only bugfixes or people's ideas. Thank you for using this module!</b></li>
</ul>
<b>1.3.2</b>
<ul>
<li><b>Fixed typos.</b></li>
<li><b>Fixed bugs.</b></li>
<li><b>Fixed the expired link to the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b></li>
<li><b>Updated README.md.</b></li>
<li><b>Updated documentation.</b></li>
<li><b>Added a bank example in module files.</b></li>
<li><b>Added more examples on <a href="https://des-docs.tk">documentation website</a>.</b></li>
<li><b>The entire module structure was rewritten on Managers.</b></li>
<li><b>Added a new Database Manager that allows you to interact with module's storage file.</b></li>
</ul>

## ❗ | Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-economy-super">NPM</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super">Github</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-economy-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<b>If you found a bug, please send it in Discord to ShadowPlay#9706.</b>
<br>
<b>If you have any questions or need help, join the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for using Discord Economy Super ❤️