const Discord = require('discord.js');


module.exports = {
  name: 'loop',
  description: 'This command loops current song.',
  commandtitle : 'Loop',
  aliases: ['loop', 'l'],
  usage: 'loop',
  perms: 'Mini DJ role +',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid)||message.member.roles.cache.has(serverasigment.minidjroleid) ||client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
    const serverQueue = message.client.queue.get(message.guild.id);
    const serverTrivia = message.client.trivia.get(message.guild.id);
    if (serverTrivia){
      return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but trivia is playing!`));
    }
    const { channel } = message.member.voice;
    if (!channel)
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`I'm sorry but you need to be in a voice channel to do this command!`)
    );
    if (!serverQueue)
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`There is nothing playing.`)
    );
    serverQueue.loop = !serverQueue.loop;
    message.client.queue.set(message.guild.id, serverQueue);
    if(serverQueue.loop){ 
        serverQueue.loopQueue = false;
        message.client.queue.set(message.guild.id, serverQueue);
        return message.channel.send(
          new Discord.MessageEmbed()
          .setColor(client.config.embedColors.music)
          .setDescription('**🔁 Looped current song!**'));
    }
    else{
        return message.channel.send(
          new Discord.MessageEmbed()
          .setColor(client.config.embedColors.music)
          .setDescription('**🔁 Unlooped current song!**'));      
    }
  } 
  else{
    message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
  }
  
}
}