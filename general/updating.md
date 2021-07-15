# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy framework for your [Discord Bot](https://discord.js.org/#/).

## ✍ | Updating your code

## Version 1.3.2
Version 1.3.2 takes a much more object-oriented approach than previous versions. It also contains many bug fixes, optimizations and support for new Database Manager.

Here's some examples of methods that were changed in this version:
- `Economy.daily()` ==> `RewardManager.daily()`
- `Economy.getDailyCooldown()` ==> `CooldownManager.daily()`
- `Economy.all()` ==> `UtilsManager.all()`

See the [changelog](https://des-docs.tk/#/docs/main/stable/general/changelog) to see the full list of changes.

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
<b>If you found a bug, please send it in Discord to ShadowPlay#9706.</b>
<br>
<b>If you have any questions or need help, join the <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for using Discord Economy Super ❤️