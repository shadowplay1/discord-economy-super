/* getting the module */
const economy = require('discord-economy-super');
const eco = new economy();

module.exports = {
 name:'removemoney',
  description:'Take money away from someone',
  usage:'[mentioned user] [amount],
  execute(message, args){
  //when the command is ran 
    //getting the user
    
    let user = message.mentions.members.first();
    
    //if no user, let the author know.
    if(!user) return message.reply("There was no user mentioned!");
    
    //getting the amount
    let amount = args[1];
    
    //if it is an invalid amount, let the user know.
    if(!amount || isNaN(amount)) return message.reply("Invalid Amount Given!");
    
    //if therre is no errors:
    
    //update the balance
    //eco.balance.subtract(amount, userID, guildID)
    eco.balance.subtract(amount, user.id, message.guild.id);
    
    //then let the user know
    return message.reply("Success!");
  }
}
