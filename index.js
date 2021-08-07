try{
    const Economy = require('./src/index')

    module.exports = Object.assign(Economy, {
        version: require('./package.json').version,
        docs: 'https://des-docs.tk'
    })
} catch(err) {
    console.log(123, '!!!')
}