// we have a changelog.md file in './docs/general' folder
// it starts with the text below (beginning text):

/*
# Discord Economy Super

[![Downloads](https://img.shields.io/npm/dt/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)
[![Stable Version](https://img.shields.io/npm/v/discord-economy-super?style=for-the-badge)](https://www.npmjs.com/package/discord-economy-super)

<b>Discord Economy Super</b> - Easy and customizable economy module for your [Discord Bot](https://discord.js.org/#/).

## ⏰ | Changelog

*/

// and it ends with the text below (ending text):

/*
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

*/


// all the versions are listed inside a <div> tag.
// example changelog looks like this:

/*


<b>1.0.5</b>

<ul>
  <li><b>Fixed bugs.</b></li>
</ul>

<b>1.0.6</b>

<ul>
  <li><b>Fixed bugs1.</b></li>
</ul>

<b>1.0.7</b>

<ul>
  <li><b>Fixed bugs2.</b></li>
</ul>

*/

// it displays the versions from oldest to newest.
// the same thing is in real changelog.md file.

// write a code that will display the versions from newest to oldest
// and write them in a new changelog file
// inside a <div> tag including the beginning and ending texts 
// listed in the beginning in the beginning of this file.


const fs = require('fs')

function reverseChangelogVersions() {
  const changelog = fs.readFileSync('./docs/general/changelog.md', 'utf8')
  const changelogVersions = changelog.match(/<b>([0-9.]+)<\/b>/g)
  console.log(changelogVersions);

  const changelogVersionsReversed = changelogVersions.reverse()
  const changelogVersionsReversedString = changelogVersionsReversed.join('')

  const changelogReversed = changelog.replace(changelogVersions, changelogVersionsReversedString)
  fs.writeFileSync('./docs/general/changelog1.md', changelogReversed)
}

reverseChangelogVersions()