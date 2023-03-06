console.clear()

/**
* @type {import('./typings/Economy')}
*/
const Economy = require('./mongodb')

const eco = new Economy({
    connection: {
        // connectionURI: 'mongodb://user:hannelbannel123@ac-s2jrfjk-shard-00-00.lame8ex.mongodb.net:27017,ac-s2jrfjk-shard-00-01.lame8ex.mongodb.net:27017,ac-s2jrfjk-shard-00-02.lame8ex.mongodb.net:27017/?ssl=true&replicaSet=atlas-12href-shard-0&authSource=admin&retryWrites=true&w=majority',
        connectionURI: 'mongodb+srv://replit:replit@cluster0.5nbla.mongodb.net/test',
        collectionName: 'economyTest',
        dbName: 'test'
    },

    debug: true,

    updater: {
        checkUpdates: false
    }
})

const wait = require('util').promisify(setTimeout)

eco.on('ready', async () => {
    try {
        console.log(eco.cache.currencies.get({guildID: '123'}));
        await wait(5000)
        console.log(eco.cache.currencies.get({guildID: '123'})[0].setCustom({test: '321'}))
    } catch(err) {
        console.log(err);
    }
    
    const user = await eco.users.get('123', '123')
    // const work = eco.users.rewards.work

    const work = await eco.rewards.getWork(user.id, user.guildID)
    const daily = await eco.rewards.getDaily(user.id, user.guildID)

    const cooldowns = await user.cooldowns.getAll()

    // eco.shop.addItem('123', {
    //     name: 'test',
    //     price: 100,
    //     description: 'testing'
    // })

    // user.buyItem(1)

    // console.log(daily, work)
    // console.log(cooldowns)
    // console.log(user.cooldowns.getAll())
})


// TODO:



// DONE:

// + support for .ts config file
// + items for each user: move a buyItem method to a class and add more methods
// + settings for each guild
// + shop fix (?)
// + work rewards fix
// + sync 'dateLocale', 'sellingItemPercent', 'subtractOnBuy' with the guild settings
// + add the 'savePurchasesHistory' setting to the guild settings
// + cooldowns for each user
// + rewards for each user
