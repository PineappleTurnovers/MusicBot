const Discord = require('discord.js');


module.exports = {
  name: 'stop',
  description: 'This command stops music and leaves vc.',
  commandtitle : 'Stop',
  aliases: ['stop', 'disconnect', 'dc', 'frickbilly'],
  usage: 'stop',
  perms: 'Mini DJ role +',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid)||client.config.devs.includes(message.author.id) || message.member.hasPermission("ADMINISTRATOR")){
    const { channel } = message.member.voice;
    const serverTrivia = message.client.trivia.get(message.guild.id);
    if (serverTrivia){
      return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but trivia is playing!`));
    }
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
    serverQueue.connection.disconnect();
    client.queue.delete(message.guild.id);
    return message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
      .setDescription(` Queue ended or you stopped me, thanks for listening!`));
    
      }
      else{
        message.channel.send(new Discord.MessageEmbed()
        .setColor(client.config.embedColors.music)
  .setDescription(`Insufficient role permissions`));
      }
}}
