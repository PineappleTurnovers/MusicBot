const Discord = require('discord.js');


module.exports = {
  name: 'autoplay',
  description: 'This enables youtube autoplay (only works if no other songs in queue).',
  commandtitle : 'Autoplay',
  aliases: ['autoplay', 'ap'],
  usage: 'autoplay',
  perms: 'DJ role +', 
  cooldown: 2,
  async execute(client, message, args, serverstatic){
    serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
    if (message.member.roles.cache.has(serverasigment.djroleid) || client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
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
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return message.channel.send(
        new Discord.MessageEmbed()
        .setColor(client.config.embedColors.music)
          .setDescription(`There is nothing playing.`)
      );
    const enabled = !serverQueue.autoplay;
    serverQueue.autoplay = enabled;
    message.client.queue.set(message.guild.id, serverQueue);
    if (enabled)
        return message.channel.send(
        new Discord.MessageEmbed()
        .setColor(client.config.embedColors.music)
          .setDescription(` Autoplay has been enabled.`)
      );
    else
    return message.channel.send(
        new Discord.MessageEmbed()
        .setColor(client.config.embedColors.music)
          .setDescription(` Autoplay has been disabled.`)
      );
  }
}
}