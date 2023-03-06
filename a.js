console.clear()

/**
* @type {import('./typings/Economy')}
*/
// console.log();

const Economy = require('./index')
// const Economy = require('des-mongo/mongo')

console.log(Economy.docs)
// console.log(Economy.BankManager)

const eco = new Economy({
    storagePath: './storage.json',
    debug: true
})

eco.on('ready', () => {
    // console.log(eco)
    // const user = new Economy.EconomyUser('123', '123', eco.options, eco.database.fetch('123')['123'])
    // const users = eco.users
    // console.log('user', users.find(x => x.id == '123'))
    // console.log(users)
    // eco.users.create('TEST_123', '123')
    // console.log('deleted', eco.guilds.create('TEST_123', '123'))

    const user = eco.users.get('123', '123')//.find(x => x.id == '123')//.find(x => x.id == '873924376293179402')
    user.inventory.find('123')

    const guild = eco.guilds.find(x => x.id == '123')//.users.get('123').inventory.get(12)//.users.get('123')
    // eco.
    // console.log(eco.guilds.all())
    // user.inventory.length
    // console.log(guild.shop);
    // user.buyItem(1)

    eco.on('balanceAdd', x => {
        console.log('added:', x.amount, x.memberID, x.reason)
    })

    // console.log(!!user)
    // console.log(user?.delete)

    // user.delete()
    eco.users.create('123', '123')
    console.log(Object.keys(user))

    user.balance.add(10, 'test')
    console.log('balance:', user.balance.get())

    // console.log(guild.shop.findItem(1))
    // console.log(guild.shop.find(x => x.edit('description', )))
    // console.log(user.history.all(), 'ALL')
    console.log('FOUND ITEM:', user.history.find(x => x.name == 'test123'))//.find(x => x.id == 1))
    // guild.shop.
    // eco.fetcher.fetchAll()
    console.log('example user id & guild ID:', user.id + ', ' + user?.guildID)
    console.log('example guild id 2', guild?.id)

    console.log(
        guild.shop.addItem({
            name: 'test123',
            description: 'test123',
            price: 100
        }).isEnoughMoneyFor('123')
    )

    // console.log(guild.shop.toArray('123'))

    //console.log(eco)
})
