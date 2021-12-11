/* getting the module */
const economy = require('discord-economy-super');
const eco = new economy();

module.exports = {
 name:'addmoney',
  description:'Give someone an amount of money',
  usage:'[mentioned user] [amount],
  execute(message, args){
  //when the command is ran 
    
    //get the user
    let user = message.mentions.members.first();
    
    //if there is no user, let the user know
    if(!user) return message.reply("You must mention a user!");
    
    //getting the amount to add
    let amount = args[1];
    
    //if there is no amount set, or if it is not a number, let the user know.
    if(!amount || isNaN(amount)) return message.reply("You have entered an invalid number!");
    
    //if there is no error:
    
    //eco.balance.add(amount to add, user id, guildID)
    
    //add the balance
    eco.balance.add(amount, user.id, message.guild.id);
    
    //let the user know it was a success
    return message.reply("Success!");
  }
}
