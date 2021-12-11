/* getting the module */
const economy = require('discord-economy-super');
const eco = new economy();

module.exports = {
    name:"balance",
    description:"Check you or another users balance!",
    usage:"[mentioned user]",

  execute(message){
    
    //on [prefix]balance
    
    //get  the first mentioned user, if there is no one mentioned, then default it to the author of the message
        let target = message.mentions.members.first() || message.member;
        
   
    //eco.balance.fetch(users id, guildID)
    //eco.bank.fetch(users id, guildID)
  
    //getting the cash balance
        const balance = eco.balance.fetch(target.id, message.guild.id)
    //getting the bank balance
        const bank = eco.bank.fetch(target.id, message.guild.id)
        
        //returning a message via embed
        return message.channel.send({embeds:[{
            title: target.displayName +"'s Balance".toString(),
            color: colors.economy,
            fields:[{
                name:"Cash:",
                value: balance + "c",
                inline: true,
            },
            {
                name:"Bank:",
                value: bank + "c",
                inline: true,
            }]
        }]})
    }
}
