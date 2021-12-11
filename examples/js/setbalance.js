/* getting the module */
const economy = require('discord-economy-super');
const eco = new economy();

module.exports = {
 name:'setbalance',
  description:'Set someones balance to a fixed amount',
  usage:'[mentioned user] [new balance],
  execute(message, args){
  //when the command is ran 
    //get the user
  let user = message.mentions.members.first();
    
    //if there is no user, let the author of the message know
    if(!user) return message.reply("No user mentioned!");
    
    //getting the amount to set the balance to, if there is not an amount, let the user know.
    let amount = args[1];
    
    if(!amount || isNaN(amount)) return message.reply("Invalid Number!");
    
    
    //if there is no errors:
    
    //eco.balance.set(amount, userID, guildID)
    //update the balance
    eco.balance.set(amount, user.id, message.guild.id)
    
    
    //let the user know 
    return message.reply("Success!");
  }
}
